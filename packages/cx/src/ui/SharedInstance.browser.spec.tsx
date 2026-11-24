/** @jsxImportSource cx */
// Elements and text rendered without instances of their own, through the shared instance: they update
// when their data or their children change, also when the store changes during explore, and elements with
// handlers, which keep their instances, still work around them. Static content, whose data is constant, is shared by
// all its parents and still appears in each of them, and cannot be updated. All of it can be turned off.
import { describe, it } from "vitest";
import { userEvent } from "vitest/browser";
import assert from "assert";
import { createModel } from "../data/createAccessorModelProxy";
import { Store } from "../data/Store";
import { render, settle, markup, RenderResult } from "../util/test/render";
import { IsolatedScope } from "./IsolatedScope";
import { Repeater } from "./Repeater";
import { Restate } from "./Restate";
import { StaticText } from "./StaticText";
import { Text } from "./Text";
import { Widget } from "./Widget";

interface Person {
   firstName: string;
   city: string;
}

interface Model {
   person: Person;
   people: Person[];
   show: boolean;
   cls: string;
   color: string;
   other: number;
   $record: Person;
}

const m = createModel<Model>();

function newStore(data: Partial<Model> = {}) {
   return new Store({ data: { person: { firstName: "John", city: "Split" }, show: true, ...data } });
}

function people(): Person[] {
   return [
      { firstName: "John", city: "Split" },
      { firstName: "Jane", city: "Zagreb" },
   ];
}

function names(screen: RenderResult) {
   return Array.from(screen.container.querySelectorAll("li"), (li) => li.textContent);
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

describe("static content", () => {
   it("appears in every parent", async () => {
      let store = newStore({ people: people() });
      const screen = await render(
         <cx>
            <ul>
               <Repeater records={m.people}>
                  <li onClick={() => {}}>
                     <label>Name:</label>
                     <span text={m.$record.firstName} />
                  </li>
               </Repeater>
            </ul>
         </cx>,
         { store },
      );
      assert.deepEqual(names(screen), ["Name:John", "Name:Jane"]);

      await settle(() => store.update(m.people, (p) => [...p, { firstName: "Ann", city: "Rijeka" }]));
      assert.deepEqual(names(screen), ["Name:John", "Name:Jane", "Name:Ann"]);
   });

   it("cannot be updated, as it is rendered once for all its parents", async () => {
      let caption = Widget.create(StaticText, { text: "Name:" });
      let store = newStore({ people: people() });
      const screen = await render(
         <cx>
            <ul>
               <Repeater records={m.people}>
                  <li onClick={() => {}}>
                     <label items={[caption]} />
                  </li>
               </Repeater>
            </ul>
         </cx>,
         { store },
      );
      assert.deepEqual(names(screen), ["Name:", "Name:"]);
      assert.throws(() => caption.update(), /Static widgets cannot be updated/);
   });

   it("is not rendered if it is never visible", async () => {
      const screen = await render(
         <cx>
            <div>
               <span visible={false}>Hidden</span>
               <span>Shown</span>
            </div>
         </cx>,
         { store: newStore() },
      );
      assert.equal(
         screen.html(),
         markup`
            <div>
               <span>Shown</span>
            </div>
         `,
      );
   });

   it("stays in isolated scopes that skip explore", async () => {
      let store = newStore();
      const screen = await render(
         <cx>
            <div onClick={() => {}}>
               <IsolatedScope bind="person">
                  <label>City:</label>
                  <span text={m.person.city} />
               </IsolatedScope>
            </div>
         </cx>,
         { store },
      );
      await settle(() => store.set(m.other, 1));
      await settle(() => store.set(m.other, 2));
      await settle(() => store.set(m.person.city, "Zagreb"));
      assert.equal(
         screen.html(),
         markup`
            <div>
               <label>City:</label>
               <span>Zagreb</span>
            </div>
         `,
      );
   });
});

describe("Widget.shareInstances", () => {
   it("gives every widget an instance of its own when turned off, so that widgets can be updated again", async () => {
      Widget.shareInstances = false;
      try {
         let caption = Widget.create(StaticText, { text: "Name:" });
         let store = newStore({ people: people() });
         const screen = await render(
            <cx>
               <ul>
                  <Repeater records={m.people}>
                     <li>
                        <label items={[caption]} />
                        <span text={m.$record.firstName} />
                     </li>
                  </Repeater>
               </ul>
            </cx>,
            { store },
         );
         assert.equal(caption.staticState, null);
         caption.text = "First name:";
         caption.update();
         await settle(() => store.set(m.other, 1));
         assert.deepEqual(names(screen), ["First name:John", "First name:Jane"]);
      } finally {
         Widget.shareInstances = true;
      }
   });
});
