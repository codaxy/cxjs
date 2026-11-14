import { describe, it } from "vitest";
import { userEvent } from "vitest/browser";
import assert from "assert";
import { createModel } from "../../data/createAccessorModelProxy";
import { Store } from "../../data/Store";
import { render, settle } from "../../util/test/render";
import { Slider } from "./Slider";

interface Model {
   $page: {
      boundObject?: number;
      chain?: number;
   };
}

// Renders the slider into the DOM. `wheel` scrolls the mouse wheel over the slider's root element,
// where Slider attaches its wheel listener on mount.
async function renderSlider(store: Store, widget: any) {
   let screen = await render(widget, { store });
   let slider = screen.container.querySelector<HTMLElement>(".cxb-slider")!;

   return {
      screen,
      handleLeft: () => {
         let handles = screen.container.querySelectorAll<HTMLElement>("[class*='slider-handle']");
         assert.strictEqual(handles.length, 1);
         return handles[0].style.left;
      },
      wheel: async (deltaY: number) => {
         await settle(() => userEvent.wheel(slider, { delta: { y: deltaY } }));
      },
   };
}

// Slider declares `from: 0` and `to: 0` (a `value` binding is moved to `to`).
// That default is written to the store when the slider initializes, whether the
// value is bound with a binding object or an accessor chain, so the handle
// position and wheel steps start from 0 (#1337).
describe("Slider value binding initialization", () => {
   const m = createModel<Model>();

   it("seeds 0 and places the handle at the start for a {bind} object", async () => {
      let store = new Store();
      let { handleLeft } = await renderSlider(store, <Slider value={{ bind: "$page.boundObject" }} />);
      assert.strictEqual(store.get("$page.boundObject"), 0);
      assert.strictEqual(handleLeft(), "0%");
   });

   it("seeds 0 and places the handle at the start for an accessor-chain binding", async () => {
      let store = new Store();
      let { handleLeft } = await renderSlider(store, <Slider value={m.$page.chain} />);
      assert.strictEqual(store.get(m.$page.chain), 0);
      assert.strictEqual(handleLeft(), "0%");
   });

   it("steps from 0 on mouse wheel for a {bind} object", async () => {
      let store = new Store();
      let { wheel } = await renderSlider(store, <Slider value={{ bind: "$page.boundObject" }} wheel />);
      await wheel(1);
      assert.strictEqual(store.get("$page.boundObject"), 1);
   });

   it("steps from 0 on mouse wheel for an accessor-chain binding", async () => {
      let store = new Store();
      let { wheel } = await renderSlider(store, <Slider value={m.$page.chain} wheel />);
      await wheel(1);
      assert.strictEqual(store.get(m.$page.chain), 1);
   });

   it("keeps an existing value for an accessor-chain binding", async () => {
      let store = new Store({ data: { $page: { chain: 40 } } });
      let { handleLeft } = await renderSlider(store, <Slider value={m.$page.chain} />);
      assert.strictEqual(store.get(m.$page.chain), 40);
      assert.strictEqual(handleLeft(), "40%");
   });
});
