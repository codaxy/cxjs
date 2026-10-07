import assert from "assert";
import renderer from "react-test-renderer";
import { createModel } from "../../data/createAccessorModelProxy";
import { Store } from "../../data/Store";
import { act, createTestWidget } from "../../util/test/createTestRenderer";
import { Slider } from "./Slider";

interface Model {
   $page: {
      boundObject?: number;
      chain?: number;
   };
}

// react-test-renderer has no DOM, but Slider attaches its wheel listener to
// its root element on mount. The mock captures that listener so tests can
// call it directly.
async function renderSlider(store: Store, widget: any) {
   let wheelListeners: ((e: any) => void)[] = [];
   let component: renderer.ReactTestRenderer;
   await act(async () => {
      component = renderer.create(createTestWidget(store, widget), {
         createNodeMock: () => ({
            addEventListener: (event: string, listener: (e: any) => void) => {
               if (event == "wheel") wheelListeners.push(listener);
            },
            removeEventListener: () => {},
         }),
      });
   });

   return {
      component: component!,
      handleLeft: () =>
         component.root.find((node: any) => String(node.props.className ?? "").includes("slider-handle")).props.style
            .left,
      wheel: async (deltaY: number) => {
         await act(async () => {
            for (let listener of wheelListeners)
               listener({ deltaY, preventDefault: () => {}, stopPropagation: () => {} });
         });
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
