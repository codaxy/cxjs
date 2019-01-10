import {PureContainer} from '../../ui/PureContainer';

export class PointReducer extends PureContainer {
   explore(context, instance) {
      let pointReducer = context.pointReducer;
      instance.parentPointTracker = pointReducer;

      if (!instance.pointReducer) {
         let onMap = this.onMap && instance.getCallback("onMap");
         let accumulator = {};
         instance.resetAccumulator = () => {
            accumulator = {};
            if (this.onInitAccumulator)
               instance.invoke('onInitAccumulator', accumulator, instance);
         };

         instance.pointReducer = (x, y, name, data, array, index) => {
            onMap(accumulator, x, y, name, data, array, index);
            if (pointReducer)
               pointReducer(x, y, name, data, array, index);
         };

         instance.write = () => {
            if (this.onReduce)
               instance.invoke('onReduce', accumulator, instance);
         }
      }

      instance.resetAccumulator();
      context.push('pointReducer', instance.pointReducer);

      super.explore(context, instance);
   }

   exploreCleanup(context, instance) {
      instance.write();
      context.pop('pointReducer');
   }
}
