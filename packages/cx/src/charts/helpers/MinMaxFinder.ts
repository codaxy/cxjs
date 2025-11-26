import { PointReducer, PointReducerConfig, PointReducerInstance, PointReducerAccumulator } from "./PointReducer";
import { Bind, AccessorChain, StructuredProp } from "../../core";

export interface MinMaxAccumulator extends PointReducerAccumulator {
   params: any;
   min: { x: any; y: any; p?: any };
   max: { x: any; y: any; p?: any };
}

export interface MinMaxFinderConfig extends PointReducerConfig {
   /** A binding used to receive the x value of the point with the minimum value */
   minX?: Bind | AccessorChain<number>;

   /** A binding used to receive the y value of the point with the minimum value */
   minY?: Bind | AccessorChain<number>;

   /** A binding used to receive the x value of the point with the maximum value */
   maxX?: Bind | AccessorChain<number>;

   /** A binding used to receive the y value of the point with the maximum value */
   maxY?: Bind | AccessorChain<number>;

   /** An object used for filtering data points. Available as accumulator.params inside the onMap function. */
   params?: StructuredProp;
}

/** Find minimum and maximum points of a point series */
export class MinMaxFinder extends PointReducer<MinMaxAccumulator> {
   constructor(config?: MinMaxFinderConfig) {
      super(config);
   }

   declareData(...args: any[]) {
      super.declareData(...args, {
         minX: undefined,
         minY: undefined,
         maxX: undefined,
         maxY: undefined,
         params: {
            structured: true,
         },
      });
   }

   onInitAccumulator = (acc: MinMaxAccumulator, { data }: PointReducerInstance<MinMaxAccumulator>) => {
      acc.params = (data as any).params;
      acc.min = { x: null, y: null };
      acc.max = { x: null, y: null };
   };

   onMap = (acc: MinMaxAccumulator, x: any, y: any, name: string, p: any) => {
      if (y != null && (acc.max.y == null || acc.max.y < y)) acc.max = { x, y, p };

      if (y != null && (acc.min.y == null || acc.min.y > y)) acc.min = { x, y, p };
   };

   onReduce = (acc: MinMaxAccumulator, instance: PointReducerInstance<MinMaxAccumulator>) => {
      instance.set("minX", acc.min.x);
      instance.set("minY", acc.min.y);
      instance.set("minRecord", acc.min.p);
      instance.set("maxX", acc.max.x);
      instance.set("maxY", acc.max.y);
      instance.set("maxRecord", acc.max.p);
   };
}
