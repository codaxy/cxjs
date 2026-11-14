import { describe, it } from "vitest";
import { Store } from "../../data/Store";
import { ContentPlaceholder, ContentPlaceholderScope } from "./ContentPlaceholder";
import assert from "assert";
import { PureContainer } from "../PureContainer";
import { render, settle, markup } from "../../util/test/render";
import { bind } from "../bind";

describe("ContentPlaceholder", () => {
   it("allows putting content inside", async () => {
      let store = new Store();
      const screen = await render(
         <cx>
            <div>
               <header>
                  <ContentPlaceholder name="header" />
               </header>
               <main>
                  <h2 putInto="header">Header</h2>
               </main>
            </div>
         </cx>,
         { store },
      );

      assert.equal(
         screen.html(),
         markup`
            <div>
               <header>
                  <h2>Header</h2>
               </header>
               <main></main>
            </div>
         `,
      );
   });

   it("updates content on change", async () => {
      let store = new Store({
         data: {
            headerText: "Header",
         },
      });
      const screen = await render(
         <cx>
            <div>
               <ContentPlaceholder name="header" />
               <h2 putInto="header" text={bind("headerText")} />
            </div>
         </cx>,
         { store },
      );

      let getHTML = (headerText: string) => markup`
         <div>
            <h2>${headerText}</h2>
         </div>
      `;

      assert.equal(screen.html(), getHTML("Header"));
      await settle(() => store.set("headerText", "Footer"));
      assert.equal(screen.html(), getHTML("Footer"));
   });

   it("allows putting multiple entries inside", async () => {
      let store = new Store();
      const screen = await render(
         <cx>
            <div>
               <header>
                  <ContentPlaceholder name="headers" allowMultiple />
               </header>
               <main>
                  <h2 putInto="headers">Header1</h2>
                  <h2 putInto="headers">Header2</h2>
               </main>
            </div>
         </cx>,
         { store },
      );

      assert.equal(
         screen.html(),
         markup`
            <div>
               <header>
                  <h2>Header1</h2>
                  <h2>Header2</h2>
               </header>
               <main></main>
            </div>
         `,
      );
   });

   it("allows putting multiple entries inside when content is defined before and after the placeholder", async () => {
      let store = new Store();
      const screen = await render(
         <cx>
            <div>
               <PureContainer>
                  <h2 putInto="headers">Header1</h2>
                  <h2 putInto="headers">Header2</h2>
               </PureContainer>
               <header>
                  <ContentPlaceholder name="headers" allowMultiple />
               </header>
               <PureContainer>
                  <h2 putInto="headers">Header3</h2>
                  <h2 putInto="headers">Header4</h2>
               </PureContainer>
            </div>
         </cx>,
         { store },
      );

      assert.equal(
         screen.html(),
         markup`
            <div>
               <header>
                  <h2>Header1</h2>
                  <h2>Header2</h2>
                  <h2>Header3</h2>
                  <h2>Header4</h2>
               </header>
            </div>
         `,
      );
   });

   it("allows putting multiple entries into separate placeholders using content placeholder scopes", async () => {
      let store = new Store();
      const screen = await render(
         <cx>
            <div>
               <ContentPlaceholderScope name="headers">
                  <h2 putInto="headers">Header1</h2>
                  <h2 putInto="headers">Header2</h2>
                  <header>
                     <ContentPlaceholder name="headers" allowMultiple />
                  </header>
               </ContentPlaceholderScope>

               <ContentPlaceholderScope name="headers">
                  <header>
                     <ContentPlaceholder name="headers" allowMultiple />
                  </header>
                  <h2 putInto="headers">Header3</h2>
                  <h2 putInto="headers">Header4</h2>
               </ContentPlaceholderScope>
            </div>
         </cx>,
         { store },
      );

      assert.equal(
         screen.html(),
         markup`
            <div>
               <header>
                  <h2>Header1</h2>
                  <h2>Header2</h2>
               </header>
               <header>
                  <h2>Header3</h2>
                  <h2>Header4</h2>
               </header>
            </div>
         `,
      );
   });

   it("is used for defining body position in outer layouts", async () => {
      let store = new Store();

      let layout = (
         <cx>
            <div>
               <header>Header</header>
               <ContentPlaceholder />
               <footer>Footer</footer>
            </div>
         </cx>
      );

      const screen = await render(
         <cx>
            <main outerLayout={layout} />
         </cx>,
         { store },
      );

      assert.equal(
         screen.html(),
         markup`
            <div>
               <header>Header</header>
               <main></main>
               <footer>Footer</footer>
            </div>
         `,
      );
   });

   it("data in deeply nested placeholders is correctly updated", async () => {
      let store = new Store({
         data: {
            header: "H",
            footer: "F",
            body: "B",
         },
      });

      let layout = (
         <cx>
            <div>
               <header>
                  <ContentPlaceholder name="header" />
               </header>
               <ContentPlaceholder />
               <footer>
                  <ContentPlaceholder name="footer" />
               </footer>
            </div>
         </cx>
      );

      const screen = await render(
         <cx>
            <main outerLayout={layout}>
               <div putInto="header">
                  <span text={bind("header")} />
               </div>
               <div putInto="footer">
                  <span text={bind("footer")} />
               </div>
               <span text={bind("body")} />
            </main>
         </cx>,
         { store },
      );

      let getHTML = (h: string, b: string, f: string) => markup`
         <div>
            <header>
               <div>
                  <span>${h}</span>
               </div>
            </header>
            <main>
               <span>${b}</span>
            </main>
            <footer>
               <div>
                  <span>${f}</span>
               </div>
            </footer>
         </div>
      `;

      assert.equal(screen.html(), getHTML("H", "B", "F"));
      await settle(() => store.set("header", "H2"));
      assert.equal(screen.html(), getHTML("H2", "B", "F"));
      await settle(() => store.set("footer", "F2"));
      assert.equal(screen.html(), getHTML("H2", "B", "F2"));
      await settle(() => store.set("body", "B2"));
      assert.equal(screen.html(), getHTML("H2", "B2", "F2"));
   });

   it("inside a two-level deep outer-layout works", async () => {
      let store = new Store();

      let outerLayout = (
         <cx>
            <div>
               <ContentPlaceholder />
            </div>
         </cx>
      );

      let innerLayout = (
         <cx>
            <main outerLayout={outerLayout}>
               <ContentPlaceholder />
            </main>
         </cx>
      );

      const screen = await render(
         <cx>
            <section outerLayout={innerLayout} />
         </cx>,
         { store },
      );

      assert.equal(
         screen.html(),
         markup`
            <div>
               <main>
                  <section></section>
               </main>
            </div>
         `,
      );
   });

   it("works in strange order", async () => {
      let store = new Store();

      const screen = await render(
         <cx>
            <div>
               <ContentPlaceholder name="footer" />
               <PureContainer putInto="footer-content">works</PureContainer>
               <PureContainer putInto="footer">
                  It
                  <ContentPlaceholder name="footer-content">doesn't work</ContentPlaceholder>
               </PureContainer>
            </div>
         </cx>,
         { store },
      );

      assert.equal(screen.html(), "<div>Itworks</div>");
   });

   it("inside a complex two-level-deep outer-layout works", async () => {
      let store = new Store();

      let outerLayout = (
         <cx>
            <div>
               <ContentPlaceholder />
            </div>
         </cx>
      );

      let innerLayout = (
         <cx>
            <PureContainer>
               <main outerLayout={outerLayout}>
                  <ContentPlaceholder />
               </main>
            </PureContainer>
         </cx>
      );

      const screen = await render(
         <cx>
            <section outerLayout={innerLayout} />
         </cx>,
         { store },
      );

      assert.equal(
         screen.html(),
         markup`
            <div>
               <main>
                  <section></section>
               </main>
            </div>
         `,
      );
   });

   it("each level use an outer-layout", async () => {
      let store = new Store();

      let outerLayout1 = (
         <cx>
            <div>
               <ContentPlaceholder />
            </div>
         </cx>
      );

      let outerLayout2 = (
         <cx>
            <main>
               <ContentPlaceholder />
            </main>
         </cx>
      );

      const screen = await render(
         <cx>
            <PureContainer outerLayout={outerLayout1}>
               <PureContainer outerLayout={outerLayout2}>Content</PureContainer>
            </PureContainer>
         </cx>,
         { store },
      );

      assert.equal(
         screen.html(),
         markup`
            <div>
               <main>Content</main>
            </div>
         `,
      );
   });

   it("data in a two-level deep outer-layout is correctly updated", async () => {
      let store = new Store({
         data: {
            header: "H",
            footer: "F",
            body: "B",
         },
      });

      let outerLayout = (
         <cx>
            <div>
               <ContentPlaceholder />
               <footer>
                  <ContentPlaceholder name="footer" />
               </footer>
            </div>
         </cx>
      );

      let innerLayout = (
         <cx>
            <PureContainer>
               <PureContainer outerLayout={outerLayout}>
                  <header>
                     <ContentPlaceholder name="header" />
                  </header>
                  <ContentPlaceholder />
               </PureContainer>
            </PureContainer>
         </cx>
      );

      const screen = await render(
         <cx>
            <main outerLayout={innerLayout}>
               <div putInto="header">
                  <span text={bind("header")} />
               </div>
               <div putInto="footer">
                  <span text={bind("footer")} />
               </div>
               <span text={bind("body")} />
            </main>
         </cx>,
         { store },
      );

      let getHTML = (h: string, b: string, f: string) => markup`
         <div>
            <header>
               <div>
                  <span>${h}</span>
               </div>
            </header>
            <main>
               <span>${b}</span>
            </main>
            <footer>
               <div>
                  <span>${f}</span>
               </div>
            </footer>
         </div>
      `;

      assert.equal(screen.html(), getHTML("H", "B", "F"));
      await settle(() => store.set("header", "H2"));
      assert.equal(screen.html(), getHTML("H2", "B", "F"));
      await settle(() => store.set("footer", "F2"));
      assert.equal(screen.html(), getHTML("H2", "B", "F2"));
      await settle(() => store.set("body", "B2"));
      assert.equal(screen.html(), getHTML("H2", "B2", "F2"));
   });
});
