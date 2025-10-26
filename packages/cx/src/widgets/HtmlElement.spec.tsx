import { Store } from "../data/Store";
import assert from "assert";
import { createTestRenderer } from "../util/test/createTestRenderer";
import { bind } from "../ui/bind";

describe("HtmlElement", () => {
   it("renders textual content provided through the text property", () => {
      let widget = (
         <cx>
            <div text={bind("text")} />
         </cx>
      );

      let store = new Store({
         data: {
            text: "Test",
         },
      });

      const component = createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert(tree && !Array.isArray(tree), "Expected single element");
      assert.equal(tree.type, "div");
      assert.deepEqual(tree.children, ["Test"]);
   });

   it("allows spread bindings", () => {
      let store = new Store({
         data: {
            title: "title",
         },
      });

      const component = createTestRenderer(store, (
         <cx>
            <a href="#" {...{ title: { bind: "title" } }}>
               Link
            </a>
         </cx>
      ));

      let tree = component.toJSON();
      assert(tree && !Array.isArray(tree), "Expected single element");
      assert.deepEqual(tree, {
         type: "a",
         children: ["Link"],
         props: {
            href: "#",
            title: "title",
         },
      });
   });
});
