import { createAccessorModelProxy } from "./createAccessorModelProxy";
import assert from "assert";

interface Model {
   firstName: string;
   address: {
      city: string;
      streetNumber: number;
   };
}

describe("createAccessorModelProxy", () => {
   it("generates correct paths", () => {
      let model = createAccessorModelProxy<Model>();
      assert.strictEqual(model.firstName.toString(), "firstName");
      assert.strictEqual(model.address.toString(), "address");
      assert.strictEqual(model.address.city.toString(), "address.city");
   });

   it("can be used in string templates", () => {
      let model = createAccessorModelProxy<Model>();
      assert.strictEqual("address.city", `${model.address.city}`);
      assert.strictEqual("address.city", "" + model.address.city);
      assert.strictEqual("address.city.suffix", model.address.city + ".suffix");
   });

   it("nameOf returns name of the last prop ", () => {
      let model = createAccessorModelProxy<Model>();
      assert.strictEqual(model.firstName.nameOf(), "firstName");
      assert.strictEqual(model.address.nameOf(), "address");
      assert.strictEqual(model.address.city.nameOf(), "city");
      assert.strictEqual(model.address.nameOf(), "address");

      let { streetNumber, city } = model.address;
      assert.strictEqual(streetNumber.nameOf(), "streetNumber");
      assert.strictEqual(city.nameOf(), "city");
   });
});
