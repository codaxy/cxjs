import { PointReducer } from "./PointReducer";

export class ValueAtFinder extends PointReducer {
   declareData() {
      return super.declareData(...arguments, {
         at: undefined,
         value: undefined,
      });
   }

   onInitAccumulator(acc, { data }) {
      acc.at = this.convert(data.at);
   }

   onMap(acc, x, y, name) {
      let cx = this.convert(x);
      let d = cx - acc.at;
      if (d <= 0 && (!acc.left || acc.left.d < d)) {
         acc.left = {
            x: cx,
            y,
            d,
         };
      }
      if (d >= 0 && (!acc.right || acc.right.d > d)) {
         acc.right = {
            x: cx,
            y,
            d,
         };
      }
   }

   onReduce(acc, instance) {
      let y = null;
      if (acc.left && acc.right) {
         if (acc.left.x == acc.right.x) y = acc.left.y;
         else if (acc.left.y != null && acc.right.y != null) {
            y = acc.left.y + ((acc.right.y - acc.left.y) * (acc.at - acc.left.x)) / (acc.right.x - acc.left.x);
         }
      }
      instance.set("value", y);
   }
}

ValueAtFinder.prototype.convert = (x) => x;
