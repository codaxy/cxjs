import { PointReducer } from "./PointReducer";

export class SnapPointFinder extends PointReducer {
   declareData() {
      return super.declareData(...arguments, {
         cursorX: undefined,
         cursorY: undefined,
         snapX: undefined,
         snapY: undefined,
         snapRecord: undefined,
         maxDistance: undefined,
      });
   }

   onInitAccumulator(acc, { data }) {
      acc.cursorX = this.convertX(data.cursorX);
      acc.cursorY = this.convertY(data.cursorY);
      acc.dist = data.maxDistance > 0 ? Math.pow(data.maxDistance, 2) : Number.POSITIVE_INFINITY;
      acc.snapX = null;
      acc.snapY = null;
   }

   onMap(acc, x, y, name, p) {
      let d = null;
      let cx = this.convertX(x);
      let cy = this.convertY(y);

      if (acc.cursorX != null && cx != null) d = (d || 0) + Math.pow(Math.abs(cx - acc.cursorX), 2);

      if (acc.cursorY != null && cy != null) d = (d || 0) + Math.pow(Math.abs(cy - acc.cursorY), 2);

      if (d != null && d < acc.dist) {
         acc.dist = d;
         acc.snapX = x;
         acc.snapY = y;
         acc.snapRecord = p;
      }
   }

   onReduce(acc, instance) {
      instance.set("snapX", acc.snapX);
      instance.set("snapY", acc.snapY);
      instance.set("snapRecord", acc.snapRecord);
   }
}

SnapPointFinder.prototype.maxDistance = 50;
SnapPointFinder.prototype.convertX = (x) => x;
SnapPointFinder.prototype.convertY = (y) => y;
