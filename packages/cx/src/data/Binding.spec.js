import { Binding } from "./Binding";
import assert from "assert";
import { createAccessorModelProxy } from "./createAccessorModelProxy";

describe("Binding", function () {
   describe("#get()", function () {
      it("should get value if value is defined", function () {
         var state = { person: { name: "Joe" } };
         var b = Binding.get("person.name");
         assert.equal(b.value(state), "Joe");
      });

      it("allows non-standard property identifiers", function () {
         var state = { person: { "@schema": "Person" } };
         var b = Binding.get("person.@schema");
         assert.equal(b.path, "person.@schema");
         assert.equal(b.value(state), "Person");
      });

      it("properly resolves accessor models", function () {
         var state = { person: { schema: "Person" } };
         var b = Binding.get(createAccessorModelProxy("person.schema"));
         assert.equal(b.value(state), "Person");
      });
   });

   describe("#set()", function () {
      it("produces new objects along the binding path", function () {
         var state = { person: { name: "Joe" } };
         var b = Binding.get("person.name");
         var ns = b.set(state, "Jack");
         assert.equal(ns.person.name, "Jack");
         assert.notEqual(state, ns);
         assert.notEqual(state.person, ns.person);
         assert.notEqual(state.person.name, ns.person.name);
      });

      it("returns same state object if value does not change", function () {
         var state = { person: { name: "Joe" } };
         var b = Binding.get("person.name");
         var ns = b.set(state, "Joe");
         assert.equal(state, ns);
      });

      it("allows non-standard property identifiers", function () {
         var state = { person: { "@schema": "Person" } };
         var b = Binding.get("person.@schema");
         var ns = b.set(state, "Test");
         assert.equal(ns.person["@schema"], "Test");
      });
   });

   describe(".delete()", function () {
      it("correctly removes pointed properties", function () {
         var state = { person: { name: "Joe" } };
         var b = Binding.get("person.name");
         var ns = b.delete(state);
         assert("person" in ns);
         assert(!("name" in ns.person));
      });

      it("does not change state if property is non-existent", function () {
         var state = { person: { name: "Joe" } };
         var b = Binding.get("person.name2");
         var ns = b.delete(state);
         assert(ns == state);
      });
   });
});
