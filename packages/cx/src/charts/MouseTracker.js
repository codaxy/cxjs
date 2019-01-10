import {BoundedObject} from "../svg/BoundedObject";
import {VDOM} from '../ui/VDOM';
import {tooltipMouseMove, tooltipMouseLeave} from '../widgets/overlay/tooltip-ops';
import {closest} from '../util/DOM';
import {getTopLevelBoundingClientRect} from "../util/getTopLevelBoundingClientRect";

export class MouseTracker extends BoundedObject {
   declareData() {
      return super.declareData(...arguments, {
         x: undefined,
         y: undefined
      });
   }

   explore(context, instance) {
      instance.xAxis = context.axes[this.xAxis];
      instance.yAxis = context.axes[this.yAxis];
      super.explore(context, instance);
   }

   render(context, instance, key) {
      let {data} = instance;
      let {bounds} = data;
      if (!bounds.valid())
         return null;

      return (
         <g
            key={key}
            className={data.classNames}
            onMouseMove={e => {
               this.handleMouseMove(e, instance)
            }}
            onMouseLeave={e => {
               this.handleMouseLeave(e, instance)
            }}
         >
            <rect
               x={bounds.l}
               y={bounds.t}
               width={bounds.width()}
               height={bounds.height()}
               fill="transparent"
               strokeWidth="0"
            />
            {this.renderChildren(context, instance)}
         </g>
      )
   }

   handleMouseMove(e, instance) {
      let {xAxis, yAxis} = instance;
      let svgEl = closest(e.target, el => el.tagName == 'svg');
      let bounds = getTopLevelBoundingClientRect(svgEl);

      if (xAxis)
         instance.set('x', xAxis.trackValue(e.clientX - bounds.left));

      if (yAxis)
         instance.set('y', yAxis.trackValue(e.clientY - bounds.top));

      tooltipMouseMove(e, instance, instance.widget.tooltip);
   }

   handleMouseLeave(e, instance) {
      let {xAxis, yAxis} = instance;

      tooltipMouseLeave(e, instance, instance.widget.tooltip);

      if (xAxis)
         instance.set('x', null);

      if (yAxis)
         instance.set('y', null);
   }
}

MouseTracker.prototype.xAxis = 'x';
MouseTracker.prototype.yAxis = 'y';
MouseTracker.prototype.anchors = '0 1 1 0';
MouseTracker.prototype.baseClass = "mousetracker";