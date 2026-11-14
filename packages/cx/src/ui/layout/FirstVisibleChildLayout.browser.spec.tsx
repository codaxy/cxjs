import { describe, it } from "vitest";
import { Store } from "../../data/Store";
import { expr } from "../expr";
import { render, settle, markup } from "../../util/test/render";

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

      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>
               <header></header>
            </div>
         `,
      );
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

      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>
               <header></header>
            </div>
         `,
      );

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

      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>
               <main></main>
            </div>
         `,
      );
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

      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>
               <main></main>
            </div>
         `,
      );
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

      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>
               <main></main>
            </div>
         `,
      );
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

      await render(widget, { store });

      await settle(() => store.set("index", 0));
      assert.deepEqual(destroyList, []);

      await settle(() => store.set("index", 3));
      assert.deepEqual(destroyList, [0]);

      await settle(() => store.set("index", 1));
      assert.deepEqual(destroyList, [0, 3]);

      await settle(() => store.set("index", 4));
      assert.deepEqual(destroyList, [0, 3, 1]);

      await settle(() => store.set("index", 0));
      assert.deepEqual(destroyList, [0, 3, 1, 4]);

      await settle(() => store.set("index", -1));
      assert.deepEqual(destroyList, [0, 3, 1, 4, 0]);
   });
});
