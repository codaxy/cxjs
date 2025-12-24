import assert from "assert";
import { createTestRenderer, act } from "../util/test/createTestRenderer";
import { Store } from "../data/Store";
import { createFunctionalComponent } from "../ui/createFunctionalComponent";
import { useTrigger } from "./useTrigger";

describe("useTrigger", () => {
   it("works", async () => {
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

      const component = await createTestRenderer(store, FComp);

      component.toJSON();
      assert.equal(last, null); //trigger did not fire because it didn't receive true as the last argument

      await act(async () => {
         test.set(2);
      });
      component.toJSON();
      assert.equal(last, 2);
   });

   it("fires immediately if the last argument is true", async () => {
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

      const component = await createTestRenderer(store, FComp);

      component.toJSON();
      assert.equal(last, 1);

      await act(async () => {
         test.set(2);
      });
      component.toJSON();
      assert.equal(last, 2);
   });

   it("accepts refs as arguments", async () => {
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

      const component = await createTestRenderer(store, FComp);

      component.toJSON();
      assert.equal(last, 1);

      await act(async () => {
         test.set(2);
      });
      component.toJSON();
      assert.equal(last, 2);
   });
});
