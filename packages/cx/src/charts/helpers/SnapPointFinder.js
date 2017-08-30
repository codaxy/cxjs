import {PointReducer} from "./PointReducer";

export class SnapPointFinder extends PointReducer {
   declareData() {
      return super.declareData(...arguments, {
         cursorX: undefined,
         cursorY: undefined,
         snapX: undefined,
         snapY: undefined,
         snapRecord: undefined,
         maxDistance: undefined
      })
   }

   onInitAccumulator(acc, {data}) {
      acc.cursorX = data.cursorX;
      acc.cursorY = data.cursorY;
      acc.dist = data.maxDistance > 0 ? Math.pow(data.maxDistance, 2) : Number.POSITIVE_INFINITY;
      acc.snapX = null;
      acc.snapY = null;
   }

   onMap(acc, x, y, name, p) {
      let d = null;

      if (acc.cursorX != null && x != null)
         d = (d || 0) + Math.pow(Math.abs(x - acc.cursorX), 2);

      if (acc.cursorY != null && y != null)
         d = (d || 0) + Math.pow(Math.abs(y - acc.cursorY), 2);

      if (d != null && d < acc.dist) {
         acc.dist = d;
         acc.snapX = x;
         acc.snapY = y;
         acc.snapRecord = p;
      }
   }

   onReduce(acc, instance) {
      instance.set('snapX', acc.snapX);
      instance.set('snapY', acc.snapY);
      instance.set('snapRecord', acc.snapRecord);
   }
}

SnapPointFinder.prototype.maxDistance = 50;