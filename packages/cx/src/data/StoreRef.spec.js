import assert from "assert";
import { Store } from "./Store";
import { StoreRef } from "./StoreRef";

const getStore = () => {
   return new Store({
      data: {
         person: {
            name: "Jack",
         },
      },
   });
};

describe("StoreRef", () => {
   it("can access child refs", () => {
      let store = getStore();
      let person = store.ref("person");
      let name = person.ref("name");
      assert.equal(name.get("person"), "Jack");
      name.set("John");
      assert.equal(name.get("person"), "John");
   });
});
