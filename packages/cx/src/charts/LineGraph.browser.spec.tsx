import { describe, it } from "vitest";
import assert from "assert";
import { createModel } from "../data/createAccessorModelProxy";
import { Store } from "../data/Store";
import { RenderingContext } from "../ui/RenderingContext";
import { Svg } from "../svg/Svg";
import { render, RenderResult } from "../util/test/render";
import { NumericAxis } from "./axis/NumericAxis";
import { Chart } from "./Chart";
import { Legend } from "./Legend";
import { LineGraph } from "./LineGraph";

// Svg renders its children only after measuring its DOM element, and the test
// containers have no set size. A fixed size makes the chart render on mount.
class FixedSizeSvg extends Svg {
   initState(context: RenderingContext, instance: any) {
      instance.state = { size: { width: 300, height: 200 } };
   }
}

interface Model {
   $page: {
      boundObject?: boolean;
      chain?: boolean;
   };
}

const points = [
   { x: 0, y: 0 },
   { x: 1, y: 1 },
];

function findByClass(screen: RenderResult, part: string) {
   return Array.from(screen.container.querySelectorAll("*")).filter((el) =>
      (el.getAttribute("class") ?? "").includes(part),
   );
}

function chart(active: any) {
   return (
      <div>
         <Legend />
         <FixedSizeSvg>
            <Chart axes={{ x: { type: NumericAxis }, y: { type: NumericAxis, vertical: true } }}>
               <LineGraph data={points} name="Series" colorIndex={0} active={active} />
            </Chart>
         </FixedSizeSvg>
      </div>
   );
}

// LineGraph declares `active: true`. That default is written to the store when
// the graph initializes, whether `active` is bound with a binding object or an
// accessor chain, so both draw the series until it is toggled off (#1337).
describe("LineGraph active binding initialization", () => {
   const m = createModel<Model>();

   it("renders the series and seeds active = true for a {bind} object", async () => {
      let store = new Store();
      let screen = await render(chart({ bind: "$page.boundObject" }), { store });
      assert.strictEqual(store.get("$page.boundObject"), true);
      assert.strictEqual(findByClass(screen, "linegraph-line").length, 1);
   });

   it("renders the series and seeds active = true for an accessor-chain binding", async () => {
      let store = new Store();
      let screen = await render(chart(m.$page.chain), { store });
      assert.strictEqual(store.get(m.$page.chain), true);
      assert.strictEqual(findByClass(screen, "linegraph-line").length, 1);
   });

   it("draws the legend entry as active for an accessor-chain binding", async () => {
      let store = new Store();
      let screen = await render(chart(m.$page.chain), { store });
      let [shape] = findByClass(screen, "legend-shape");
      assert.ok(shape.getAttribute("class")!.includes("color-0"));
   });

   it("keeps a stored active = false for both binding styles", async () => {
      let store = new Store({ data: { $page: { chain: false, boundObject: false } } });
      let chainComponent = await render(chart(m.$page.chain), { store });
      let bindComponent = await render(chart({ bind: "$page.boundObject" }), { store });
      assert.strictEqual(store.get(m.$page.chain), false);
      assert.strictEqual(store.get("$page.boundObject"), false);
      assert.strictEqual(findByClass(chainComponent, "linegraph-line").length, 0);
      assert.strictEqual(findByClass(bindComponent, "linegraph-line").length, 0);
   });
});
