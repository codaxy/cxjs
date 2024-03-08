import { BoundedObject } from "../svg/BoundedObject";
import { VDOM } from "../ui/Widget";

export class Swimlanes extends BoundedObject {
   explore(context, instance) {
      super.explore(context, instance);
      instance.xAxis = context.axes[this.xAxis];
      instance.yAxis = context.axes[this.yAxis];
   }

   prepare(context, instance) {
      super.prepare(context, instance);
      let { xAxis, yAxis } = instance;
      if ((xAxis && xAxis.shouldUpdate) || (yAxis && yAxis.shouldUpdate)) instance.markShouldUpdate(context);
   }

   renderLines(xAxis, yAxis, bounds) {
      let rects = [];
      if (yAxis) {
         let yTicks = yAxis.mapGridlines();
         yTicks.forEach((y, i) => {
            if (i % 2 != 0) {
               rects.push(
                  <rect
                     key={`swimlane_${y}`}
                     x={bounds.l}
                     y={y}
                     // fill="#f4f4f4"
                     width={bounds.r - bounds.l}
                     height={5}
                  />,
               );
            }
         });
      }

      // if (xAxis) {
      //    let xTicks = xAxis.mapGridlines();
      //    xTicks.forEach((x, i) => {
      //       if (i % 2 == 0) {
      //          rects.push(<rect key={`swimlane_${x}`} x={x} y={bounds.t} width={10} height={bounds.b} />);
      //       }
      //    });
      // }

      return rects;
   }

   render(context, instance, key) {
      let { data, xAxis, yAxis } = instance;
      let { bounds } = data;

      return (
         <g key={key} className={data.classNames}>
            {/* {children} */}
            {this.renderLines(xAxis, yAxis, bounds)}
         </g>
      );
   }
}

Swimlanes.prototype.xAxis = "x";
Swimlanes.prototype.yAxis = "y";
Swimlanes.prototype.anchors = "0 1 1 0";
Swimlanes.prototype.baseClass = "swimlanes";

BoundedObject.alias("swimlanes", Swimlanes);
