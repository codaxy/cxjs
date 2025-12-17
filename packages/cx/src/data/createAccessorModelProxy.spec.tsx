import { createAccessorModelProxy } from "./createAccessorModelProxy";
import assert from "assert";

interface Model {
   firstName: string;
   address: {
      city: string;
      streetNumber: number;
   };
   "@crazy": string;
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

   it("allows non-standard property identifiers ", () => {
      let model = createAccessorModelProxy<Model>();
      assert.strictEqual(model["@crazy"].nameOf(), "@crazy");
   });

   it("AccessorChain<any> allows access to any property", () => {
      // When using an untyped model (any), all property access should be allowed
      let model = createAccessorModelProxy<any>();

      // These should all be valid - no TypeScript errors
      assert.strictEqual(model.foo.toString(), "foo");
      assert.strictEqual(model.bar.baz.toString(), "bar.baz");
      assert.strictEqual(model.deeply.nested.property.toString(), "deeply.nested.property");
      assert.strictEqual(model.anyName.anyChild.anyGrandchild.toString(), "anyName.anyChild.anyGrandchild");
   });
});
