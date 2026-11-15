/** @jsxImportSource cx */
// Elements and text rendered without instances of their own, through the shared instance: they update
// when their data or their children change, also when the store changes during explore, and elements with
// handlers, which keep their instances, still work around them.
import { describe, it } from "vitest";
import { userEvent } from "vitest/browser";
import assert from "assert";
import { createModel } from "../data/createAccessorModelProxy";
import { Store } from "../data/Store";
import { render, settle, markup } from "../util/test/render";
import { Restate } from "./Restate";
import { Text } from "./Text";

interface Person {
   firstName: string;
   city: string;
}

interface Model {
   person: Person;
   show: boolean;
   cls: string;
   color: string;
}

const m = createModel<Model>();

function newStore(data: Partial<Model> = {}) {
   return new Store({ data: { person: { firstName: "John", city: "Split" }, show: true, ...data } });
}

describe("SharedInstance", () => {
   it("updates text in nested elements", async () => {
      let store = newStore();
      const screen = await render(
         <cx>
            <div>
               <label>
                  Name: <Text value={m.person.firstName} />
               </label>
               <span text={m.person.city} />
            </div>
         </cx>,
         { store },
      );
      await settle(() => store.set(m.person.firstName, "Jack"));
      assert.equal(
         screen.html(),
         markup`
            <div>
               <label>Name: Jack</label>
               <span>Split</span>
            </div>
         `,
      );

      await settle(() => store.set(m.person.city, "Zagreb"));
      assert.equal(
         screen.html(),
         markup`
            <div>
               <label>Name: Jack</label>
               <span>Zagreb</span>
            </div>
         `,
      );
   });

   it("updates elements whose children are shown or hidden", async () => {
      let store = newStore();
      const screen = await render(
         <cx>
            <div>
               <p>
                  <span visible={m.show}>A</span>
                  <span>B</span>
               </p>
            </div>
         </cx>,
         { store },
      );
      await settle(() => store.set(m.show, false));
      assert.equal(
         screen.html(),
         markup`
            <div>
               <p>
                  <span>B</span>
               </p>
            </div>
         `,
      );

      await settle(() => store.set(m.show, true));
      assert.equal(
         screen.html(),
         markup`
            <div>
               <p>
                  <span>A</span>
                  <span>B</span>
               </p>
            </div>
         `,
      );
   });

   it("updates classes and styles of elements", async () => {
      let store = newStore({ cls: "a", color: "red" });
      const screen = await render(
         <cx>
            <div>
               <p class={m.cls} style={{ color: m.color }}>
                  <span>Text</span>
               </p>
            </div>
         </cx>,
         { store },
      );
      await settle(() => {
         store.set(m.cls, "b");
         store.set(m.color, "blue");
      });
      let p = screen.container.querySelector("p")!;
      assert.equal(p.className, "b");
      assert.equal(p.style.color, "blue");
   });

   it("updates text after the store changes during explore", async () => {
      // the attached Restate copies the changed parent data into its own store during explore, which makes Cx
      // explore again before rendering
      let store = newStore();
      const screen = await render(
         <cx>
            <div>
               <Restate data={{ person: m.person }}>
                  <p>
                     <Text value={m.person.firstName} />
                  </p>
               </Restate>
               <span text={m.person.firstName} />
            </div>
         </cx>,
         { store },
      );
      await settle(() => store.set(m.person.firstName, "Jack"));
      assert.equal(
         screen.html(),
         markup`
            <div>
               <p>Jack</p>
               <span>Jack</span>
            </div>
         `,
      );
   });

   it("calls handlers of elements around elements without instances", async () => {
      let store = newStore();
      let clicked: string[] = [];
      const screen = await render(
         <cx>
            <div>
               <button onClick={(e, { store }) => clicked.push(store.get(m.person.firstName))}>
                  Save <span text={m.person.city} />
               </button>
            </div>
         </cx>,
         { store },
      );
      await settle(() => store.set(m.person.city, "Zagreb"));
      assert.equal(screen.container.querySelector("button")!.textContent, "Save Zagreb");

      await settle(() => userEvent.click(screen.container.querySelector("button")!));
      assert.deepEqual(clicked, ["John"]);
   });
});
