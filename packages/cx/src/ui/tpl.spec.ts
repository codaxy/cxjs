import { tpl } from "./tpl";
import assert from "assert";
import { createAccessorModelProxy } from "../data/createAccessorModelProxy";

interface Model {
   firstName: string;
   lastName: string;
   age: number;
   city: string;
}

describe("tpl", function () {
   const m = createAccessorModelProxy<Model>();

   describe("string-only form", function () {
      it("returns a tpl object", function () {
         const result = tpl("{firstName} {lastName}");
         assert.deepStrictEqual(result, { tpl: "{firstName} {lastName}" });
      });
   });

   describe("accessor chain form", function () {
      it("formats with a single accessor", function () {
         const selector = tpl(m.firstName, "Hello, {0}!");
         assert.strictEqual(selector({ firstName: "John" }), "Hello, John!");
      });

      it("formats with two accessors", function () {
         const selector = tpl(m.firstName, m.lastName, "{0} {1}");
         assert.strictEqual(selector({ firstName: "John", lastName: "Doe" }), "John Doe");
      });

      it("formats with three accessors", function () {
         const selector = tpl(m.firstName, m.lastName, m.age, "{0} {1} is {2} years old");
         assert.strictEqual(
            selector({ firstName: "John", lastName: "Doe", age: 30 }),
            "John Doe is 30 years old",
         );
      });

      it("formats with four accessors", function () {
         const selector = tpl(m.firstName, m.lastName, m.age, m.city, "{0} {1}, {2}, from {3}");
         assert.strictEqual(
            selector({ firstName: "John", lastName: "Doe", age: 30, city: "NYC" }),
            "John Doe, 30, from NYC",
         );
      });

      it("handles null values", function () {
         const selector = tpl(m.firstName, m.lastName, "{0} {1}");
         assert.strictEqual(selector({ firstName: "John", lastName: null }), "John ");
      });

      it("handles undefined values", function () {
         const selector = tpl(m.firstName, m.lastName, "{0} {1}");
         assert.strictEqual(selector({ firstName: undefined, lastName: "Doe" }), " Doe");
      });

      it("supports formatting in template", function () {
         const selector = tpl(m.age, "Age: {0:n;0}");
         assert.strictEqual(selector({ age: 30 }), "Age: 30");
      });

      it("supports null text in template", function () {
         const selector = tpl(m.firstName, "Name: {0|N/A}");
         assert.strictEqual(selector({ firstName: null }), "Name: N/A");
      });
   });
});
