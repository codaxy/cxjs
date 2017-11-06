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

   initInstance(context, instance) {
      super.initInstance(context, instance);
      instance.axes = {};
      for (var axis in this.axes) {
         instance.axes[axis] = instance.getChild(context, this.axes[axis]);
      }
   }

   explore(context, instance) {

      var axes = { ...context.axes };

      for (var axis in this.axes) {
         var axisInstance = instance.axes[axis];
         axisInstance.scheduleExploreIfVisible(context);
         axes[axis] = this.axes[axis].report(context, axisInstance);
      }

      context.push('axes', axes);

      super.explore(context, instance);
   }

   exploreCleanup(context, instance) {
      context.pop('axes');
   }

   prepare(context, instance) {
      var axes = {...context.axes};

      for (var axis in this.axes) {
         axes[axis] = this.axes[axis].report(context, instance.axes[axis]);
      }

      context.push('axes', axes);
   }

   prepareCleanup(context, instance) {
      context.pop('axes', axes);
   }



   render(context, instance, key) {
      var axes = [];
      for (var k in instance.axes) {
         axes.push(getContent(instance.axes[k].render(context, key+"-axis-"+k)));
      }

      return [
         axes,
         this.renderChildren(context, instance, key)
      ];
   }
}

Chart.prototype.anchors = '0 1 1 0';
Chart.prototype.styled = true;

Widget.alias('chart', Chart);

