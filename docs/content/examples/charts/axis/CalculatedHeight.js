import { Bar, CategoryAxis, Chart, Gridlines, NumericAxis, TimeAxis } from 'cx/charts';
import { Svg } from 'cx/svg';
import { Controller, LabelsTopLayout, bind, computable, tpl } from 'cx/ui';
import { Content, Repeater, Slider, Tab } from 'cx/widgets';
import { CodeSnippet } from 'docs/components/CodeSnippet';
import { CodeSplit } from 'docs/components/CodeSplit';
import { Md } from 'docs/components/Md';

import { casual } from 'docs/content/examples/data/casual';

class PageController extends Controller {
   onInit() {
      this.store.init('$page.itemCount', 5);
      this.addComputable('$page.points', ['$page.itemCount'], (itemCount) => {
        let names = {};
        for (let i = 0; i< itemCount; i++)
        {
            let name = casual.continent;
            names[name] = 1 + (names[name]??0);
        }
        return Object.keys(names).map(name => ({ name, count: names[name]}));
      });
   }
}


export const CalculatedHeight = <cx>
   <Md controller={PageController}>
      <CodeSplit>
         # Complex Labels Example

         This example shows how to calculate chart height based on the number of categories it displays.

         <div class="widgets flex-col">

                <LabelsTopLayout style="align-self: self">
                   <Slider value-bind="$page.itemCount" help={tpl("{$page.itemCount}")} minValue={1} maxValue={100} step={1} label="Item Count" />
               </LabelsTopLayout>
               <Svg style={{
                    width:"600px",
                    height: computable("$page.categoryCount", count => (count ?? 1) * 50 + 60)
                }}>
                  <Chart offset="20 -20 -40 120" axes={{
                    y: {
                        type: CategoryAxis,
                        vertical: true,
                        inverted: true,
                        categoryCount: bind("$page.categoryCount")
                    },
                    x: {
                        type: NumericAxis,
                        minLabelTickSize: 1
                    }
                }}>
                     <Repeater records-bind="$page.points" recordAlias="$point" sortField="count" sortDirection="DESC">
                        <Bar colorIndex={6}
                             x-bind="$point.count"
                             y-bind="$point.name"
                             size={0.5}
                        />
                     </Repeater>
                     <Gridlines/>
                  </Chart>
               </Svg>

         </div>

         <Content name="code">
            <div>
               <Tab value-bind="$page.code.tab" tab="controller" mod="code" text="Controller"/>
               <Tab value-bind="$page.code.tab" tab="chart" mod="code" default text="Chart"/>
            </div>

            <CodeSnippet fiddle="Z9CYf1Ph" visible-expr="{$page.code.tab}=='controller'">{`
         class PageController extends Controller {
            init() {
               super.init();
               let v1 = 200;

               this.store.init('$page.points', Array.from({length: 15}, (_, i) => ({
                  id: i,
                  city: casual.city,
                  max: v1 = 0.95 * v1,
                  value: (0.5 + 0.5 * Math.random()) * v1
               })));
            }
         }
        `}</CodeSnippet>
        <CodeSnippet fiddle="Z9CYf1Ph" visible-expr="{$page.code.tab}=='chart'">{`
    <Svg style="width:600px; height:600px;">
        <Chart offset="20 -20 -40 120" axes={{
          y: {
              type: CategoryAxis,
              vertical: true,
              inverted: true,
              labelLineHeight: 1.3,
              onCreateLabelFormatter: () => (formattedValue, value) => {
                  let parts = formattedValue.split(';');
                  return [{ text: parts[0], style: { fontWeight: 600 }}, { text: parts[1]}];
              }
          },
          x: {
              type: TimeAxis,
              snapToTicks: 0,
              format: "datetime;MMMyyyy",
              labelLineHeight: 1.3,
              onCreateLabelFormatter: () => (formattedValue, value) => {
                  let parts = formattedValue.split(' ');
                  let result = [{ text: parts[0] }];
                  let color = parts[0] == 'Jan' ? 'red' : null;
                  if (parts[0] == 'Jan') result.push({ text: parts[1], style: { fontWeight: 600, color }});
                  return result;
              }
          }
      }}>
           <Repeater records-bind="$page.points" recordAlias="$point" sorters-bind="$page.sorters">
              <Bar colorIndex={3}
                   style="stroke:none;opacity:0.3"
                   x0-bind="$point.start"
                   x-expr="{$point.start} + {$point.duration}"
                   y-bind="$point.city"
                   size={0.5}
              />
           </Repeater>
           <Gridlines/>
        </Chart>
     </Svg>
         `}</CodeSnippet>
         </Content>
      </CodeSplit>
   </Md>
</cx>;



