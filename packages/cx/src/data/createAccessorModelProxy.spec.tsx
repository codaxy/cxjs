import { createAccessorModelProxy } from "./createAccessorModelProxy";
import assert from "assert";

interface Model {
   firstName: string;
   address: {
      city: string;
   };
}

describe("createAccessorModelProxy", () => {
   it("generates correct paths", () => {
      var model = createAccessorModelProxy<Model>();
      assert.strictEqual(model.firstName.toString(), "firstName");
      assert.strictEqual(model.address.toString(), "address");
      assert.strictEqual(model.address.city.toString(), "address.city");
   });
});
