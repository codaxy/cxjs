import { Store } from "../data/Store";
import assert from "assert";
import { createTestRenderer, act } from "../util/test/createTestRenderer";
import { bind } from "./bind";
import { PureContainer } from "./PureContainer";

describe("PureContainer", () => {
   it("renders static text children", async () => {
      let widget = (
         <cx>
            <PureContainer>
               <div>Test</div>
            </PureContainer>
         </cx>
      );

      let store = new Store();
      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert(tree && !Array.isArray(tree), "Expected single element");
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: ["Test"],
      });
   });

   it("renders multiple children", async () => {
      let widget = (
         <cx>
            <PureContainer>
               <div>First</div>
               <div>Second</div>
               <div>Third</div>
            </PureContainer>
         </cx>
      );

      let store = new Store();
      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert(Array.isArray(tree), "Expected array of elements");
      assert.equal(tree.length, 3);
      assert.deepEqual(tree, [
         {
            type: "div",
            props: {},
            children: ["First"],
         },
         {
            type: "div",
            props: {},
            children: ["Second"],
         },
         {
            type: "div",
            props: {},
            children: ["Third"],
         },
      ]);
   });

   it("renders children with data bindings", async () => {
      let widget = (
         <cx>
            <PureContainer>
               <div text={bind("message")} />
            </PureContainer>
         </cx>
      );

      let store = new Store({
         data: {
            message: "Hello World",
         },
      });

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert(tree && !Array.isArray(tree), "Expected single element");
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: ["Hello World"],
      });
   });

   it("renders nested containers", async () => {
      let widget = (
         <cx>
            <PureContainer>
               <div>
                  <PureContainer>
                     <span>Nested</span>
                  </PureContainer>
               </div>
            </PureContainer>
         </cx>
      );

      let store = new Store();
      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert(tree && !Array.isArray(tree), "Expected single element");
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [
            {
               type: "span",
               props: {},
               children: ["Nested"],
            },
         ],
      });
   });

   it("conditionally renders children based on visible binding", async () => {
      let widget = (
         <cx>
            <PureContainer>
               <div visible={bind("show")} text="Visible" />
               <div visible={false} text="Hidden" />
            </PureContainer>
         </cx>
      );

      let store = new Store({
         data: {
            show: true,
         },
      });

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert(tree && !Array.isArray(tree), "Expected single element");
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: ["Visible"],
      });
   });

   it("handles empty children", async () => {
      let widget = (
         <cx>
            <PureContainer>
               <div />
            </PureContainer>
         </cx>
      );

      let store = new Store();
      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert(tree && !Array.isArray(tree), "Expected single element");
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: null,
      });
   });

   it("renders children from items property", async () => {
      let widget = (
         <cx>
            <PureContainer items={[<div key="1">Item 1</div>, <div key="2">Item 2</div>]} />
         </cx>
      );

      let store = new Store();
      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert(Array.isArray(tree), "Expected array of elements");
      assert.equal(tree.length, 2);
      assert.deepEqual(tree[0], {
         type: "div",
         props: {},
         children: ["Item 1"],
      });
      assert.deepEqual(tree[1], {
         type: "div",
         props: {},
         children: ["Item 2"],
      });
   });

   it("updates children when store data changes", async () => {
      let widget = (
         <cx>
            <PureContainer>
               <div text={bind("count")} />
            </PureContainer>
         </cx>
      );

      let store = new Store({
         data: {
            count: 0,
         },
      });

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: ["0"],
      });

      // Update the store
      await act(async () => {
         store.set("count", 5);
      });

      // Re-render
      tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: ["5"],
      });
   });
});
