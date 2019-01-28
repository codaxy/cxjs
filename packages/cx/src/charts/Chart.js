import {Widget, VDOM, getContent} from '../ui/Widget';
import {BoundedObject} from '../svg/BoundedObject';
import {Axis} from './axis/Axis';

export class Chart extends BoundedObject {

   init() {
      super.init();

      if (!this.axes)
         this.axes = {};

      for (let axis in this.axes) {
         this.axes[axis] = Axis.create(this.axes[axis]);
      }
   }

   explore(context, instance) {

      instance.calculators = {...context.axes};

      context.push('axes', instance.calculators);
      instance.axes = {};

      //axes need to be registered before children to be processed first
      for (let axis in this.axes) {
         let axisInstance = instance.getChild(context, this.axes[axis]);
         if (axisInstance.scheduleExploreIfVisible(context)) {
            instance.axes[axis] = axisInstance;
            instance.calculators[axis] = this.axes[axis].report(context, axisInstance);
         }
      }

      super.explore(context, instance);
   }

   exploreCleanup(context, instance) {
      context.pop('axes');
   }

   prepare(context, instance) {
      context.push('axes', instance.calculators);
      super.prepare(context, instance);
   }

   prepareCleanup(context, instance) {
      context.pop('axes');
      super.prepareCleanup(context, instance);
   }

   render(context, instance, key) {
      let axes = [];
      for (let k in instance.axes) {
         axes.push(getContent(instance.axes[k].render(context, key+"-axis-"+k)));
      }

      return [
         axes,
         this.renderChildren(context, instance)
      ];
   }
}

Chart.prototype.anchors = '0 1 1 0';
Chart.prototype.styled = true;
Chart.prototype.isPureContainer = true;

Widget.alias('chart', Chart);

