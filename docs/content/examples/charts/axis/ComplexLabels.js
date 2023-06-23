import { HtmlElement, Grid, Repeater, Content, Tab } from 'cx/widgets';
import { Controller, PropertySelection } from 'cx/ui';
import { Svg, Rectangle, Text } from 'cx/svg';
import { Gridlines, Legend, NumericAxis, CategoryAxis, Chart, Bar, TimeAxis } from 'cx/charts';
import { getComparer } from 'cx/data';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';

import {casual} from 'docs/content/examples/data/casual';

class PageController extends Controller {
   init() {
      super.init();
      let start = new Date(2020, 1, 1).valueOf();
      let yearMs = 365 * 24 * 3600 * 1000;

      this.store.init('$page.points', Array.from({length: 15}, (_, i) => ({
         id: i,
         city: casual.city + "; US",
         start: start + Math.random() * 1 * yearMs,
         duration: Math.random() * 0.5 * yearMs
      })));
   }
}


export const ComplexLabels = <cx>
   <Md controller={PageController}>
      <CodeSplit>
         # Complex Labels Example

         This example shows how to create complex labels for chart axes using the `onCreateLabelFormatter` callback method.

         <div class="widgets">
            <div>
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
            </div>
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



