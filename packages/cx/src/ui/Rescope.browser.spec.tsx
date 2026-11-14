import { describe, it } from "vitest";
import { Store } from "../data/Store";
import { Rescope } from "./Rescope";
import { bind } from "./bind";
import { render } from "../util/test/render";
import { Controller } from "./Controller";

import assert from "assert";
import { PureContainer } from "./PureContainer";

describe("Rescope", () => {
   it("allows simple access to nested data", async () => {
      let store = new Store({
         data: {
            $page: {
               data: {
                  name: "John",
               },
            },
         },
      });

      let widget = (
         <cx>
            <Rescope bind="$page.data">
               <div text={bind("name")} />
            </Rescope>
         </cx>
      );

      const screen = await render(widget, { store });

      assert.equal(screen.html(), "<div>John</div>");
   });

   it("allows parent access through $root", async () => {
      let store = new Store({
         data: {
            layout: {
               title: "Title",
            },
            $page: {
               data: {
                  name: "John",
               },
            },
         },
      });

      let widget = (
         <cx>
            <Rescope bind="$page.data">
               <div text={bind("$root.layout.title")} />
            </Rescope>
         </cx>
      );

      const screen = await render(widget, { store });

      assert.equal(screen.html(), "<div>Title</div>");
   });

   it("allows nested data access through data", async () => {
      let store = new Store({
         data: {
            layout: {
               title: "Title",
            },
         },
      });

      let widget = (
         <cx>
            <Rescope bind="$page" data={{ $title: { bind: "layout.title" } }}>
               <div text={bind("$title")} />
            </Rescope>
         </cx>
      );

      const screen = await render(widget, { store });

      assert.equal(screen.html(), "<div>Title</div>");
   });

   it("nested data mutations are correctly propagated to the parent store", async () => {
      let store = new Store({
         data: {
            item: {
               value: 0,
            },
         },
      });

      let widget = (
         <cx>
            <Rescope bind="$page" data={{ $value: { bind: "item.value" } }}>
               <PureContainer
                  controller={{
                     onInit() {
                        this.store.set("$value", 2);
                     },
                  }}
               />
            </Rescope>
            <div text={bind("item.value")} />
         </cx>
      );

      const screen = await render(widget, { store });

      assert.equal(screen.html(), "<div>2</div>");
   });

   it("visible is calculated based on the inner scope", async () => {
      let store = new Store({
         data: {
            layout: {
               title: "Title",
            },
            $page: {
               data: {
                  visible: true,
                  name: "John",
               },
            },
         },
      });

      let widget = (
         <cx>
            <Rescope bind="$page.data" visible={bind("visible")}>
               <div text={bind("name")} />
            </Rescope>
         </cx>
      );

      const screen = await render(widget, { store });

      assert.equal(screen.html(), "<div>John</div>");
   });

   it("controllers see inner scope", async () => {
      let store = new Store({
         data: {
            $page: {
               data: {
                  visible: true,
                  name: "John",
               },
            },
         },
      });

      let testName = null;

      class TestController extends Controller {
         onInit() {
            testName = this.store.get("name");
         }
      }

      let widget = (
         <cx>
            <Rescope bind="$page.data" controller={TestController}>
               <div text={bind("name")} />
            </Rescope>
         </cx>
      );

      await render(widget, { store });

      assert.equal(testName, "John");
   });
});
