import { Store } from "../data/Store";
import { createTestRenderer } from "../util/test/createTestRenderer";
import assert from "assert";
import { Controller } from "./Controller";
import { DataProxy } from "./DataProxy";
import { computable } from "../data/computable";
import { useState } from "../hooks";
import { createFunctionalComponent } from "./createFunctionalComponent";
import { Widget } from "./Widget";
import { bind } from "./bind";
import { tpl } from "./tpl";

describe("DataProxy", () => {
   it("can calculate values", async () => {
      let widget = (
         <cx>
            <DataProxy
               data={{
                  $value: { bind: "value" },
               }}
            >
               <span text={bind("$value")} />
            </DataProxy>
         </cx>
      );

      let store = new Store({
         data: {
            value: "good",
         },
      });

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "span",
         props: {},
         children: ["good"],
      });
   });

   it("can write into values aliased with bind", async () => {
      class TestController extends Controller {
         onInit() {
            this.store.set("$value", "excellent");
         }
      }

      let widget = (
         <cx>
            <DataProxy
               data={{
                  $value: { bind: "value" },
               }}
               controller={TestController}
            >
               <span text={bind("$value")} />
            </DataProxy>
         </cx>
      );

      let store = new Store({
         data: {
            value: "good",
         },
      });

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();

      assert(store.get("value"), "excellent");

      assert.deepEqual(tree, {
         type: "span",
         props: {},
         children: ["excellent"],
      });
   });

   it("can write into aliased values using provided setters", async () => {
      class TestController extends Controller {
         onInit() {
            this.store.set("$value", "excellent");
         }
      }

      let widget = (
         <cx>
            <DataProxy
               data={{
                  $value: {
                     expr: computable("value", (value: any) => value),
                     set: (value: any, { store }: { store: any }) => {
                        store.set("value", value);
                     },
                  },
               }}
               controller={TestController}
            >
               <span text={bind("$value")} />
            </DataProxy>
         </cx>
      );

      let store = new Store({
         data: {
            value: "good",
         },
      });

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();

      assert(store.get("value"), "excellent");

      assert.deepEqual(tree, {
         type: "span",
         props: {},
         children: ["excellent"],
      });
   });

   it("allows shorter syntax", async () => {
      let widget = (
         <cx>
            <DataProxy alias="$value" value={bind("value")}>
               <span text={bind("$value")} />
            </DataProxy>
         </cx>
      );

      let store = new Store({
         data: {
            value: "good",
         },
      });

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "span",
         props: {},
         children: ["good"],
      });
   });

   it("correctly updates aliased data after write", async () => {
      class TestController extends Controller {
         onInit() {
            this.store.set("$value", "excellent");
            assert.equal(this.store.get("$value"), "excellent");
         }
      }

      let widget = (
         <cx>
            <DataProxy
               data={{
                  $value: { bind: "value" },
               }}
               controller={TestController}
            >
               <span text={bind("$value")} />
            </DataProxy>
         </cx>
      );

      let store = new Store({
         data: {
            value: "good",
         },
      });

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();

      assert(store.get("value"), "excellent");

      assert.deepEqual(tree, {
         type: "span",
         props: {},
         children: ["excellent"],
      });
   });

   it("properly binds structures", async () => {
      class TestController extends Controller {
         onInit() {
            this.store.set("$person.firstName", "Jim");
         }
      }

      let widget = (
         <cx>
            <DataProxy
               data={{
                  $person: { bind: "person" },
               }}
               controller={TestController}
            >
               <span text={tpl("{$person.firstName} {$person.lastName}")} />
            </DataProxy>
         </cx>
      );

      let store = new Store({
         data: {
            person: { firstName: "John", lastName: "Smith" },
         },
      });

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();

      assert(store.get("person.firstName"), "Jim");

      assert.deepEqual(tree, {
         type: "span",
         props: {},
         children: ["Jim Smith"],
      });
   });

   it("works with Store refs", async () => {
      let widget = createFunctionalComponent(() => {
         let valueRef = useState("a");
         return (
            <cx>
               <DataProxy
                  data={{
                     $value: valueRef,
                  }}
               >
                  <span
                     text={bind("$value")}
                     controller={{
                        onInit() {
                           valueRef.set("b");
                        },
                     }}
                  />
               </DataProxy>
            </cx>
         );
      });

      let store = new Store({
         data: {
            //value: "good"
         },
      });

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "span",
         props: {},
         children: ["b"],
      });
   });

   it("controllers set on the DataProxy can see calculated values", async () => {
      let value;
      let widget = Widget.create(
         <cx>
            <DataProxy
               data={{
                  $value: 5,
               }}
               controller={{
                  onInit() {
                     value = this.store.get("$value");
                  },
               }}
            />
         </cx>,
      );

      let store = new Store();

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.equal(value, 5);
   });

   it("correctly propagates undefined values over a previous value (bug)", async () => {
      let widget = (
         <cx>
            <DataProxy
               data={{
                  $value: { bind: "value" },
               }}
            >
               <span text={bind("$value")} />
            </DataProxy>
            <DataProxy
               data={{
                  $value: { bind: "dummy" },
               }}
            >
               <span text={bind("$value")} />
            </DataProxy>
         </cx>
      );

      let store = new Store({
         data: {
            value: "initial",
         },
      });

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();

      assert.deepEqual(tree, [
         {
            type: "span",
            props: {},
            children: ["initial"],
         },
         {
            type: "span",
            props: {},
            children: null,
         },
      ]);
   });
});
