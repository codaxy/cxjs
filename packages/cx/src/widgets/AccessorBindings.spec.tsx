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
});
