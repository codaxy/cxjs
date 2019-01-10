import {Widget, VDOM, getContent} from '../ui/Widget';
import {BoundedObject} from '../svg/BoundedObject';
import {Axis} from './axis/Axis';

export class Chart extends BoundedObject {

   init() {
      super.init();

      if (!this.axes)
         this.axes = {};

      for (var axis in this.axes) {
         this.axes[axis] = Axis.create(this.axes[axis]);
      }
   }

   explore(context, instance) {

      var calculators = { ...context.axes };

      context.push('axes', calculators);

      super.explore(context, instance);

      instance.axes = {};

      //because tree exploration uses depth-first search using a stack,
      //axes need to be registered last in order to be processed first
      for (var axis in this.axes) {
         var axisInstance = instance.getChild(context, this.axes[axis]);
         if (axisInstance.scheduleExploreIfVisible(context)) {
            instance.axes[axis] = axisInstance;
            calculators[axis] = this.axes[axis].report(context, axisInstance);
         }
      }

      instance.calculators = calculators;
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
      var axes = [];
      for (var k in instance.axes) {
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

