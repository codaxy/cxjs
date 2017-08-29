import {PointReducer} from "./PointReducer";

export class MinMaxFinder extends PointReducer {
   declareData() {
      return super.declareData(...arguments, {
         minX: undefined,
         minY: undefined,
         maxX: undefined,
         maxY: undefined,
         params: {
            structured: true
         }
      })
   }

   onInitAccumulator(acc, {data}) {
      acc.params = data.params;
      acc.min = {x: null, y: null};
      acc.max = {x: null, y: null};
   }

   onMap(acc, x, y, name) {
      if (y != null && (acc.max.y == null || acc.max.y < y))
         acc.max = {x, y};

      if (y != null && (acc.min.y == null || acc.min.y > y))
         acc.min = {x, y};
   }

   onReduce(acc, instance) {
      instance.set('minX', acc.min.x);
      instance.set('minY', acc.min.y);
      instance.set('maxX', acc.max.x);
      instance.set('maxY', acc.max.y);
   }
}