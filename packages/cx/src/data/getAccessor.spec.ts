import assert from "assert";
import { createAccessorModelProxy } from "./createAccessorModelProxy";
import { getAccessor } from "./getAccessor";

describe("getAccessor", function () {
   it("works with accessor chains", function () {
      let m = createAccessorModelProxy<{ a: { b: any } }>();
      let accessor = getAccessor(m.a.b);
      assert(typeof accessor.set == "function");
   });
});
