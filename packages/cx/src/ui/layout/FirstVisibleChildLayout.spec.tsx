import { Store } from "../../data/Store";
import { expr } from "../expr";
import { createTestRenderer, act } from "../../util/test/createTestRenderer";

import assert from "assert";
import { FirstVisibleChildLayout } from "./FirstVisibleChildLayout";
import { UseParentLayout } from "./UseParentLayout";
import { PureContainer } from "../PureContainer";
import { createFunctionalComponent } from "../createFunctionalComponent";

describe("FirstVisibleChildLayout", () => {
   it("renders only the first child", async () => {
      let widget = (
         <cx>
            <div layout={FirstVisibleChildLayout}>
               <header></header>
               <main></main>
               <footer></footer>
            </div>
         </cx>
      );

      let store = new Store();

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [{ type: "header", props: {}, children: null }],
      });
   });

   it("does not process other widgets", async () => {
      let h = false,
         m = false,
         f = false;

      let widget = (
         <cx>
            <div layout={FirstVisibleChildLayout}>
               <header
                  onInit={() => {
                     h = true;
                  }}
               />
               <main
                  onInit={() => {
                     m = true;
                  }}
               />
               <footer
                  onInit={() => {
                     f = true;
                  }}
               />
            </div>
         </cx>
      );

      let store = new Store();

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [{ type: "header", props: {}, children: null }],
      });

      assert.equal(h, true);
      assert.equal(m, false);
      assert.equal(f, false);
   });

   it("skips the first child if not visible", async () => {
      let widget = (
         <cx>
            <div layout={FirstVisibleChildLayout}>
               <header visible={false}></header>
               <main></main>
               <footer></footer>
            </div>
         </cx>
      );

      let store = new Store();

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [{ type: "main", props: {}, children: null }],
      });
   });

   it("skips pure containers which use parent layouts", async () => {
      let widget = (
         <cx>
            <div layout={FirstVisibleChildLayout}>
               <PureContainer layout={UseParentLayout}>
                  <header visible={false}></header>
               </PureContainer>
               <main></main>
               <footer></footer>
            </div>
         </cx>
      );

      let store = new Store();

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [{ type: "main", props: {}, children: null }],
      });
   });

   it("works with functional components", async () => {
      let FC = createFunctionalComponent(({ children }: { children?: any }) => <cx>{children}</cx>);

      let widget = (
         <cx>
            <div layout={FirstVisibleChildLayout}>
               <FC>
                  <header visible={false}></header>
               </FC>
               <main></main>
               <footer></footer>
            </div>
         </cx>
      );

      let store = new Store();

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [{ type: "main", props: {}, children: null }],
      });
   });

   it("properly destroys invisible items", async () => {
      let destroyList: number[] = [];
      let widget = (
         <cx>
            <div layout={FirstVisibleChildLayout}>
               <div visible={expr("{index} == 0")} onDestroy={() => destroyList.push(0)} />
               <div visible={expr("{index} == 1")} onDestroy={() => destroyList.push(1)} />
               <div visible={expr("{index} == 2")} onDestroy={() => destroyList.push(2)} />
               <div visible={expr("{index} == 3")} onDestroy={() => destroyList.push(3)} />
               <div visible={expr("{index} == 4")} onDestroy={() => destroyList.push(4)} />
            </div>
         </cx>
      );

      let store = new Store();

      const component = await createTestRenderer(store, widget);

      await act(async () => {
         store.set("index", 0);
      });
      component.toJSON();
      assert.deepEqual(destroyList, []);

      await act(async () => {
         store.set("index", 3);
      });
      component.toJSON();
      assert.deepEqual(destroyList, [0]);

      await act(async () => {
         store.set("index", 1);
      });
      component.toJSON();
      assert.deepEqual(destroyList, [0, 3]);

      await act(async () => {
         store.set("index", 4);
      });
      component.toJSON();
      assert.deepEqual(destroyList, [0, 3, 1]);

      await act(async () => {
         store.set("index", 0);
      });
      component.toJSON();
      assert.deepEqual(destroyList, [0, 3, 1, 4]);

      await act(async () => {
         store.set("index", -1);
      });
      component.toJSON();
      assert.deepEqual(destroyList, [0, 3, 1, 4, 0]);
   });
});
