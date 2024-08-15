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

   explore(context, instance) {
      instance.xAxis = context.axes[this.xAxis];
      instance.yAxis = context.axes[this.yAxis];
      super.explore(context, instance);
   }

   onInitAccumulator(acc, { data, xAxis, yAxis }) {
      acc.cursorX = data.cursorX != null ? xAxis?.map(this.convertX(data.cursorX)) : null;
      acc.cursorY = data.cursorY != null ? yAxis?.map(this.convertY(data.cursorY)) : null;
      acc.dist = data.maxDistance > 0 ? Math.pow(data.maxDistance, 2) : Number.POSITIVE_INFINITY;
      acc.snapX = null;
      acc.snapY = null;
      acc.xAxis = xAxis;
      acc.yAxis = yAxis;
   }

   onMap(acc, x, y, name, p) {
      let { xAxis, yAxis } = acc;

      let d = null;
      let cx = x != null ? xAxis?.map(this.convertX(x)) : null;
      let cy = y != null ? yAxis?.map(this.convertY(y)) : null;

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
SnapPointFinder.prototype.xAxis = "x";
SnapPointFinder.prototype.yAxis = "y";
