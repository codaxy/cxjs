import {PointReducer} from "./PointReducer";

export class SnapPointFinder extends PointReducer {
   declareData() {
      return super.declareData(...arguments, {
         cursorX: undefined,
         cursorY: undefined,
         snapX: undefined,
         snapY: undefined
      })
   }

   onInitAccumulator(acc, {data}) {
      acc.cursorX = data.cursorX;
      acc.cursorY = data.cursorY;
      acc.distX = Number.POSITIVE_INFINITY;
      acc.distY = Number.POSITIVE_INFINITY;
      acc.snapX = null;
      acc.snapY = null;
   }

   onMap(acc, x, y, name) {
      if (acc.cursorX != null && x != null) {
         let d = Math.abs(x - acc.cursorX);
         if (d < acc.distX) {
            acc.distX = d;
            acc.snapX = x;
         }
      }

      if (acc.cursorY != null && y != null) {
         let d = Math.abs(x - acc.cursorY);
         if (d < acc.distY) {
            acc.distY = d;
            acc.snapY = y;
         }
      }
   }

   onReduce(acc, instance) {
      instance.set('snapX', acc.snapX);
      instance.set('snapY', acc.snapY);
   }
}