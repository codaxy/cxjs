import "../index.scss";
import { describe, it } from "vitest";
import assert from "assert";
import { createModel } from "../data/createAccessorModelProxy";
import { Store } from "../data/Store";
import { Rescope } from "../ui/Rescope";
import { ContentPlaceholder } from "../ui/layout/ContentPlaceholder";
import { PureContainer } from "../ui/PureContainer";
import { Section } from "./Section";
import { Window } from "./overlay/Window";
import { render, settle, RenderResult } from "../util/test/render";

interface Model {
   user: { name: string };
   show: boolean;
}

const m = createModel<Model>();
const u = createModel<{ name: string }>();

function text(screen: RenderResult, selector: string) {
   let el = screen.container.querySelector(selector) ?? document.querySelector(selector);
   return el ? el.textContent : null;
}

async function setup(widget: any) {
   let store = new Store({ data: { user: { name: "Jane" }, show: false } });
   let screen = await render(widget, { store });
   return Object.assign(screen, { store });
}

describe("Section", () => {
   it("renders no header or footer without content for them", async () => {
      let screen = await setup(
         <cx>
            <Section>Body</Section>
         </cx>,
      );
      assert.equal(screen.container.querySelector("header"), null);
      assert.equal(screen.container.querySelector("footer"), null);
      assert.equal(text(screen, ".cxe-section-body"), "Body");
   });

   it("shows the title in the header", async () => {
      let screen = await setup(
         <cx>
            <Section title="Title">Body</Section>
         </cx>,
      );
      assert.equal(text(screen, ".cxe-section-header"), "Title");
   });

   it("shows children with putInto header and footer in the header and the footer", async () => {
      let screen = await setup(
         <cx>
            <Section>
               <h4 putInto="header">Header</h4>
               Body
               <div putInto="footer">Footer</div>
            </Section>
         </cx>,
      );
      assert.equal(text(screen, ".cxe-section-header"), "Header");
      assert.equal(text(screen, ".cxe-section-body"), "Body");
      assert.equal(text(screen, ".cxe-section-footer"), "Footer");
   });

   it("shows nested content with putInto header and footer, e.g. inside a Rescope (#535)", async () => {
      let screen = await setup(
         <cx>
            <Section>
               <Rescope bind={m.user}>
                  <h4 putInto="header" text={u.name} />
                  Body
                  <div putInto="footer" text={u.name} />
               </Rescope>
            </Section>
         </cx>,
      );
      assert.equal(text(screen, ".cxe-section-header"), "Jane");
      assert.equal(text(screen, ".cxe-section-body"), "Body");
      assert.equal(text(screen, ".cxe-section-footer"), "Jane");
   });

   it("shows the footer only while nested content put into it is visible", async () => {
      let screen = await setup(
         <cx>
            <Section>
               <div>
                  Body
                  <div putInto="footer" visible={m.show}>
                     Footer
                  </div>
               </div>
            </Section>
         </cx>,
      );
      assert.equal(screen.container.querySelector("footer"), null);

      await settle(() => screen.store.set(m.show, true));
      assert.equal(text(screen, ".cxe-section-footer"), "Footer");

      await settle(() => screen.store.set(m.show, false));
      assert.equal(screen.container.querySelector("footer"), null);
   });

   it("renders no footer if nothing in the content put into it is visible", async () => {
      let screen = await setup(
         <cx>
            <Section>
               <div>
                  Body
                  <PureContainer putInto="footer">
                     <span visible={m.show}>Footer</span>
                  </PureContainer>
               </div>
            </Section>
         </cx>,
      );
      assert.equal(screen.container.querySelector("footer"), null);

      await settle(() => screen.store.set(m.show, true));
      assert.equal(text(screen, ".cxe-section-footer"), "Footer");
   });

   it("keeps nested content in the section, away from outer placeholders", async () => {
      let screen = await setup(
         <cx>
            <div>
               <div class="app-header">
                  <ContentPlaceholder name="header" />
               </div>
               <Section>
                  <div>
                     <h4 putInto="header">Section header</h4>
                  </div>
               </Section>
               <span putInto="header">App header</span>
            </div>
         </cx>,
      );
      assert.equal(text(screen, ".cxe-section-header"), "Section header");
      assert.equal(text(screen, ".app-header"), "App header");
   });

   it("leaves nested content to outer placeholders if the section has its own header", async () => {
      let screen = await setup(
         <cx>
            <div>
               <div class="app-header">
                  <ContentPlaceholder name="header" />
               </div>
               <Section title="Title">
                  <div>
                     <span putInto="header">App header</span>
                  </div>
               </Section>
            </div>
         </cx>,
      );
      assert.equal(text(screen, ".cxe-section-header"), "Title");
      assert.equal(text(screen, ".app-header"), "App header");
   });

   it("puts nested content into the closest section", async () => {
      let screen = await setup(
         <cx>
            <Section class="outer">
               <div putInto="footer">Outer footer</div>
               <Section class="inner">
                  <div>
                     <h4 putInto="header">Inner header</h4>
                  </div>
               </Section>
            </Section>
         </cx>,
      );
      assert.equal(text(screen, ".inner > .cxe-section-header"), "Inner header");
      assert.equal(screen.container.querySelector(".outer > .cxe-section-header"), null);
      assert.equal(text(screen, ".outer > .cxe-section-footer"), "Outer footer");
   });

   // behavior change: before, such content went to the footer of the window
   it("takes footer content nested in a section inside a window", async () => {
      await setup(
         <cx>
            <Window visible title="Window">
               <Section>
                  <div>
                     Body
                     <div putInto="footer" class="buttons">
                        OK
                     </div>
                  </div>
               </Section>
            </Window>
         </cx>,
      );
      let footer = document.querySelector(".buttons")!.closest("footer")!;
      assert.ok(footer.classList.contains("cxe-section-footer"), footer.className);
   });
});
