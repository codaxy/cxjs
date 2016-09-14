import {Widget, VDOM, getContent} from '../../Widget';
import {BoundedObject} from '../BoundedObject';
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
      var axes = context.axes;
      super.explore(context, instance);
      context.axes = axes;
   }

   exploreHelpers(context, instance) {
      if (!context.axes)
         context.axes = {};
      for (var axis in this.axes) {
         var axisInstance = instance.axes[axis];
         axisInstance.explore(context);
         context.axes[axis] = this.axes[axis].report(context, axisInstance);
      }
      super.exploreHelpers(context, instance);
   }

   prepareHelpers(context, instance) {
      super.prepareHelpers(context, instance);
      for (var axis in this.axes) {
         instance.axes[axis].prepare(context);
      }
   }

   cleanupHelpers(context, instance) {
      super.cleanupHelpers(context, instance);
      for (var axis in this.axes) {
         instance.axes[axis].cleanup(context);
      }
   }

   declareData() {
      return super.declareData(...arguments, {
         class: undefined,
         className: undefined,
         style: undefined
      })
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

Widget.alias('chart', Chart);

