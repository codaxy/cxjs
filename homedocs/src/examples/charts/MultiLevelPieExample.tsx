import { Svg } from "cx/svg";
import { PieChart, PieSlice, Legend, ColorMap } from "cx/charts";
import { createModel } from "cx/data";
import { Controller, Repeater, KeySelection, expr } from "cx/ui";

// @model
interface SubSlice {
  name: string;
  value: number;
}

interface Slice {
  id: number;
  name: string;
  value: number;
  active: boolean;
  slices: SubSlice[];
}

interface Model {
  data: Slice[];
  $record: Slice;
  $index: number;
  $slice: SubSlice;
  $sliceIndex: number;
  selection: number | null;
}

const m = createModel<Model>();
// @model-end

const regions: Record<string, string[]> = {
  "North America": ["USA", "Canada", "Mexico"],
  Europe: ["Germany", "France", "UK", "Italy"],
  "Asia Pacific": ["China", "Japan", "India", "Australia"],
  "Latin America": ["Brazil", "Argentina", "Chile"],
  "Middle East": ["UAE", "Saudi Arabia", "Israel"],
  Africa: ["South Africa", "Nigeria", "Egypt"],
};

// @controller
class PageController extends Controller<typeof m> {
  onInit() {
    this.store.set(
      m.data,
      Object.entries(regions).map(([name, countries], i) => {
        let slices = countries.map((country) => ({
          name: country,
          value: 5 + Math.random() * 25,
        }));
        return {
          id: i,
          name,
          value: slices.reduce((sum, s) => sum + s.value, 0),
          active: true,
          slices,
        };
      }),
    );
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController}>
    <Legend />
    <div style="display: flex; gap: 16px">
      <Svg style="flex: 1; height: 350px">
        <ColorMap />
        <PieChart gap={2}>
          <Repeater records={m.data}>
            <PieSlice
              value={m.$record.value}
              active={m.$record.active}
              colorMap="pie"
              r={55}
              r0={20}
              borderRadius={3}
              name={m.$record.name}
              selection={{
                type: KeySelection,
                bind: m.selection,
                record: m.$record,
                index: m.$index,
                keyField: "id",
              }}
            />
            <Repeater
              records={m.$record.slices}
              recordAlias="$slice"
              indexAlias="$sliceIndex"
            >
              <PieSlice
                value={m.$slice.value}
                active={m.$record.active}
                colorMap="pie"
                colorName={m.$record.name}
                r={90}
                r0={58}
                offset={3}
                borderRadius={3}
                name={m.$slice.name}
                legend={expr(m.selection, m.$record.id, (sel, id) =>
                  sel === id ? "slice" : false,
                )}
                stack="outer"
                style={{
                  fillOpacity: expr(m.$sliceIndex, (i) => 0.4 + 0.6 * (i / 3)),
                }}
                selection={{
                  type: KeySelection,
                  bind: m.selection,
                  record: m.$record,
                  index: m.$index,
                  keyField: "id",
                }}
              />
            </Repeater>
          </Repeater>
        </PieChart>
      </Svg>
      <Legend name="slice" vertical class="w-32" />
    </div>
  </div>
);
// @index-end
