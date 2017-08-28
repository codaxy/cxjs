import {LineTracker} from "./LineTracker";

export class PointSnapTracker extends LineTracker {
   declareData() {
      return super.declareData(...arguments, {
         targetX: undefined,
         targetY: undefined,
         x: undefined,
         y: undefined
      })
   }

   onPrepareAccumulator(acc, {data}) {
      acc.targetX = data.targetX;
      acc.targetY = data.targetY;
      acc.distX = Number.POSITIVE_INFINITY;
      acc.resultX = null;
      acc.resultY = null;
   }

   onCollect(acc, x, y, name) {
      if (acc.targetX != null && x != null) {
         let d = Math.abs(x - acc.targetX);
         if (d < acc.distX) {
            acc.distX = d;
            acc.resultX = x;
         }
      }
   }

   onWrite(acc, instance) {
      instance.set('x', acc.resultX);
   }
}