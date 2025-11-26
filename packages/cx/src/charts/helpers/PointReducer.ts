import { PureContainerBase, PureContainerConfig } from "../../ui/PureContainer";
import { Instance } from "../../ui/Instance";
import { RenderingContext } from "../../ui/RenderingContext";
import { Record, StructuredProp } from "../../core";

export type PointReducerFunction = (
   x: any,
   y: any,
   name: string,
   data: any,
   array?: any[],
   index?: number
) => void;

export interface PointReducerAccumulator {
   [key: string]: any;
}

export interface PointReducerInstance<TAccumulator extends PointReducerAccumulator = PointReducerAccumulator>
   extends Instance {
   resetAccumulator: () => void;
   pointFilter?: (x: any, y: any, name: string, data: any, array?: any[], index?: number) => boolean;
   accumulator?: TAccumulator;
   parentPointTracker?: PointReducerFunction;
   pointReducer?: PointReducerFunction;
   write?: () => void;
}

export interface PointReducerConfig extends PureContainerConfig {
   /** A callback function used to initialize the accumulator. */
   onInitAccumulator?: string | ((accumulator: Record, instance?: Instance) => void);

   /** A callback function used to collect information about all data points. */
   onMap?:
      | string
      | ((accumulator: Record, x?: any, y?: any, name?: string, data?: any, array?: any[], index?: number) => void);

   /** A callback function used to process accumulated information and write results. */
   onReduce?: string | ((accumulator: Record, instance?: Instance) => void);

   /** Parameters that trigger filter predicate re-creation. */
   filterParams?: StructuredProp;

   /** A callback function used to create a predicate for filtering points. */
   onCreatePointFilter?:
      | string
      | ((
           filterParams: any,
           instance: Instance
        ) => (x: number, y: number, name: string, data: any, array?: any[], index?: number) => boolean);
}

export class PointReducer<
   TAccumulator extends PointReducerAccumulator = PointReducerAccumulator,
> extends PureContainerBase<PointReducerConfig, PointReducerInstance<TAccumulator>> {
   declare onCreatePointFilter?: PointReducerConfig["onCreatePointFilter"];
   // These can be either config properties (string/function) or overridden methods in subclasses
   declare onInitAccumulator?: (acc: TAccumulator, instance: PointReducerInstance<TAccumulator>) => void;
   declare onMap?: (
      acc: TAccumulator,
      x: any,
      y: any,
      name: string,
      data?: any,
      array?: any[],
      index?: number
   ) => void;
   declare onReduce?: (acc: TAccumulator, instance: PointReducerInstance<TAccumulator>) => void;

   constructor(config?: PointReducerConfig) {
      super(config);
   }

   declareData(...args: any[]) {
      super.declareData(...args, {
         filterParams: {
            structured: true,
         },
      });
   }

   prepareData(context: RenderingContext, instance: PointReducerInstance<TAccumulator>) {
      super.prepareData(context, instance);

      instance.resetAccumulator = () => {
         let accumulator = {} as TAccumulator;
         if (this.onInitAccumulator) {
            instance.invoke("onInitAccumulator", accumulator, instance);
            instance.accumulator = accumulator;
         }
      };

      if (this.onCreatePointFilter)
         instance.pointFilter = instance.invoke(
            "onCreatePointFilter",
            (instance.data as any).filterParams,
            instance
         ) as PointReducerInstance<TAccumulator>["pointFilter"];
   }

   explore(context: RenderingContext, instance: PointReducerInstance<TAccumulator>) {
      instance.resetAccumulator();

      let parentPointReducer = context.pointReducer as PointReducerFunction | undefined;
      instance.parentPointTracker = parentPointReducer;

      let pointFilter = instance.pointFilter;
      let accumulator = instance.accumulator;
      let onMap = this.onMap && instance.getCallback("onMap");
      instance.pointReducer = (x, y, name, data, array, index) => {
         if (!pointFilter || pointFilter(x, y, name, data, array, index))
            onMap?.(accumulator, x, y, name, data, array, index);
         if (parentPointReducer) parentPointReducer(x, y, name, data, array, index);
      };
      instance.write = () => {
         if (this.onReduce) instance.invoke("onReduce", accumulator, instance);
      };

      context.push("pointReducer", instance.pointReducer);
      super.explore(context, instance);
   }

   exploreCleanup(context: RenderingContext, instance: PointReducerInstance<TAccumulator>) {
      context.pop("pointReducer");
   }

   prepare(context: RenderingContext, instance: PointReducerInstance<TAccumulator>) {
      context.push("pointReducer", instance.pointReducer);
   }

   prepareCleanup(context: RenderingContext, instance: PointReducerInstance<TAccumulator>) {
      context.pop("pointReducer");
      instance.write?.();
   }
}
