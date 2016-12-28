import { HtmlElement, Repeater } from 'cx/widgets';
import { Svg, Rectangle } from 'cx/svg';
import { Chart, NumericAxis, Gridlines, LineGraph, Legend, ColorMap, PieChart, PieSlice } from 'cx/charts';
import { KeySelection } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from 'docs/components/ImportPath';



export const Charts = <cx>
   <Md>
      # Charts

      <ImportPath path="import {Chart} from 'cx/charts';" />

      Charts represent a very important part of Cx and extend the SVG package.
      Instead of delivering advanced charts widgets for each chart type, focus is put on low level components required to assemble any chart.
      This way, developers have more control over appearance and behavior of each chart element.

      Line, bar and scatter charts are defined inside of a `Chart` widget. Alternatively, `PieChart` is used for pie charts and `PolarChart` will be used
      for polar charts (not yet implemented).

      The `Chart` widget is used to define axes and bounds for two dimensional charts such as line, scatter, bar and column charts.

      <CodeSplit>
         <div class="widgets">
            <Legend.Scope>
               <Svg style="width:300px;height:200px;border:1px solid #ddd" margin="10 20 30 50">
                  <Chart axes={{
                     x: <NumericAxis />,
                     y: <NumericAxis vertical/>
                  }}>
                     <Rectangle fill="white" />
                     <Gridlines />
                     <LineGraph name="Line 1"
                                colorIndex={5}
                                data={[{x: 0, y: 0}, {x: 100, y: 100}, {x: 200, y: 150}]} />

                     <LineGraph name="Line 2"
                                colorIndex={10}
                                data={[{x: 0, y: 50}, {x: 100, y: 150}, {x: 200, y: 100}]} />
                  </Chart>
               </Svg>
               <Legend vertical />
            </Legend.Scope>
         </div>

         <CodeSnippet putInto="code">{`
             <Svg style="width:300px;height:200px" margin="10 20 30 50">
               <Chart axes={{
                  x: <NumericAxis />,
                  y: <NumericAxis vertical/>
               }}>
                  <Rectangle fill="white" />
                  <Gridlines />
                  <LineGraph name="Line 1"
                             colorIndex={5}
                             data={[{x: 0, y: 0}, {x: 100, y: 100}, {x: 200, y: 150}]} />

                  <LineGraph name="Line 2"
                             colorIndex={10}
                             data={[{x: 0, y: 50}, {x: 100, y: 150}, {x: 200, y: 100}]} />
               </Chart>
            </Svg>
            <Legend vertical />
         `}</CodeSnippet>
      </CodeSplit>

      The most important part is axis configuration. Numeric, category and date axis types are supported.

      Charts may consist of many different child elements. In this example three other widgets are used: a Rectangle
      serves as a white background, on top of it GridLines widget is used to add grid lines, and finally, 
      a LineGraph is used to present the data.

      Child elements inherit axis information from the chart object and use it for their own drawing.

      ### Legends

      <ImportPath path="import {Legend} from 'cx/charts';" />

      Legends are very important chart elements. In Cx, the `Legend` is context aware which means that
      all legend-aware widgets report information about themselves and that is used to populate the legend.
      Widgets may also report their legend actions, and in that case, legend becomes a switch for toggling or selection.
      The `Legend` widget is not based on SVG and therefore it **should not** be put anywhere inside the `Svg` widget.
      Legend will *grow* with the number of entries inside it, so it should have enough space. In case when there are multiple
      charts and legends, a `Legend.Scope` widget may be used to delimit legends scopes or use unique legend names.

      <CodeSplit>

         The `Repeater` control inside a chart is used to iterate over an array and map it to chart elements.

         <div class="widgets">
            <Legend.Scope>
               <Svg style="width:200px;height:200px;">
                  <ColorMap />
                  <PieChart>
                     <Repeater records={[
                        {name: 'A', value: 10},
                        {name: 'B', value: 20},
                        {name: 'C', value: 15}
                     ]}>
                        <PieSlice name:bind="$record.name"
                                   value:bind="$record.value"
                                   colorMap="pie"
                                   r={90}
                                   selection={{
                                      type: KeySelection,
                                      bind: '$page.selected.pie',
                                      keyField: 'name',
                                      record: { bind: "$record" }
                                   }}
                        />
                     </Repeater>
                  </PieChart>
               </Svg>
               <Legend vertical />
            </Legend.Scope>
         </div>

         <CodeSnippet putInto="code">{`
            <Svg style="width:200px;height:200px;">
               <ColorMap />
               <PieChart>
                  <Repeater records={[
                     {name: 'A', value: 10},
                     {name: 'B', value: 20},
                     {name: 'C', value: 15}
                  ]}>
                     <PieSlice name:bind="$record.name"
                                value:bind="$record.value"
                                colorMap="pie"
                                r={90}
                                selection={{
                                   type: KeySelection,
                                   bind: '$page.selected.pie',
                                   keyField: 'name',
                                   record: { bind: "$record" }
                                }}
                     />
                  </Repeater>
               </PieChart>
            </Svg>
            <Legend vertical />
         `}</CodeSnippet>
      </CodeSplit>

      A selection model may be used to enable selection and interact with other widgets on the page.

      ### Color Palettes and Maps

      <ImportPath path="import {ColorMap} from 'cx/charts';" />

      Cx standard palette consists of 16 colors based on [Google Material Design](https://material.google.com/style/color.html).

      <div>
         <Repeater records={Array.from({length:16}).map(x=>{})}>
            <div style="padding:10px 15px;display:inline-block" class:tpl="cxs-color-{$index}" text:bind="$index"></div>
         </Repeater>
      </div>

      Standard palette supports selectable hover, selection and disabled states.

      In some cases, it is hard to deduce a meaningful color scheme. The `ColorMap` utility widget might help in such situations.
      ColorMap assigns a different color to every chart element with the same `colorMap` attribute. At the same time, it will keep
      the maximum distance between used colors.

      **Examples**

      * [Line Charts](~/charts/line-graphs)
      * [Bar Charts](~/charts/bar-graphs)
      * [Column Charts](~/charts/column-graphs)
      * [Pie Charts](~/charts/pie-charts)
      * [Color Map](~/charts/color-map)

   </Md>
</cx>

