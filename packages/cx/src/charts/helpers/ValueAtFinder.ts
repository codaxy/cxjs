import { PointReducer, PointReducerConfig, PointReducerInstance, PointReducerAccumulator } from "./PointReducer";
import { NumberProp, StringProp, Bind } from "../../ui/Prop";
import { AccessorChain } from "../../data/createAccessorModelProxy";

export interface ValueAtAccumulator extends PointReducerAccumulator {
   at: number;
   left?: { x: number; y: number; d: number };
   right?: { x: number; y: number; d: number };
}

export interface ValueAtFinderConfig extends PointReducerConfig {
   /** X axis probe value. */
   at?: NumberProp | StringProp;

   /** A binding used to receive the measured y axis value */
   value?: Bind | AccessorChain<number>;

   /** A function used to convert x values into numeric format. Commonly used with dates. */
   convert?: (value: number | string) => number;
}

/** Calculate value at a given point on the graph */
export class ValueAtFinder extends PointReducer<ValueAtAccumulator> {
   declare convert: (value: any) => number;

   constructor(config?: ValueAtFinderConfig) {
      super(config);
   }

   declareData(...args: any[]) {
      super.declareData(...args, {
         at: undefined,
         value: undefined,
      });
   }

   onInitAccumulator = (acc: ValueAtAccumulator, { data }: PointReducerInstance<ValueAtAccumulator>) => {
      acc.at = this.convert((data as any).at);
   };

   onMap = (acc: ValueAtAccumulator, x: any, y: any, name: string) => {
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
   };

   onReduce = (acc: ValueAtAccumulator, instance: PointReducerInstance<ValueAtAccumulator>) => {
      let y: number | null = null;
      if (acc.left && acc.right) {
         if (acc.left.x == acc.right.x) y = acc.left.y;
         else if (acc.left.y != null && acc.right.y != null) {
            y = acc.left.y + ((acc.right.y - acc.left.y) * (acc.at - acc.left.x)) / (acc.right.x - acc.left.x);
         }
      }
      instance.set("value", y);
   };
}

ValueAtFinder.prototype.convert = (x) => x;
