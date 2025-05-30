import { PureContainer } from "../../ui/PureContainer";

export class PointReducer extends PureContainer {
   declareData() {
      super.declareData(...arguments, {
         filterParams: {
            structured: true,
         },
      });
   }

   prepareData(context, instance) {
      super.prepareData(context, instance);

      instance.resetAccumulator = () => {
         let accumulator = {};
         if (this.onInitAccumulator) {
            instance.invoke("onInitAccumulator", accumulator, instance);
            instance.accumulator = accumulator;
         }
      };

      if (this.onCreatePointFilter)
         instance.pointFilter = instance.invoke("onCreatePointFilter", instance.data.filterParams, instance);
   }

   explore(context, instance) {
      instance.resetAccumulator();

      let parentPointReducer = context.pointReducer;
      instance.parentPointTracker = parentPointReducer;

      let pointFilter = instance.pointFilter;
      let accumulator = instance.accumulator;
      let onMap = this.onMap && instance.getCallback("onMap");
      instance.pointReducer = (x, y, name, data, array, index) => {
         if (!pointFilter || pointFilter(x, y, name, data, array, index))
            onMap(accumulator, x, y, name, data, array, index);
         if (parentPointReducer) parentPointReducer(x, y, name, data, array, index);
      };
      instance.write = () => {
         if (this.onReduce) instance.invoke("onReduce", accumulator, instance);
      };

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
