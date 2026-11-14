import { describe, it } from "vitest";
import { Restate } from "./Restate";
import { Store } from "../data/Store";
import { render, settle, markup } from "../util/test/render";
import assert from "assert";
import { Controller } from "./Controller";
import { bind } from "./bind";
import { FirstVisibleChildLayout } from "./layout/FirstVisibleChildLayout";
import { Culture, createCulture } from "./Culture";

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

      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>
               <span>good</span>
               <span></span>
            </div>
         `,
      );
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

      await render(widget, { store });

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

      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>
               <div></div>
            </div>
         `,
      );

      await settle(() => controller!.setNickname("Sale"));

      assert.equal(
         screen.html(),
         markup`
            <div>
               <div>Sale</div>
            </div>
         `,
      );
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

      await render(widget, { store });

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

      await render(widget, { store });

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

         const screen = await render(widget, { store });

         assert.equal(
            screen.html(),
            markup`
               <div>
                  <div>John</div>
                  <div>John</div>
               </div>
            `,
         );
         await settle(() => store.set("person.firstName", "Jack"));

         assert.equal(
            screen.html(),
            markup`
               <div>
                  <div>Jack</div>
                  <div>Jack</div>
               </div>
            `,
         );
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

         const screen = await render(widget, { store });

         assert.equal(
            screen.html(),
            markup`
               <div>
                  <div>Cx</div>
               </div>
            `,
         );
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

      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>
               <div>Sale</div>
            </div>
         `,
      );
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

      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>
               <div>First</div>
            </div>
         `,
      );
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

      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>
               <div>Second</div>
            </div>
         `,
      );
   });

   it("renders detached content in its own culture", async () => {
      let time = () => Culture.getDateTimeCulture().getFormatter("HHmmN").format(new Date("2026-04-24T12:00:00Z"));

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

      const screen = await render(widget);

      assert.equal(
         screen.html(),
         markup`
            <div>
               <span>12:00</span>
               <span>21:00</span>
            </div>
         `,
      );
   });

   it("re-renders detached content when the parent culture changes", async () => {
      let time = () => Culture.getDateTimeCulture().getFormatter("HHmmN").format(new Date("2026-04-24T12:00:00Z"));

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
      let screen = await render(widget, { store, cultureInfo: utc });
      assert.equal(screen.container.querySelector("span")?.textContent, "12:00");

      await screen.rerender(widget, { cultureInfo: tokyo });
      assert.equal(screen.container.querySelector("span")?.textContent, "21:00");
   });
});
