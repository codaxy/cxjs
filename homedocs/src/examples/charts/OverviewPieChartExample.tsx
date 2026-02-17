import { createModel } from "cx/data";
import { bind, KeySelection, Repeater } from "cx/ui";
import { Svg } from "cx/svg";
import { ColorMap, Legend, PieChart, PieSlice } from "cx/charts";

// @model
interface SliceData {
  name: string;
  value: number;
}

interface Model {
  $record: SliceData;
  selected: string;
}

const m = createModel<Model>();
// @model-end

// @index
export default (
  <Legend.Scope>
    <Svg style="height: 200px">
      <ColorMap />
      <PieChart>
        <Repeater
          records={[
            { name: "A", value: 10 },
            { name: "B", value: 20 },
            { name: "C", value: 15 },
          ]}
          recordAlias={m.$record}
        >
          <PieSlice
            name={m.$record.name}
            value={m.$record.value}
            colorMap="pie"
            r={90}
            selection={{
              type: KeySelection,
              bind: m.selected,
              keyField: "name",
              record: m.$record,
            }}
          />
        </Repeater>
      </PieChart>
    </Svg>
    <Legend />
  </Legend.Scope>
);
// @index-end
