import { Line, Rectangle, Svg, Text } from "cx/svg";
import { ColorMap, Legend, PieChart, PieSlice } from "cx/charts";
import { Controller, KeySelection, Repeater } from "cx/ui";
import { HtmlElement } from "cx/widgets";

/*
    Issue was brought by this commit: 
    
    Message: Use parent stores to prevent store change floods
    Link: https://github.com/codaxy/cxjs/commit/2fc6e5555df5f7d589ade27f4dd6d534d7bd0a72

    Before this, when pie slice active bind is used, it was true by default.
    After it, only the first pie slice active bind is initialized to true. 
*/

class PageController extends Controller {
  init() {
    super.init();
    var value = 100;
    this.store.set(
      "$page.points",
      Array.from({ length: 7 }, (_, i) => ({
        id: i,
        name: "Item " + (i + 1),
        value: (value = value + (Math.random() - 0.5) * 30)
      }))
    );
  }
}

export default  (
  <cx>
    <div class="widgets" controller={PageController}>
      <Legend />
      <div>
        <Svg style="width:600px; height:400px;">
          <ColorMap />
          <PieChart angle={360}>
            <Repeater records-bind="$page.points">
              <PieSlice
                value-bind="$record.value"
                active-bind="$record.active"
                colorMap="pie"
                r={80}
                r0={20}
                offset={1}
                br={5}
                tooltip={{
                  text: {
                    tpl: "Item {$index}: {$record.value:n;2}"
                  },
                  trackMouse: true,
                  globalMouseTracking: true,
                  destroyDelay: 50,
                  createDelay: 0,
                  animate: false
                }}
                innerPointRadius={80}
                outerPointRadius={90}
                name-bind="$record.name"
                selection={{
                  type: KeySelection,
                  bind: "$page.selection",
                  records: { bind: "$page.points" },
                  record: { bind: "$record" },
                  index: { bind: "$index" },
                  keyField: "id"
                }}
              >
                <Line style="stroke:gray" />
                <Rectangle
                  anchors="1 1 1 1"
                  offset="-10 20 10 -20"
                  style="fill:white"
                >
                  <Text tpl="{$record.value:n;1}" dy="0.4em" ta="middle" />
                </Rectangle>
              </PieSlice>
            </Repeater>
          </PieChart>
        </Svg>
      </div>
    </div>
    import {HtmlElement} from "cx/widgets";
  </cx>
);
