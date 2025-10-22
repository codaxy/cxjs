import assert from "assert";
import { Prop } from "src/core";
import { createTestRenderer } from "src/util/test/createTestRenderer";
import { computable } from "../data";
import { Store } from "../data/Store";
import { createFunctionalComponent } from "../ui/createFunctionalComponent";
import { ref } from "./store";

describe("ref", () => {
   it("allows store references in functional components", () => {
      const FComp = createFunctionalComponent(({}) => {
         let testValue = ref({ bind: "x", defaultValue: 10 });
         return (
            <cx>
               <div text={testValue} />
            </cx>
         );
      });

      let store = new Store();

      const component = createTestRenderer(store, FComp);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         children: ["10"],
         props: {},
      });
   });

   it("can be used to adapt any prop passed to a functional component", () => {
      const FComp = createFunctionalComponent(({ value }: { value: Prop<any> }) => {
         return (
            <cx>
               <div text={computable(ref(value), (value) => `x${value}`)} />
            </cx>
         );
      });

      let store = new Store({ data: { value: 100 } });

      function test(value: Prop<any>, expectation: any) {
         const component = createTestRenderer(store, <FComp value={value} />);
         let tree = component.toJSON();
         assert.deepEqual(tree, {
            type: "div",
            children: [expectation],
            props: {},
         });
      }

      test({ bind: "value" }, "x100");
      test({ expr: "{value}" }, "x100");
      test({ tpl: "{value:n;2}" }, "x100.00");
      test(200, "x200");
      test(() => 500, "x500");
      test(
         computable("value", (value: string) => value + 100),
         "x200",
      );
      test(null, "xnull");
      test(undefined, "xundefined");
      test(0, "x0");
      test(false, "xfalse");
   });
});
