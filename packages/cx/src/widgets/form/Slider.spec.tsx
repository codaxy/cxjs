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
// Bound with a binding object, the default is written to the store when the
// slider initializes. Bound with an accessor chain, nothing is written, so the
// slider calculates its handle position and wheel steps from `undefined` (#1337).
describe("Slider value binding initialization", () => {
   const m = createModel<Model>();

   it("seeds 0 and places the handle at the start for a {bind} object", async () => {
      let store = new Store();
      let { handleLeft } = await renderSlider(store, <Slider value={{ bind: "$page.boundObject" }} />);
      assert.strictEqual(store.get("$page.boundObject"), 0);
      assert.strictEqual(handleLeft(), "0%");
   });

   it("leaves the store empty and positions the handle at NaN% for an accessor-chain binding", async () => {
      let store = new Store();
      let { handleLeft } = await renderSlider(store, <Slider value={m.$page.chain} />);
      assert.strictEqual(store.get(m.$page.chain), undefined);
      assert.strictEqual(handleLeft(), "NaN%");
   });

   it("steps from 0 on mouse wheel for a {bind} object", async () => {
      let store = new Store();
      let { wheel } = await renderSlider(store, <Slider value={{ bind: "$page.boundObject" }} wheel />);
      await wheel(1);
      assert.strictEqual(store.get("$page.boundObject"), 1);
   });

   it("writes NaN to the store on mouse wheel for an accessor-chain binding", async () => {
      let store = new Store();
      let { wheel } = await renderSlider(store, <Slider value={m.$page.chain} wheel />);
      await wheel(1);
      assert.ok(Number.isNaN(store.get(m.$page.chain)));
   });
});
