import { Bar, CategoryAxis, Chart, Column, Gridlines, NumericAxis, RangeMarker } from "cx/charts";
import { Svg } from "cx/svg";
import { Controller } from "cx/ui";
import { Content, Repeater, Tab } from "cx/widgets";
import { CodeSnippet } from "docs/components/CodeSnippet";
import { CodeSplit } from "docs/components/CodeSplit";
import { ImportPath } from "docs/components/ImportPath";
import { Md } from "docs/components/Md";
import { ConfigTable } from "../../components/ConfigTable";
import configs from "./configs/RangeMarker";

var categories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

class PageController extends Controller {
   init() {
      super.init();
      var v1 = 50;
      this.store.set(
         "$points",
         Array.from({ length: categories.length }, (_, i) => ({
            v1: categories[i],
            v2: (v1 = v1 + (Math.random() - 0.5) * 30),
            max: v1 + 30 * Math.random(),
            min: v1 - 30 * Math.random(),
            optimal: v1 - 10 * Math.random() + 5,
         })),
      );
   }
}

export const RangeMarkers = (
   <cx>
      <Md>
         <CodeSplit>
            # RangeMarker
            <ImportPath path="import {RangeMarker} from 'cx/charts';" />
            The `RangeMarker` widget is used to display a range markers on column or bar charts.
            <div class="widgets" controller={PageController}>
               <Svg style="width:600px; height:400px;">
                  <Chart
                     offset="20 -20 -40 40"
                     axes={{
                        x: { type: CategoryAxis },
                        y: { type: NumericAxis, vertical: true },
                     }}
                  >
                     <Gridlines />
                     <Repeater records-bind="$points" recordAlias="$point">
                        <Column
                           colorIndex={12}
                           size={0.7}
                           offset={0}
                           x-bind="$point.v1"
                           y-bind="$point.v2"
                           tooltip:tpl="{$point.v1} {$point.v2:n;2}"
                        />
                        <RangeMarker
                           x-bind="$point.v1"
                           y-bind="$point.max"
                           lineStyle="stroke: blue;"
                           size={0.7}
                           inflate={3}
                           shape="max"
                        />
                        <RangeMarker
                           x-bind="$point.v1"
                           y-bind="$point.min"
                           lineStyle="stroke: red;"
                           size={0.7}
                           inflate={3}
                           shape="min"
                        />
                        <RangeMarker
                           x-bind="$point.v1"
                           y-bind="$point.optimal"
                           lineStyle="stroke: green;"
                           size={0.7}
                           inflate={3}
                           shape="line"
                        />
                     </Repeater>
                  </Chart>
               </Svg>
               <Svg style="width:600px; height:400px;">
                  <Chart
                     offset="20 -20 -40 40"
                     axes={{
                        x: { type: NumericAxis, snapToTicks: 0 },
                        y: { type: CategoryAxis, vertical: true, snapToTicks: 1 },
                     }}
                  >
                     <Gridlines />
                     <Repeater records-bind="$points" recordAlias="$point">
                        <Bar
                        colorIndex={13}
                           size={0.7}
                           offset={0}
                           x-bind="$point.v2"
                           y-bind="$point.v1"
                           tooltip:tpl="{$point.v1} {$point.v2:n;2}"
                        />
                        <RangeMarker
                           y-bind="$point.v1"
                           x-bind="$point.max"
                           lineStyle="stroke: red;"
                           size={0.7}
                           shape="max"
                           inflate={3}
                           vertical
                        />
                        <RangeMarker
                           y-bind="$point.v1"
                           x-bind="$point.min"
                           lineStyle="stroke: blue;"
                           size={0.7}
                           shape="min"
                           inflate={3}
                           vertical
                        />
                        <RangeMarker
                           y-bind="$point.v1"
                           x-bind="$point.optimal"
                           lineStyle="stroke: green;"
                           size={0.7}
                           shape="line"
                           inflate={3}
                           vertical
                        />
                     </Repeater>
                  </Chart>
               </Svg>
            </div>
            <Content name="code">
               <Tab value-bind="$page.code.tab" mod="code" tab="controller" text="Controller" />
               <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default />
               <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="SqfLY8YB">{`
                  var categories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                  class PageController extends Controller {
                     init() {
                        super.init();
                        var v1 = 200;
                        this.store.set(
                           "$points",
                           Array.from({ length: categories.length }, (_, i) => ({
                              v1: categories[i],
                              v2: (v1 = v1 + (Math.random() - 0.5) * 30),
                              max: v1 + 30 * Math.random(),
                              min: v1 - 30 * Math.random(),
                              optimal: v1 - 10 * Math.random() + 5,
                           })),
                        );
                     }
                  }
            `}</CodeSnippet>
               <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="09AeaItO">{`
                  <div class="widgets" controller={PageController}>
                     <Svg style="width:600px; height:400px;">
                        <Chart
                           offset="20 -20 -40 40"
                           axes={{
                              x: { type: CategoryAxis },
                              y: { type: NumericAxis, vertical: true },
                           }}
                        >
                           <Gridlines />
                           <Repeater records-bind="$points" recordAlias="$point">
                              <Column
                                 colorIndex={12}
                                 size={0.7}
                                 offset={0}
                                 x:bind="$point.v1"
                                 y:bind="$point.v2"
                                 tooltip:tpl="{$point.v1} {$point.v2:n;2}"
                              />
                              <RangeMarker
                                 x-bind="$point.v1"
                                 y-bind="$point.max"
                                 lineStyle="stroke: blue;"
                                 size={0.7}
                                 inflate={3}
                                 shape="max"
                              />
                              <RangeMarker
                                 x-bind="$point.v1"
                                 y-bind="$point.min"
                                 lineStyle="stroke: red;"
                                 size={0.7}
                                 inflate={3}
                                 shape="min"
                              />
                              <RangeMarker
                                 x-bind="$point.v1"
                                 y-bind="$point.optimal"
                                 lineStyle="stroke: green;"
                                 size={0.7}
                                 inflate={3}
                                 shape="line"
                              />
                           </Repeater>
                        </Chart>
                     </Svg>
                     <Svg style="width:600px; height:400px;">
                        <Chart
                           offset="20 -20 -40 40"
                           axes={{
                              x: { type: NumericAxis, snapToTicks: 0 },
                              y: { type: CategoryAxis, vertical: true, snapToTicks: 1 },
                           }}
                        >
                           <Gridlines />
                           <Repeater records-bind="$points" recordAlias="$point">
                              <Bar
                                 colorIndex={13}
                                 size={0.7}
                                 offset={0}
                                 x:bind="$point.v2"
                                 y:bind="$point.v1"
                                 tooltip:tpl="{$point.v1} {$point.v2:n;2}"
                              />
                              <RangeMarker
                                 y-bind="$point.v1"
                                 x-bind="$point.max"
                                 lineStyle="stroke: red;"
                                 size={0.7}
                                 shape="max"
                                 inflate={3}
                                 vertical
                              />
                              <RangeMarker
                                 y-bind="$point.v1"
                                 x-bind="$point.min"
                                 lineStyle="stroke: blue;"
                                 size={0.7}
                                 shape="min"
                                 inflate={3}
                                 vertical
                              />
                              <RangeMarker
                                 y-bind="$point.v1"
                                 x-bind="$point.optimal"
                                 lineStyle="stroke: green;"
                                 size={0.7}
                                 shape="line"
                                 inflate={3}
                                 vertical
                              />
                           </Repeater>
                        </Chart>
                     </Svg>
                  </div>
            `}</CodeSnippet>
            </Content>
         </CodeSplit>
         ## Configuration
         <ConfigTable props={configs} />
      </Md>
   </cx>
);
