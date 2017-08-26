import {BoundedObject} from "cx/svg";
import {VDOM} from 'cx/ui';
import {tooltipMouseMove, tooltipMouseLeave} from 'cx/widgets';

export class XYTracker extends BoundedObject {
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
      return <XYTrackerComponent
         key={key}
         instance={instance}
      >
         {this.renderChildren(context, instance)}
      </XYTrackerComponent>
   }
}

XYTracker.prototype.xAxis = 'x';
XYTracker.prototype.yAxis = 'y';
XYTracker.prototype.anchors = '0 1 1 0';

class XYTrackerComponent extends VDOM.Component {
   render() {
      let {bounds} = this.props.instance.data;
      if (!bounds.valid())
         return null;
      
      return (
         <g
            onMouseMove={::this.onMouseMove}
            onMouseLeave={::this.onMouseLeave}
         >
            <rect x={bounds.l} y={bounds.t} width={bounds.width()} height={bounds.height()} fill="transparent" />
            {this.props.children}
         </g>
      )
   }

   onMouseMove(e) {
      let {instance} = this.props;
      let {xAxis, yAxis} = instance;

      if (xAxis)
         instance.set('x', xAxis.trackValue(e.clientX));

      if (yAxis)
         instance.set('y', yAxis.trackValue(e.clientY));

      tooltipMouseMove(e, instance, instance.widget.tooltip);
   }

   onMouseLeave(e) {
      let {instance} = this.props;
      let {xAxis, yAxis} = instance;

      tooltipMouseLeave(e, instance, instance.widget.tooltip);

      if (xAxis)
         instance.set('x', null);

      if (yAxis)
         instance.set('y', null);
   }
}