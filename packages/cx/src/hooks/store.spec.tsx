import assert from "assert";
import { Prop } from "../ui/Prop";
import { createTestRenderer } from "../util/test/createTestRenderer";
import { computable } from "../data";
import { Store } from "../data/Store";
import { createFunctionalComponent } from "../ui/createFunctionalComponent";
import { ref } from "./store";

describe("ref", () => {
   it("allows store references in functional components", async () => {
      const FComp = createFunctionalComponent(({}) => {
         let testValue = ref({ bind: "x", defaultValue: 10 });
         return (
            <cx>
               <div text={testValue} />
            </cx>
         );
      });

      let store = new Store();

      const component = await createTestRenderer(store, FComp);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         children: ["10"],
         props: {},
      });
   });

   it("can be used to adapt any prop passed to a functional component", async () => {
      const FComp = createFunctionalComponent(({ value }: { value: Prop<any> }) => {
         return (
            <cx>
               <div text={computable(ref(value), (value) => `x${value}`)} />
            </cx>
         );
      });

      let store = new Store({ data: { value: 100 } });

      async function test(value: Prop<any>, expectation: any) {
         const component = await createTestRenderer(store, <FComp value={value} />);
         let tree = component.toJSON();
         assert.deepEqual(tree, {
            type: "div",
            children: [expectation],
            props: {},
         });
      }

      await test({ bind: "value" }, "x100");
      await test({ expr: "{value}" }, "x100");
      await test({ tpl: "{value:n;2}" }, "x100.00");
      await test(200, "x200");
      await test(() => 500, "x500");
      await test(
         computable("value", (value: string) => value + 100),
         "x200",
      );
      await test(null, "xnull");
      await test(undefined, "xundefined");
      await test(0, "x0");
      await test(false, "xfalse");
   });
});
