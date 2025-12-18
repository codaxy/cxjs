import assert from "assert";
import { createAccessorModelProxy } from "../data/createAccessorModelProxy";
import { Store } from "../data/Store";
import { expr } from "../ui";
import { createTestRenderer } from "../util/test/createTestRenderer";

interface Model {
   $page: {
      text?: string;
      a?: number;
      b?: number;
   };
}

let { $page } = createAccessorModelProxy<Model>();

describe("Accessors", () => {
   it("work as regular bindings", () => {
      let widget = (
         <cx>
            <div text={$page.text} />
         </cx>
      );

      let store = new Store<Model>({
         data: {
            $page: {
               text: "Test",
            },
         },
      });

      const component = createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert(tree && !Array.isArray(tree));
      assert(tree.type === "div");
      assert.deepStrictEqual(tree.children, ["Test"]);
   });

   it("support expressions", () => {
      let widget = (
         <cx>
            <div text={expr($page.a, $page.b, (a, b) => a + b)} />
         </cx>
      );

      let store = new Store<Model>({
         data: {
            $page: {
               a: 1,
               b: 3,
            },
         },
      });

      const component = createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert(tree && !Array.isArray(tree));
      assert(tree.type === "div");
      assert.deepStrictEqual(tree.children, ["4"]);
   });

   it("expr infers correct types from accessor chains", () => {
      let selector = expr($page.a, $page.b, (a, b) => {
         // a and b should be inferred as number | undefined
         const typedA: number | undefined = a;
         const typedB: number | undefined = b;
         // @ts-expect-error - a should not be string
         const wrongA: string = a;
         // @ts-expect-error - b should not be string
         const wrongB: string = b;
         return (typedA ?? 0) + (typedB ?? 0);
      });
      assert.ok(selector);
   });

   it("expr resolves AccessorChain<any> and nested properties to any", () => {
      let m = createAccessorModelProxy<{ data: any }>();
      let selector = expr(m.data.nested.value, (value) => {
         // value should be any, so all assignments should work
         const asString: string = value;
         const asNumber: number = value;
         const asBoolean: boolean = value;
         return value;
      });
      assert.ok(selector);
   });
});
