import { Cx } from "./Cx";
import { VDOM } from "./Widget";
import { HtmlElement } from "../widgets/HtmlElement";
import { Store } from "../data/Store";
import { Rescope } from "./Rescope";
import { PureContainer } from "./PureContainer";

import renderer from "react-test-renderer";
import assert from "assert";
import { Controller } from "./Controller";

describe("Rescope", () => {
   it("allows simple access to nested data", () => {
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
               <div text-bind="name" />
            </Rescope>
         </cx>
      );

      const component = renderer.create(<Cx widget={widget} store={store} subscribe immediate />);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: ["John"],
      });
   });

   it("allows parent access through $root", () => {
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
               <div text-bind="$root.layout.title" />
            </Rescope>
         </cx>
      );

      const component = renderer.create(<Cx widget={widget} store={store} subscribe immediate />);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: ["Title"],
      });
   });

   it("allows nested data access through data", () => {
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
               <div text-bind="$title" />
            </Rescope>
         </cx>
      );

      const component = renderer.create(<Cx widget={widget} store={store} subscribe immediate />);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: ["Title"],
      });
   });

   it("nested data mutations are correctly propagated to the parent store", () => {
      let store = new Store({
         data: {
            item: {
               value: 0
            }
         },
      });

      let widget = (
         <cx>
            <Rescope bind="$page" data={{ $value: { bind: "item.value" } }}>
               <PureContainer controller={{
                  onInit() {
                     this.store.set("$value", 2);
                  }
               }} />
            </Rescope>
            <div text-bind="item.value" />
         </cx>
      );

      const component = renderer.create(<Cx widget={widget} store={store} subscribe immediate />);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: ["2"],
      });
   });

   it("visible is calculated based on the inner scope", () => {
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

      const component = renderer.create(
         <Cx store={store} subscribe immediate>
            <Rescope bind="$page.data" visible-bind="visible">
               <div text-bind="name" />
            </Rescope>
         </Cx>
      );

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: ["John"],
      });
   });

   it("controllers see inner scope", () => {
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

      const component = renderer.create(
         <Cx store={store} subscribe immediate>
            <Rescope bind="$page.data" controller={TestController}>
               <div text-bind="name" />
            </Rescope>
         </Cx>
      );

      component.toJSON();
      assert.equal(testName, "John");
   });
});
