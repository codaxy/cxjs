import { getSelector } from "./getSelector";
import assert from "assert";
import { createAccessorModelProxy } from "./createAccessorModelProxy";

describe("getSelector", function () {
   it("array of selectors converts each element into a selector", function () {
      let arraySelector = [{ bind: "name" }, { expr: "{name}" }];
      let state = { name: "Joe" };
      let selector = getSelector(arraySelector);
      assert.deepEqual(selector(state), ["Joe", "Joe"]);
   });

   it("get can be used for selectors that have set defined too ", function () {
      let selector = getSelector({ get: (data) => data.name, set: () => {} });
      assert.deepEqual(selector({ name: "Jack" }), "Jack");
   });

   it("0 is a valid selector", function () {
      let selector = getSelector(0);
      assert.deepEqual(selector({}), 0);
   });

   it("false is a valid selector", function () {
      let selector = getSelector(false);
      assert.deepEqual(selector({}), false);
   });

   it("undefined is a valid selector", function () {
      let selector = getSelector(undefined);
      assert(selector({}) === undefined);
   });

   it("null is a valid selector", function () {
      let selector = getSelector(null);
      assert(selector({}) === null);
   });

   it("works with accessor chains", function () {
      let m = createAccessorModelProxy();
      let selector = getSelector(m.a.b);
      assert(selector({ a: { b: 1 } }) === 1);
   });
});
