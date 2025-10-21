import assert from "assert";
import { createTestRenderer } from "src/util/test/createTestRenderer";
import { Store } from "../data/Store";
import { createFunctionalComponent } from "../ui/createFunctionalComponent";
import { useTrigger } from "./useTrigger";

describe("useTrigger", () => {
   it("works", () => {
      let last = null;

      const FComp = createFunctionalComponent(({ ...props }) => {
         useTrigger(["test"], (test) => {
            last = test;
         });

         return (
            <cx>
               <div />
            </cx>
         );
      });

      let store = new Store();
      let test = store.ref("test", 1);

      const component = createTestRenderer(store, FComp);

      component.toJSON();
      assert.equal(last, null); //trigger did not fire because it didn't receive true as the last argument

      test.set(2);
      component.toJSON();
      assert.equal(last, 2);
   });

   it("fires immediately if the last argument is true", () => {
      let last = null;

      const FComp = createFunctionalComponent(({ ...props }) => {
         useTrigger(
            ["test"],
            (test) => {
               last = test;
            },
            true,
         );

         return (
            <cx>
               <div />
            </cx>
         );
      });

      let store = new Store();
      let test = store.ref("test", 1);

      const component = createTestRenderer(store, FComp);

      component.toJSON();
      assert.equal(last, 1);

      test.set(2);
      component.toJSON();
      assert.equal(last, 2);
   });

   it("accepts refs as arguments", () => {
      let last = null;

      let store = new Store();
      let test = store.ref("test", 1);

      const FComp = createFunctionalComponent(({ ...props }) => {
         useTrigger(
            [test],
            (test) => {
               last = test;
            },
            true,
         );

         return (
            <cx>
               <div />
            </cx>
         );
      });

      const component = createTestRenderer(store, FComp);

      component.toJSON();
      assert.equal(last, 1);

      test.set(2);
      component.toJSON();
      assert.equal(last, 2);
   });
});
