import { Restate } from "./Restate";
import { Store } from "../data/Store";
import { createTestRenderer, act } from "../util/test/createTestRenderer";
import assert from "assert";
import { Controller } from "./Controller";
import { bind } from "./bind";
import { FirstVisibleChildLayout } from "./layout/FirstVisibleChildLayout";
import { Culture, createCulture } from "./Culture";
import { Cx } from "./Cx";
import renderer from "react-test-renderer";
import { createElement } from "react";

describe("Restate", () => {
   it("provides a blank slate", async () => {
      let widget = (
         <cx>
            <div>
               <Restate
                  data={{
                     value: "good",
                  }}
               >
                  <span text={bind("value")} />
                  <span text={bind("value2")} />
               </Restate>
            </div>
         </cx>
      );

      let store = new Store({
         data: {
            value: "bad",
            value2: "also bad",
         },
      });

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [
            {
               type: "span",
               props: {},
               children: ["good"],
            },
            {
               type: "span",
               props: {},
               children: null,
            },
         ],
      });
   });

   it("wires declared data", async () => {
      let widget = (
         <cx>
            <div>
               <Restate
                  data={{
                     name: { bind: "person.name" },
                  }}
               >
                  <div
                     controller={{
                        onInit() {
                           this.store.init("name", "Sasa");
                           this.store.init("nickname", "Sale");
                        },
                     }}
                  />
               </Restate>
            </div>
         </cx>
      );

      let changed = false;
      let store = new Store();
      store.subscribe(() => {
         //console.log(store.getData());
         changed = true;
      });

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();

      assert.equal(store.get("person.name"), "Sasa");
      assert(store.get("person.nickname") === undefined);
      assert(changed);
   });

   it("causes a global update if internal data changes", async () => {
      let controller: TestController | undefined;

      class TestController extends Controller {
         onInit() {
            controller = this;
         }

         setNickname(nname: string) {
            this.store.set("nickname", nname);
         }
      }

      let widget = (
         <cx>
            <div>
               <Restate
                  data={{
                     name: { bind: "person.name" },
                  }}
               >
                  <div controller={TestController} text={bind("nickname")} />
               </Restate>
            </div>
         </cx>
      );

      let changed = false;
      let store = new Store();
      store.subscribe(() => {
         changed = true;
      });

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [
            {
               type: "div",
               props: {},
               children: null,
            },
         ],
      });

      await act(async () => {
         controller!.setNickname("Sale");
      });

      let tree2 = component.toJSON();
      assert.deepEqual(tree2, {
         type: "div",
         props: {},
         children: [
            {
               type: "div",
               props: {},
               children: ["Sale"],
            },
         ],
      });
   });

   it("doesn't notify parent if not necessary in detached mode", async () => {
      class TestController extends Controller {
         onInit() {
            this.store.init("nickname", "Sale");
         }
      }

      let widget = (
         <cx>
            <div>
               <Restate
                  detached
                  data={{
                     name: { bind: "person.name" },
                  }}
               >
                  <div controller={TestController} />
               </Restate>
            </div>
         </cx>
      );

      let changed = false;
      let store = new Store();
      store.subscribe(() => {
         changed = true;
      });

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert(!changed);
   });

   it("shared state can be used across components inside and outside Restate", async () => {
      let widget = (
         <cx>
            <div>
               <div text={bind("person.gender", "Male")} />
               <Restate
                  detached
                  data={{
                     person: { bind: "person" },
                  }}
               >
                  <div text={bind("person.firstName", "John")} />
                  <div text={bind("person.lastName", "Doe")} />
               </Restate>
               <div text={bind("person.address", "Unknown")} />
            </div>
         </cx>
      );

      let changed = false;
      let store = new Store();
      store.subscribe(() => {
         changed = true;
         //console.log(store.getData());
      });

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(store.getData(), {
         person: {
            firstName: "John",
            lastName: "Doe",
            address: "Unknown",
            gender: "Male",
         },
      });
   });

   it("updates if shared state is changed from outside", async () => {
      for (const detached of [true, false]) {
         let widget = (
            <cx>
               <div>
                  <Restate
                     detached={detached}
                     data={{
                        person: { bind: "person" },
                     }}
                  >
                     <div text={bind("person.firstName")} />
                  </Restate>
                  <div text={bind("person.firstName", "John")} />
               </div>
            </cx>
         );

         let store = new Store();

         const component = await createTestRenderer(store, widget);

         let tree = component.toJSON();
         assert.deepEqual(tree, {
            type: "div",
            props: {},
            children: [
               {
                  type: "div",
                  props: {},
                  children: ["John"],
               },
               {
                  type: "div",
                  props: {},
                  children: ["John"],
               },
            ],
         });
         await act(async () => {
            store.set("person.firstName", "Jack");
         });

         tree = component.toJSON();
         assert.deepEqual(tree, {
            type: "div",
            props: {},
            children: [
               {
                  type: "div",
                  props: {},
                  children: ["Jack"],
               },
               {
                  type: "div",
                  props: {},
                  children: ["Jack"],
               },
            ],
         });
      }
   });

   it("allows field initialization in data declaration", async () => {
      for (const detached of [true, false]) {
         let widget = (
            <cx>
               <div>
                  <Restate
                     detached={detached}
                     data={{
                        name: bind("name", "Cx"),
                     }}
                  >
                     <div text={bind("name")} />
                  </Restate>
               </div>
            </cx>
         );

         let store = new Store();

         const component = await createTestRenderer(store, widget);

         let tree = component.toJSON();
         assert.deepEqual(tree, {
            type: "div",
            props: {},
            children: [
               {
                  type: "div",
                  props: {},
                  children: ["Cx"],
               },
            ],
         });
      }
   });

   it("updates if internal data changes", async () => {
      class TestController extends Controller {
         onInit() {
            this.store.init("nickname", "Sale");
         }
      }

      let widget = (
         <cx>
            <div>
               <Restate>
                  <Restate>
                     <div controller={TestController} text={bind("nickname")} />
                  </Restate>
               </Restate>
            </div>
         </cx>
      );

      let changed = false;
      let store = new Store();
      store.subscribe(() => {
         changed = true;
      });

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [
            {
               type: "div",
               props: {},
               children: ["Sale"],
            },
         ],
      });
   });

   it("works with FirstVisibleChildLayout", async () => {
      let widget = (
         <cx>
            <div>
               <FirstVisibleChildLayout>
                  <Restate>
                     <div>First</div>
                  </Restate>
                  <div>Second</div>
               </FirstVisibleChildLayout>
            </div>
         </cx>
      );

      let store = new Store();

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [{ type: "div", props: {}, children: ["First"] }],
      });
   });

   it("is transparent to FirstVisibleChildLayout", async () => {
      let widget = (
         <cx>
            <div>
               <FirstVisibleChildLayout>
                  <Restate>
                     <div visible={false}>First</div>
                  </Restate>
                  <div>Second</div>
               </FirstVisibleChildLayout>
            </div>
         </cx>
      );

      let store = new Store();

      const component = await createTestRenderer(store, widget);

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [{ type: "div", props: {}, children: ["Second"] }],
      });
   });

   it("renders detached content in its own culture", async () => {
      let time = () =>
         Culture.getDateTimeCulture().getFormatter("HHmmN").format(new Date("2026-04-24T12:00:00Z"));

      let widget = (
         <cx>
            <div>
               <Restate detached culture={createCulture({ timezone: "UTC" })}>
                  <span text={time} />
               </Restate>
               <Restate detached culture={createCulture({ timezone: "Asia/Tokyo" })}>
                  <span text={time} />
               </Restate>
            </div>
         </cx>
      );

      const component = await createTestRenderer(new Store(), widget);

      assert.deepEqual(component.toJSON(), {
         type: "div",
         props: {},
         children: [
            { type: "span", props: {}, children: ["12:00"] },
            { type: "span", props: {}, children: ["21:00"] },
         ],
      });
   });

   it("re-renders detached content when the parent culture changes", async () => {
      let time = () =>
         Culture.getDateTimeCulture().getFormatter("HHmmN").format(new Date("2026-04-24T12:00:00Z"));

      let widget = (
         <cx>
            <div>
               <Restate detached>
                  <span text={time} />
               </Restate>
            </div>
         </cx>
      );

      let store = new Store();
      let utc = createCulture({ timezone: "UTC" });
      let tokyo = createCulture({ timezone: "Asia/Tokyo" });
      let cx = (cultureInfo: any) =>
         createElement(Cx, { widget, store, subscribe: true, immediate: true, cultureInfo });
      let component: any;
      await act(async () => {
         component = renderer.create(cx(utc));
      });
      assert.deepEqual(component.toJSON().children[0].children, ["12:00"]);

      await act(async () => {
         component.update(cx(tokyo));
      });
      assert.deepEqual(component.toJSON().children[0].children, ["21:00"]);
   });
});
