import assert from "assert";
import { createModel } from "../data/createAccessorModelProxy";
import { Store } from "../data/Store";
import { RenderingContext } from "../ui/RenderingContext";
import { Svg } from "../svg/Svg";
import { createTestRenderer } from "../util/test/createTestRenderer";
import { NumericAxis } from "./axis/NumericAxis";
import { Chart } from "./Chart";
import { Legend } from "./Legend";
import { LineGraph } from "./LineGraph";

// Svg renders its children only after measuring its DOM element, which
// react-test-renderer does not provide. A fixed size makes the chart render.
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

function findByClass(component: any, part: string) {
   return component.root.findAll(
      (node: any) => typeof node.type === "string" && String(node.props.className ?? "").includes(part),
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

// LineGraph declares `active: true`. Bound with a binding object, that default
// is written to the store when the graph initializes. Bound with an accessor
// chain, nothing is written, the graph sees `active: undefined` and draws
// nothing (#1337).
describe("LineGraph active binding initialization", () => {
   const m = createModel<Model>();

   it("renders the series and seeds active = true for a {bind} object", async () => {
      let store = new Store();
      let component = await createTestRenderer(store, chart({ bind: "$page.boundObject" }));
      assert.strictEqual(store.get("$page.boundObject"), true);
      assert.strictEqual(findByClass(component, "linegraph-line").length, 1);
   });

   it("does not render the series for an accessor-chain binding with an empty store", async () => {
      let store = new Store();
      let component = await createTestRenderer(store, chart(m.$page.chain));
      assert.strictEqual(store.get(m.$page.chain), undefined);
      assert.strictEqual(findByClass(component, "linegraph-line").length, 0);
   });

   it("still draws the legend entry as active for an accessor-chain binding", async () => {
      let store = new Store();
      let component = await createTestRenderer(store, chart(m.$page.chain));
      assert.strictEqual(findByClass(component, "linegraph-line").length, 0);
      assert.strictEqual(findByClass(component, "color-0").length, 1);
   });

   it("renders the series for an accessor-chain binding once the store holds true", async () => {
      let store = new Store({ data: { $page: { chain: true } } });
      let component = await createTestRenderer(store, chart(m.$page.chain));
      assert.strictEqual(findByClass(component, "linegraph-line").length, 1);
   });
});
