import { describe, it } from "vitest";
import { Store } from "../data/Store";
import assert from "assert";
import { render, settle, markup } from "../util/test/render";
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
      const screen = await render(widget, { store });

      assert.equal(screen.html(), "<div>Test</div>");
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
      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>First</div>
            <div>Second</div>
            <div>Third</div>
         `,
      );
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

      const screen = await render(widget, { store });

      assert.equal(screen.html(), "<div>Hello World</div>");
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
      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>
               <span>Nested</span>
            </div>
         `,
      );
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

      const screen = await render(widget, { store });

      assert.equal(screen.html(), "<div>Visible</div>");
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
      const screen = await render(widget, { store });

      assert.equal(screen.html(), "<div></div>");
   });

   it("renders children from items property", async () => {
      let widget = (
         <cx>
            <PureContainer items={[<div key="1">Item 1</div>, <div key="2">Item 2</div>]} />
         </cx>
      );

      let store = new Store();
      const screen = await render(widget, { store });

      assert.equal(
         screen.html(),
         markup`
            <div>Item 1</div>
            <div>Item 2</div>
         `,
      );
   });

   it("renders text as a template with plainText={false} (#1354)", async () => {
      let store = new Store({ data: { name: "John" } });
      const screen = await render(
         <cx>
            <div>
               <PureContainer plainText={false} items={["Hello {name}"]} />
            </div>
         </cx>,
         { store },
      );

      assert.equal(screen.html(), "<div>Hello John</div>");

      await settle(() => store.set("name", "Jane"));
      assert.equal(screen.html(), "<div>Hello Jane</div>");
   });

   it("renders text with placeholders literally by default", async () => {
      let store = new Store({ data: { name: "John" } });
      const screen = await render(
         <cx>
            <div>
               <PureContainer items={["Hello {name}"]} />
            </div>
         </cx>,
         { store },
      );

      assert.equal(screen.html(), "<div>Hello {name}</div>");
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

      const screen = await render(widget, { store });

      assert.equal(screen.html(), "<div>0</div>");

      // Update the store
      await settle(() => store.set("count", 5));

      assert.equal(screen.html(), "<div>5</div>");
   });
});
