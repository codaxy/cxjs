import { Store } from "../data/Store";
import assert from "assert";
import { createTestRenderer } from "../util/test/createTestRenderer";
import { bind } from "../ui/bind";
import { VDOM } from "../ui/Widget";

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

   it("allows React components as tag", () => {
      class MyReactComponent extends VDOM.Component<any> {
         render() {
            return VDOM.createElement("div", { className: "my-component" }, this.props.children);
         }
      }

      let store = new Store();

      const component = createTestRenderer(store, (
         <cx>
            <MyReactComponent>
               <span>Child content</span>
            </MyReactComponent>
         </cx>
      ));

      let tree = component.toJSON();
      assert(tree && !Array.isArray(tree), "Expected single element");
      assert.equal(tree.type, "div");
      assert.equal(tree.props.className, "my-component");
      assert(tree.children && tree.children.length === 1, "Expected one child");
   });
});
