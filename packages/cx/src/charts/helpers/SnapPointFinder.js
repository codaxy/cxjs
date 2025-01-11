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
      acc.cursor = {
         x: data.cursorX,
         y: data.cursorY,
         mapped: false,
      };
      acc.dist = data.maxDistance > 0 ? Math.pow(data.maxDistance, 2) : Number.POSITIVE_INFINITY;
      acc.snapX = null;
      acc.snapY = null;
      acc.xAxis = xAxis;
      acc.yAxis = yAxis;
   }

   onMap(acc, x, y, name, p) {
      let { xAxis, yAxis, cursor } = acc;

      if (!cursor.mapped) {
         cursor.mappedX = cursor.x != null ? xAxis?.map(this.convertX(cursor.x)) : null;
         cursor.mappedY = cursor.y != null ? yAxis?.map(this.convertY(cursor.y)) : null;
         cursor.mapped = true;
      }

      let d = null;
      let cx = x != null ? xAxis?.map(this.convertX(x)) : null;
      let cy = y != null ? yAxis?.map(this.convertY(y)) : null;

      if (cursor.mappedX != null && cx != null) d = (d || 0) + Math.pow(Math.abs(cx - cursor.mappedX), 2);
      if (cursor.mappedY != null && cy != null) d = (d || 0) + Math.pow(Math.abs(cy - cursor.mappedY), 2);

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
