import { PureContainer } from "../../ui/PureContainer";

export class PointReducer extends PureContainer {
   explore(context, instance) {
      let parentPointReducer = context.pointReducer;
      instance.parentPointTracker = parentPointReducer;

      if (!instance.pointReducer) {
         let onMap = this.onMap && instance.getCallback("onMap");
         let accumulator = {};
         instance.resetAccumulator = () => {
            accumulator = {};
            if (this.onInitAccumulator) instance.invoke("onInitAccumulator", accumulator, instance);
         };

         let pointFilter = null;
         if (this.onCreatePointFilter) pointFilter = instance.invoke("onCreatePointFilter", instance);

         instance.pointReducer = (x, y, name, data, array, index) => {
            if (!pointFilter || pointFilter(x, y, name, data, array, index))
               onMap(accumulator, x, y, name, data, array, index);
            if (parentPointReducer) parentPointReducer(x, y, name, data, array, index);
         };
         instance.write = () => {
            if (this.onReduce) instance.invoke("onReduce", accumulator, instance);
         };
      }

      instance.resetAccumulator();
      context.push("pointReducer", instance.pointReducer);

      super.explore(context, instance);
   }

   exploreCleanup(context, instance) {
      context.pop("pointReducer");
   }

   prepare(context, instance) {
      context.push("pointReducer", instance.pointReducer);
   }

   prepareCleanup(context, instance) {
      context.pop("pointReducer");
      instance.write();
   }
}
