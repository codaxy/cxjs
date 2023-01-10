import assert from "assert";
import reactTestRenderer from "react-test-renderer";
import { createAccessorModelProxy } from "../data/createAccessorModelProxy";
import { Store } from "../data/Store";
import { expr } from "../ui";
import { Cx } from "../ui/Cx";
import { HtmlElement } from "./HtmlElement";

let DummyHack = HtmlElement;

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

      const component = reactTestRenderer.create(<Cx widget={widget} store={store} />);

      let tree = component.toJSON();
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

      const component = reactTestRenderer.create(<Cx widget={widget} store={store} />);

      let tree = component.toJSON();
      assert(tree.type === "div");
      assert.deepStrictEqual(tree.children, ["4"]);
   });
});
