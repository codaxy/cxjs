import {LineTracker} from "./LineTracker";

export class ValueAtTracker extends LineTracker {
   declareData() {
      return super.declareData(...arguments, {
         x: undefined,
         y: undefined
      })
   }

   onPrepareAccumulator(acc, {data}) {
      acc.x = data.x;
   }

   onCollect(acc, x, y, name) {
      let d = x - acc.x;
      if (d<=0 && (!acc.left || acc.left.d < d)) {
         acc.left = {
            x, y, d
         }
      }
      if (d>=0 && (!acc.right || acc.right.d > d)) {
         acc.right = {
            x, y, d
         }
      }
   }

   onWrite(acc, instance) {
      if (!acc.left || !acc.right)
         return;

      let y = null;
      if (acc.left.x == acc.right.x)
         y = acc.left.y;
      else if (acc.left.y != null && acc.right.y != null) {
         y = acc.left.y + (acc.right.y - acc.left.y) * (acc.x - acc.left.x) / (acc.right.x - acc.left.x);
      }

      instance.set('y', y);
   }
}