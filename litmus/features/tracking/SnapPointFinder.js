import {PointReducer} from "./PointReducer";

export class SnapPointFinder extends PointReducer {
   declareData() {
      return super.declareData(...arguments, {
         targetX: undefined,
         targetY: undefined,
         snapX: undefined,
         snapY: undefined
      })
   }

   onInitAccumulator(acc, {data}) {
      acc.targetX = data.targetX;
      acc.targetY = data.targetY;
      acc.distX = Number.POSITIVE_INFINITY;
      acc.distY = Number.POSITIVE_INFINITY;
      acc.resultX = null;
      acc.resultY = null;
   }

   onMap(acc, x, y, name) {
      if (acc.targetX != null && x != null) {
         let d = Math.abs(x - acc.targetX);
         if (d < acc.distX) {
            acc.distX = d;
            acc.resultX = x;
         }
      }

      if (acc.targetY != null && y != null) {
         let d = Math.abs(x - acc.targetY);
         if (d < acc.distY) {
            acc.distY = d;
            acc.resultY = y;
         }
      }
   }

   onReduce(acc, instance) {
      instance.set('snapX', acc.resultX);
      instance.set('snapY', acc.resultY);
   }
}