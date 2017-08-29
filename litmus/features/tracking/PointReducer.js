import {PureContainer} from 'cx/ui';

export class PointReducer extends PureContainer {
   declareData() {
      return super.declareData(...arguments, {
         x: undefined,
         y: undefined
      });
   }

   explore(context, instance) {
      let lineTracker = context.lineTracker;
      instance.parentLineTracker = lineTracker;

      if (!instance.lineTracker) {
         let onMap = this.onMap && instance.getCallback("onMap");
         let accumulator = {};
         instance.resetAccumulator = () => {
            accumulator = {};
            if (this.onInitAccumulator)
               instance.invoke('onInitAccumulator', accumulator, instance);
         };

         instance.lineTracker = (x, y, name) => {
            onMap(accumulator, x, y, name);
            if (lineTracker)
               lineTracker(x, y, name);
         };

         instance.write = () => {
            if (this.onReduce)
               instance.invoke('onReduce', accumulator, instance);
         }
      }

      instance.resetAccumulator();
      context.lineTracker = instance.lineTracker;

      super.explore(context, instance);
      context.lineTracker = lineTracker;
      instance.write();
   }

   // prepare(context, instance) {
   //    let lineTracker = context.lineTracker;
   //    super.prepare(context, instance);
   //
   //    context.lineTracker = lineTracker;
   // }
}
