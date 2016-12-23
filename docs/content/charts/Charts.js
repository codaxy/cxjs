import { HtmlElement } from 'cx/widgets';
import { Svg, Rectangle } from 'cx/svg';
import { Chart, NumericAxis, Gridlines } from 'cx/charts';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from 'docs/components/ImportPath';



import configs from './configs/Chart';

export const Charts = <cx>
   <Md>
      # Charts

      <ImportPath path="import {Chart} from 'cx/charts';" />

      The `Chart` widget is used for defining axes and bounds for two-dimensional charts such as line, scatter, bar and column charts.

      <CodeSplit>

         <div class="widgets">
            <Svg style="width:300px;height:200px;border:1px solid #ddd" margin="10 20 30 50">
               <Chart axes={{
                  x: <NumericAxis />,
                  y: <NumericAxis vertical/>
               }}>
                  <Rectangle fill="white" />
                  <Gridlines />
               </Chart>
            </Svg>
         </div>

         <CodeSnippet putInto="code">{`
             <Svg style="width:300px;height:200px" margin="10 20 30 50">
               <Chart axes={{
                  x: <NumericAxis />,
                  y: <NumericAxis vertical/>
               }}>
                  <Rectangle fill="white" />
                  <Gridlines />
               </Chart>
            </Svg>
         `}</CodeSnippet>
      </CodeSplit>

      The most important part is axis configuration. Numeric, category and date axis types are supported.

      ## Configuration

      <ConfigTable props={configs} />

      ## Main Chart Elements Overview

      Main chart elements are:

      * `axes`
         - [NumericAxis](~/charts/numeric-axes) - Used for presenting numerical data.
         - [CategoryAxis](~/charts/category-axes) - Used for presenting finite data sets.

      * Graphs (series)
         - [LineGraph](~/charts/line-graphs) - Used for drawing a line graph out of a series of 2d points.
         - [BarGraph](~/charts/bar-graphs) - Used for drawing a series of bars.
         - [ColumnGraph](~/charts/column-graphs) - Used for drawing a series of columns.

      * Individual (repeatable) elements
         - [Column](~/charts/columns) - A single column (vertical bar) in column charts. Used when all columns are not the same. Otherwise use the `ColumnGraph` widget.
         - [Bar](~/charts/bars) - A single bar in bar charts. Used when all bars are not the same. Otherwise use the `BarGraph` widget.
         - [Marker](~/charts/markers) - A marker. Used for scatter charts and other charts for point markers. Supports dragging.
         - [MarkerLine](~/charts/marker-lines) - A marker line. Used for highlighting certain values, e.g. min or max value.
         - [Ranges](~/charts/ranges) - Draw rectangular areas on the chart - zones.

      * SVG elements:
         - [Rectangle](~/svg/rectangles) - Used for drawing a rectangle.
         - [Line](~/svg/lines) - Used for drawing a line.

   </Md>
</cx>;

