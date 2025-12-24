import { Store } from "../data/Store";
import assert from "assert";
import { createTestRenderer } from "../util/test/createTestRenderer";
import { bind } from "../ui/bind";
import { VDOM } from "../ui/Widget";

describe("HtmlElement", () => {
   it("renders textual content provided through the text property", async () => {
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

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert(tree && !Array.isArray(tree), "Expected single element");
      assert.equal(tree.type, "div");
      assert.deepEqual(tree.children, ["Test"]);
   });

   it("allows spread bindings", async () => {
      let store = new Store({
         data: {
            title: "title",
         },
      });

      const component = await createTestRenderer(
         store,
         <cx>
            <a href="#" {...{ title: { bind: "title" } }}>
               Link
            </a>
         </cx>,
      );

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

   it("supports SVG elements with camelCase attributes", async () => {
      let store = new Store();

      const component = await createTestRenderer(
         store,
         <cx>
            <svg>
               <path
                  d="M200,176V64a23.9,23.9,0,0,0-24-24H40"
                  fill="none"
                  stroke="#343434"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="12"
               />
            </svg>
         </cx>,
      );

      let tree = component.toJSON();
      assert(tree && !Array.isArray(tree), "Expected single element");
      assert.equal(tree.type, "svg");
      assert(tree.children && tree.children.length === 1, "Expected one child");
      let path = tree.children[0] as any;
      assert.equal(path.type, "path");
      assert.equal(path.props.d, "M200,176V64a23.9,23.9,0,0,0-24-24H40");
      assert.equal(path.props.fill, "none");
      assert.equal(path.props.stroke, "#343434");
      assert.equal(path.props.strokeLinecap, "round");
      assert.equal(path.props.strokeLinejoin, "round");
      assert.equal(path.props.strokeWidth, "12");
   });
});
