import { StructuredSelector } from "./StructuredSelector";
import assert from "assert";
import { createAccessorModelProxy } from "./createAccessorModelProxy";

describe("StructuredSelector", function () {
   describe("#create()", function () {
      it("constants", function () {
         var x = {};
         var s = new StructuredSelector({
            props: {
               a: undefined,
               b: undefined,
            },
            values: {
               a: 1,
               b: 2,
            },
         }).create(x);

         assert.deepEqual(s(x), { a: 1, b: 2 });
      });

      it("bindings", function () {
         var x = { a: 1, b: 2 };
         var s = new StructuredSelector({
            props: {
               a: undefined,
               b: undefined,
            },
            values: {
               a: { bind: "b" },
               b: { bind: "a" },
            },
         }).create(x);

         assert.deepEqual(s(x), { a: 2, b: 1 });
      });

      it("templates", function () {
         var x = { a: 1, b: 2 };
         var s = new StructuredSelector({
            props: {
               a: undefined,
               b: undefined,
            },
            values: {
               a: { tpl: "b{a}" },
               b: { tpl: "a{b}" },
            },
         }).create(x);

         assert.deepEqual(s(x), { a: "b1", b: "a2" });
      });

      it("structured", function () {
         var x = { a: 1, b: 2 };
         var s = new StructuredSelector({
            props: {
               a: {
                  structured: true,
               },
               b: undefined,
            },
            values: {
               a: {
                  x: { expr: "{a} == 1" },
                  y: { expr: "{b} == 1" },
               },
               b: { tpl: "a{b}" },
            },
         }).create(x);

         assert.deepEqual(s(x), { a: { x: true, y: false }, b: "a2" });
      });
   });

   it("structures do not change if data doesn't change", function () {
      var x = { a: 1, b: 2 };
      var s = new StructuredSelector({
         props: {
            a: {
               structured: true,
            },
         },
         values: {
            a: {
               x: { expr: "{a} == 1" },
               y: { expr: "{b} == 1" },
            },
            b: { tpl: "a{b}" },
         },
      }).create(x);

      let r1 = s(x);
      let r2 = s(x);

      assert.equal(r1, r2);
   });

   it("structures do not change if data doesn't change", function () {
      var x = { a: { b: 2 } };
      var m = createAccessorModelProxy();
      var s = new StructuredSelector({
         props: {
            b: undefined,
         },
         values: {
            b: m.a.b,
         },
      }).create(x);
      assert.deepEqual(s(x), { b: 2 });
   });
});
