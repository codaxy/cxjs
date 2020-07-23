import { computable } from "./computable";
import assert from "assert";

describe("computable", function () {
   it("creates a selector", function () {
      let state = { person: { name: "Joe" } };
      let nameLength = computable("person.name", (name) => name.length);
      assert.equal(nameLength(state), 3);
   });

   it("fires every time if not memoized", function () {
      let state = { person: { name: "Joe" } };
      let fired = 0;
      let nameLength = computable("person.name", (name) => {
         fired++;
         return name.length;
      });
      assert.equal(nameLength(state), 3);
      assert.equal(nameLength(state), 3);
      assert.equal(fired, 2);
   });

   it("fires once if memoized and data has not changed", function () {
      let state = { person: { name: "Joe" } };
      let fired = 0;
      let nameLength = computable("person.name", (name) => {
         fired++;
         return name.length;
      }).memoize();
      assert.equal(nameLength(state), 3);
      assert.equal(nameLength(state), 3);
      assert.equal(fired, 1);
   });

   //weird but that's how triggers work and
   it("memoize with warmup data will not call compute", function () {
      let state = { person: { name: "Joe" } };
      let fired = 0;
      let nameLength = computable("person.name", (name) => {
         fired++;
         return name.length;
      }).memoize(state);
      assert.equal(nameLength(state), undefined);
      assert.equal(nameLength(state), undefined);
      assert.equal(fired, 0);
   });
});
