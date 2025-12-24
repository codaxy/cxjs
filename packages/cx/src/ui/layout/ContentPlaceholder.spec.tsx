import { Store } from "../../data/Store";
import { ContentPlaceholder, ContentPlaceholderScope } from "./ContentPlaceholder";
import assert from "assert";
import { PureContainer } from "../PureContainer";
import { createTestRenderer, act } from "../../util/test/createTestRenderer";
import { bind } from "../bind";

describe("ContentPlaceholder", () => {
   it("allows putting content inside", async () => {
      let store = new Store();
      const component = await createTestRenderer(
         store,
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
      );

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [
            {
               type: "header",
               props: {},
               children: [
                  {
                     type: "h2",
                     props: {},
                     children: ["Header"],
                  },
               ],
            },
            {
               type: "main",
               props: {},
               children: null,
            },
         ],
      });
   });

   it("updates content on change", async () => {
      let store = new Store({
         data: {
            headerText: "Header",
         },
      });
      const component = await createTestRenderer(
         store,
         <cx>
            <div>
               <ContentPlaceholder name="header" />
               <h2 putInto="header" text={bind("headerText")} />
            </div>
         </cx>,
      );

      let getTree = (headerText: string) => ({
         type: "div",
         props: {},
         children: [
            {
               type: "h2",
               props: {},
               children: [headerText],
            },
         ],
      });

      assert.deepEqual(component.toJSON(), getTree("Header"));
      await act(async () => {
         store.set("headerText", "Footer");
      });
      assert.deepEqual(component.toJSON(), getTree("Footer"));
   });

   it("allows putting multiple entries inside", async () => {
      let store = new Store();
      const component = await createTestRenderer(
         store,
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
      );

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [
            {
               type: "header",
               props: {},
               children: [
                  {
                     type: "h2",
                     props: {},
                     children: ["Header1"],
                  },
                  {
                     type: "h2",
                     props: {},
                     children: ["Header2"],
                  },
               ],
            },
            {
               type: "main",
               props: {},
               children: null,
            },
         ],
      });
   });

   it("allows putting multiple entries inside when content is defined before and after the placeholder", async () => {
      let store = new Store();
      const component = await createTestRenderer(
         store,
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
      );

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [
            {
               type: "header",
               props: {},
               children: [
                  {
                     type: "h2",
                     props: {},
                     children: ["Header1"],
                  },
                  {
                     type: "h2",
                     props: {},
                     children: ["Header2"],
                  },
                  {
                     type: "h2",
                     props: {},
                     children: ["Header3"],
                  },
                  {
                     type: "h2",
                     props: {},
                     children: ["Header4"],
                  },
               ],
            },
         ],
      });
   });

   it("allows putting multiple entries into separate placeholders using content placeholder scopes", async () => {
      let store = new Store();
      const component = await createTestRenderer(
         store,
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
      );

      let tree = component.toJSON();
      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [
            {
               type: "header",
               props: {},
               children: [
                  {
                     type: "h2",
                     props: {},
                     children: ["Header1"],
                  },
                  {
                     type: "h2",
                     props: {},
                     children: ["Header2"],
                  },
               ],
            },
            {
               type: "header",
               props: {},
               children: [
                  {
                     type: "h2",
                     props: {},
                     children: ["Header3"],
                  },
                  {
                     type: "h2",
                     props: {},
                     children: ["Header4"],
                  },
               ],
            },
         ],
      });
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

      const component = await createTestRenderer(
         store,
         <cx>
            <main outerLayout={layout} />
         </cx>,
      );

      assert.deepEqual(component.toJSON(), {
         type: "div",
         props: {},
         children: [
            {
               type: "header",
               props: {},
               children: ["Header"],
            },
            {
               type: "main",
               props: {},
               children: null,
            },
            {
               type: "footer",
               props: {},
               children: ["Footer"],
            },
         ],
      });
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

      const component = await createTestRenderer(
         store,
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
      );

      let getTree = (h: string, b: string, f: string) => ({
         type: "div",
         props: {},
         children: [
            {
               type: "header",
               props: {},
               children: [{ type: "div", props: {}, children: [{ type: "span", props: {}, children: [h] }] }],
            },
            {
               type: "main",
               props: {},
               children: [{ type: "span", props: {}, children: [b] }],
            },
            {
               type: "footer",
               props: {},
               children: [{ type: "div", props: {}, children: [{ type: "span", props: {}, children: [f] }] }],
            },
         ],
      });

      assert.deepEqual(component.toJSON(), getTree("H", "B", "F"));
      await act(async () => {
         store.set("header", "H2");
      });
      assert.deepEqual(component.toJSON(), getTree("H2", "B", "F"));
      await act(async () => {
         store.set("footer", "F2");
      });
      assert.deepEqual(component.toJSON(), getTree("H2", "B", "F2"));
      await act(async () => {
         store.set("body", "B2");
      });
      assert.deepEqual(component.toJSON(), getTree("H2", "B2", "F2"));
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

      const component = await createTestRenderer(
         store,
         <cx>
            <section outerLayout={innerLayout} />
         </cx>,
      );

      let tree = component.toJSON();

      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: [
            {
               type: "main",
               props: {},
               children: [
                  {
                     type: "section",
                     props: {},
                     children: null,
                  },
               ],
            },
         ],
      });
   });

   it("works in strange order", async () => {
      let store = new Store();

      const component = await createTestRenderer(
         store,
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
      );

      let tree = component.toJSON();

      assert.deepEqual(tree, {
         type: "div",
         props: {},
         children: ["It", "works"],
      });
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

      const component = await createTestRenderer(
         store,
         <cx>
            <section outerLayout={innerLayout} />
         </cx>,
      );

      assert.deepEqual(component.toJSON(), {
         type: "div",
         props: {},
         children: [{ type: "main", props: {}, children: [{ type: "section", props: {}, children: null }] }],
      });
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

      const component = await createTestRenderer(
         store,
         <cx>
            <PureContainer outerLayout={outerLayout1}>
               <PureContainer outerLayout={outerLayout2}>Content</PureContainer>
            </PureContainer>
         </cx>,
      );

      assert.deepEqual(component.toJSON(), {
         type: "div",
         props: {},
         children: [{ type: "main", props: {}, children: ["Content"] }],
      });
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

      const component = await createTestRenderer(
         store,
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
      );

      let getTree = (h: string, b: string, f: string) => ({
         type: "div",
         props: {},
         children: [
            {
               type: "header",
               props: {},
               children: [{ type: "div", props: {}, children: [{ type: "span", props: {}, children: [h] }] }],
            },
            {
               type: "main",
               props: {},
               children: [{ type: "span", props: {}, children: [b] }],
            },
            {
               type: "footer",
               props: {},
               children: [{ type: "div", props: {}, children: [{ type: "span", props: {}, children: [f] }] }],
            },
         ],
      });

      assert.deepEqual(component.toJSON(), getTree("H", "B", "F"));
      await act(async () => {
         store.set("header", "H2");
      });
      assert.deepEqual(component.toJSON(), getTree("H2", "B", "F"));
      await act(async () => {
         store.set("footer", "F2");
      });
      assert.deepEqual(component.toJSON(), getTree("H2", "B", "F2"));
      await act(async () => {
         store.set("body", "B2");
      });
      assert.deepEqual(component.toJSON(), getTree("H2", "B2", "F2"));
   });
});
