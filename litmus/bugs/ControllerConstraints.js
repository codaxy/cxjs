import { Button, HtmlElement, TextField } from "cx/widgets";
import { Rect, Rectangle, Svg, Text } from "cx/svg";
import {
   Chart,
   Gridlines,
   Marker,
   MarkerLine,
   NumericAxis,
   Range
} from "cx/charts";
import { Controller, LabelsLeftLayout } from "cx/ui";

class DemoController extends Controller {
   onInit() {
      this.onShuffle();

      this.addComputable("d", [ "x", "y" ], (x, y) => Math.sqrt(x * x + y * y));

      this.addTrigger("constrain", [ "x", "y" ], (x, y) => {
         if (x > 100) this.store.set("x", 100);
         if (y > 100) this.store.set("y", 100);
         if (x < -100) this.store.set("x", -100);
         if (y < -100) this.store.set("y", -100);
      });
   }

   onShuffle() {
      this.store.set("x", Math.random() * 200 - 100);
      this.store.set("y", Math.random() * 200 - 100);
   }
}

export default (
   <cx>
      <div controller={DemoController}>
         <Svg style="width:500px;height:500px">
            <Chart
               axes={
                  {
                     x: { type: NumericAxis, min: -150, max: 150 },
                     y: { type: NumericAxis, min: -150, max: 150, vertical: true }
                  }
               }
               margin={50}
            >
               <Gridlines />
               <Range colorIndex={5} x1={-100} x2={100} y1={-100} y2={100} />
               <MarkerLine x1={0} y1={0} x2:bind="x" y2:bind="y">
                  <Rectangle
                     anchors="0.5 0.5 0.5 0.5"
                     margin="-10 -20 -10 -20"
                     style="fill: rgba(255, 255, 255, 0.5)"
                  >
                     <Text tpl="{d:n;1}" ta="middle" dy="0.35em" />
                  </Rectangle>
               </MarkerLine>
               <Marker
                  x:bind="x"
                  y:bind="y"
                  colorIndex={3}
                  draggable
                  size={20}
                  constrain
               />
            </Chart>
         </Svg>
         <Button onClick="onShuffle">Shuffle</Button>
      </div>
   </cx>
);
