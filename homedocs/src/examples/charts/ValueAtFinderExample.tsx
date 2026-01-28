import { Svg } from "cx/svg";
import {
  Chart,
  NumericAxis,
  Gridlines,
  LineGraph,
  MouseTracker,
  ValueAtFinder,
  Marker,
  MarkerLine,
  ColorMap,
  Legend,
  LegendEntry,
} from "cx/charts";
import { createModel } from "cx/data";
import { Repeater, Controller, hasValue } from "cx/ui";
import { Button, Grid, enableTooltips } from "cx/widgets";

enableTooltips();

// @model
interface Point {
  x: number;
  y: number;
}

interface Series {
  name: string;
  trackedValue: number | null;
  points: Point[];
}

interface Cursor {
  x: number;
}

interface Model {
  series: Series[];
  cursor: Cursor;
  $record: Series;
  $index: number;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.generate();
  }

  generate() {
    this.store.set(
      m.series,
      Array.from({ length: 3 }, (_, i) => {
        let y = 80 + Math.random() * 40;
        return {
          name: `Series ${i + 1}`,
          trackedValue: null,
          points: Array.from({ length: 20 }, (_, x) => ({
            x: x * 5,
            y: (y = y + Math.random() * 20 - 10),
          })),
        };
      }),
    );
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <Legend />
    <Svg style="width: 100%; height: 300px">
      <Chart
        margin="20 20 40 50"
        axes={{
          x: { type: NumericAxis },
          y: { type: NumericAxis, vertical: true },
        }}
      >
        <Gridlines />
        <MouseTracker
          x={m.cursor.x}
          tooltip={{
            destroyDelay: 5,
            createDelay: 5,
            trackMouse: true,
            items: (
              <div>
                <ColorMap />
                <Grid
                  records={m.series}
                  defaultSortField="trackedValue"
                  defaultSortDirection="DESC"
                  columns={[
                    {
                      field: "name",
                      items: (
                        <LegendEntry
                          name={m.$record.name}
                          text={m.$record.name}
                          colorMap="lines"
                          shape="circle"
                          size={10}
                        />
                      ),
                    },
                    {
                      field: "trackedValue",
                      format: "n;1",
                      align: "right",
                    },
                  ]}
                />
              </div>
            ),
          }}
        >
          <MarkerLine
            visible={hasValue(m.cursor)}
            x={m.cursor.x}
            colorIndex={8}
          />
          <ColorMap />
          <Repeater
            records={m.series}
            recordAlias="$record"
            indexAlias="$index"
          >
            <ValueAtFinder at={m.cursor.x} value={m.$record.trackedValue}>
              <LineGraph
                name={m.$record.name}
                data={m.$record.points}
                colorMap="lines"
              />
            </ValueAtFinder>
            <Marker
              visible={hasValue(m.$record.trackedValue)}
              x={m.cursor.x}
              y={m.$record.trackedValue}
              colorMap="lines"
              size={8}
            />
          </Repeater>
        </MouseTracker>
      </Chart>
    </Svg>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px">
      <Button onClick="generate">Generate</Button>
      <span style="color: #666">Move mouse to track values on each line</span>
    </div>
  </div>
);
// @index-end
