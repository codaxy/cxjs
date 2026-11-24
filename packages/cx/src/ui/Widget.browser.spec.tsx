import "../index.scss";
import { describe, it } from "vitest";
import assert from "assert";
import { createModel } from "../data/createAccessorModelProxy";
import { Store } from "../data/Store";
import { Section } from "../widgets/Section";
import { render, settle } from "../util/test/render";

const m = createModel<{ show: boolean }>();

describe("Widget components", () => {
   // a section renders its header and footer as components; hiding one must render the section again
   it("are removed from the rendering when they are hidden", async () => {
      let store = new Store({ data: { show: true } });
      let screen = await render(
         <cx>
            <Section>
               Body
               <div putInto="footer" visible={m.show}>
                  Footer
               </div>
            </Section>
         </cx>,
         { store },
      );
      assert.equal(screen.container.querySelector("footer")?.textContent, "Footer");

      await settle(() => store.set(m.show, false));
      assert.equal(screen.container.querySelector("footer"), null);

      await settle(() => store.set(m.show, true));
      assert.equal(screen.container.querySelector("footer")?.textContent, "Footer");
   });
});
