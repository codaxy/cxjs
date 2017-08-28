import {PureContainer} from 'cx/ui';

export class LineTracker extends PureContainer {
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
         let onCollect = this.onCollect && instance.getCallback("onCollect");
         let accumulator = {};
         instance.resetAccumulator = () => {
            accumulator = {};
            if (this.onPrepareAccumulator)
               instance.invoke('onPrepareAccumulator', accumulator, instance);
         };

         instance.lineTracker = (x, y, name) => {
            onCollect(accumulator, x, y, name);
            if (lineTracker)
               lineTracker(x, y, name);
         };

         instance.write = () => {
            if (this.onWrite)
               instance.invoke('onWrite', accumulator, instance);
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
