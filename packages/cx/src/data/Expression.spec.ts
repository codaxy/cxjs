import { Expression } from "./Expression";
import assert from "assert";
import { StringTemplate } from "./StringTemplate";

describe("Expression", function () {
   describe("#compile()", function () {
      it("returns a selector", function () {
         let e = Expression.compile("{person.name}");
         let state = {
            person: {
               name: "Jim",
            },
         };
         assert.equal(e(state), "Jim");
      });

      it("ignores bindings in strings", function () {
         let e = Expression.compile('"{person.name}"');
         let state = {
            person: {
               name: "Jim",
            },
         };
         assert.equal(e(state), "{person.name}");
      });

      it("allows mixed curly braces in strings", () => {
         let e = Expression.compile('"Hello {" + "person.name}"');
         assert.equal(e({}), "Hello {person.name}");
      });

      it("properly encodes quotes #1", function () {
         let e = Expression.compile('"\'"');
         let state = {};
         assert.equal(e(state), "'");
      });

      it("properly encodes quotes #2", function () {
         let e = Expression.compile('"\\""');
         let state = {};
         assert.equal(e(state), '"');
      });

      it("properly encodes quotes #3", function () {
         let e = Expression.compile('"\\\\\\""');
         let state = {};
         assert.equal(e(state), '\\"');
      });

      it("properly encodes quotes #4", function () {
         let e = Expression.compile('"\\\\"');
         let state = {};
         assert.equal(e(state), "\\");
      });
   });

   describe("allow subexpressions", function () {
      it("in square brackets", function () {
         let e = Expression.compile("{[{person.name}]}");
         let state = {
            person: {
               name: "Jim",
            },
         };
         assert.equal(e(state), "Jim");
      });

      it("in square brackets", function () {
         let e = Expression.compile("{[{person.alias} || {person.name}]}");
         let state = {
            person: {
               name: "Jim",
               alias: "J",
            },
         };
         assert.equal(e(state), "J");
      });

      it("prefixed with % sign", function () {
         let e = Expression.compile("%{1+1}");
         assert.equal(e({}), "2");
      });

      it("can be formatted", function () {
         let e = Expression.compile("{[1+1]:f;2}");
         assert.equal(e({}), "2.00");
      });

      it("n level deep", function () {
         let e = Expression.compile("{[{[{[1+1]}]}]:f;2}");
         assert.equal(e({}), "2.00");
      });

      it("with complex math inside", function () {
         let e = Expression.compile("%{{data}.reduce((a,b)=>a+b, 0):f;2}");
         let state = {
            data: [1, 2, 3],
         };
         assert.equal(e(state), "6.00");
      });

      it("with a conditional operator inside", function () {
         let e = Expression.compile('{[true ? "T" : "F"]}');
         assert.equal(e({}), "T");
      });

      it("with string interpolation inside", function () {
         let e = Expression.compile("{[`${{test}}`]}");
         assert.equal(e({ test: "T" }), "T");
      });
   });

   describe("are working", function () {
      it("function expressions with get", function () {
         let e = Expression.get((get) => get("a") + get("b"));
         assert.equal(e({ a: 1, b: 2 }), 3);
      });

      it("are properly memoized", function () {
         let inv = 0;
         let e = Expression.get((get) => {
            inv++;
            return get("a") + get("b");
         }).memoize();

         assert.equal(e({ a: 1, b: 1 }), 2);
         assert.equal(inv, 1);

         assert.equal(e({ a: 1, b: 1 }), 2);
         assert.equal(inv, 1);

         assert.equal(e({ a: 1, b: 2 }), 3);
         assert.equal(inv, 2);

         assert.equal(e({ a: 1, b: 2 }), 3);
         assert.equal(inv, 2);

         assert.equal(e({ a: 2, b: 2 }), 4);
         assert.equal(inv, 3);
      });

      it("formatting can be used inside bindings", function () {
         let e = Expression.get((get) => get("name:prefix;Hello "));
         assert(e({ name: "CxJS" }), "Hello CxJS");
      });

      it("allows using the fmt function inside", function () {
         let e = Expression.compile('{[fmt({text}, "prefix;Hello ")]}');
         assert.equal(e({ text: "CxJS" }), "Hello CxJS");
      });

      it("allows using dashes inside names", function () {
         let e = Expression.compile("{framework-name}");
         assert.equal(e({ "framework-name": "CxJS" }), "CxJS");
      });

      it("allows using spaces and other characters inside names", function () {
         let e = Expression.compile("{1nv@lid js ident1fier}");
         assert.equal(e({ "1nv@lid js ident1fier": "CxJS" }), "CxJS");
      });

      it("allows strings in subexpressions", () => {
         let e = Expression.compile("{['1']}");
         assert.equal(e({}), "1");

         let e2 = Expression.compile('%{"1"}');
         assert.equal(e({}), "1");
      });

      it("allows string templates in nested expressions", () => {
         Expression.registerHelper("tpl", StringTemplate.format);
         let e = Expression.compile("tpl('{0:n;2} {1:p;2:wrap;(;)}', {value}, {percentage})");
         assert.equal(e({ value: 1, percentage: 0.02 }), "1.00 (2.00%)");

         let e2 = Expression.compile("{[tpl('{0:n;2} {1:p;2:wrap;(;)}', {value}, {percentage})]}");
         assert.equal(e2({ value: 1, percentage: 0.02 }), "1.00 (2.00%)");

         // we're going to need a better parser for this
         // let e3 = Expression.compile("%{tpl('{0:n;2} {1:p;2:wrap;(;)}', {value}, {percentage})}");
         // assert.equal(e3({ value: 1, percentage: 0.02 }), "1.00 (2.00%)");
      });

      it("string templates can be in the data", () => {
         Expression.registerHelper("tpl", StringTemplate.format);
         let e = Expression.compile("tpl({template}, {value}, {percentage})");
         assert.equal(e({ value: 1, percentage: 0.02, template: "{0:n;2} {1:p;2:wrap;(;)}" }), "1.00 (2.00%)");
      });

      // it('are properly memoized with proxies', function () {
      //    let inv = 0;
      //    let e = Expression.get(d => { inv++; return d.a + d.b}).memoize();
      //
      //    assert.equal(e({ a: 1, b: 1 }), 2);
      //    assert.equal(inv, 1);
      //
      //    assert.equal(e({ a: 1, b: 1 }), 2);
      //    assert.equal(inv, 1);
      //
      //    assert.equal(e({ a: 1, b: 2 }), 3);
      //    assert.equal(inv, 2);
      //
      //    assert.equal(e({ a: 1, b: 2 }), 3);
      //    assert.equal(inv, 2);
      //
      //    assert.equal(e({ a: 2, b: 2 }), 4);
      //    assert.equal(inv, 3);
      // });
      //
      // it('are properly memoized with proxies and deep data', function () {
      //    let inv = 0;
      //    let e = Expression.get(d => { inv++; return d.v.a + d.v.b}).memoize();
      //
      //    assert.equal(e({ v: { a: 1, b: 1 }}), 2);
      //    assert.equal(inv, 1);
      //
      //    assert.equal(e({ v: { a: 1, b: 1 }}), 2);
      //    assert.equal(inv, 1);
      //
      //    assert.equal(e({ v: { a: 1, b: 2 }}), 3);
      //    assert.equal(inv, 2);
      //
      //    assert.equal(e({ v: { a: 1, b: 2 }}), 3);
      //    assert.equal(inv, 2);
      //
      //    assert.equal(e({ v: { a: 2, b: 2 }}), 4);
      //    assert.equal(inv, 3);
      // });
   });
});
