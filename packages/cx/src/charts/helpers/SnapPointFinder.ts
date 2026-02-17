import { PointReducer, PointReducerConfig, PointReducerInstance, PointReducerAccumulator } from "./PointReducer";
import { RenderingContext } from "../../ui/RenderingContext";
import { NumberProp, Bind, Prop, DataRecord } from "../../ui/Prop";
import { AccessorChain } from "../../data/createAccessorModelProxy";

export interface SnapAccumulator extends PointReducerAccumulator {
   cursor: {
      x: number | null;
      y: number | null;
      mapped: boolean;
      mappedX?: number | null;
      mappedY?: number | null;
   };
   dist: number;
   snapX: any;
   snapY: any;
   snapRecord?: any;
   xAxis: any;
   yAxis: any;
}

export interface SnapPointFinderInstance extends PointReducerInstance<SnapAccumulator> {
   xAxis?: any;
   yAxis?: any;
}

export interface SnapPointFinderConfig extends PointReducerConfig {
   /** Cursor X value. */
   cursorX?: NumberProp;

   /** Cursor Y value */
   cursorY?: NumberProp;

   /** A binding used to receive the x value of the nearest point.*/
   snapX?: Bind | AccessorChain<number | null | undefined> | AccessorChain<string | null | undefined>;

   /** A binding used to receive the y value of the nearest point. */
   snapY?: Bind | AccessorChain<number | null | undefined> | AccessorChain<string | null | undefined>;

   /** A binding used to receive the record prop */
   snapRecord?: Prop<DataRecord>;

   /** Maximum distance between cursor and the snap point. Default value is 50. Adjust accordingly for large distances, e.g. set to Infinity when using TimeAxis */
   maxDistance?: number;

   /** A function used to convert x values into numeric format. Commonly used with dates. */
   convertX?: (value: number | string) => number;

   /** A function used to convert y values into numeric format. Commonly used with dates. */
   convertY?: (value: number | string) => number;

   /** Name of the x-axis. Default is 'x'. */
   xAxis?: string;

   /** Name of the y-axis. Default is 'y'. */
   yAxis?: string;
}

export class SnapPointFinder extends PointReducer<SnapAccumulator> {
   declare maxDistance: number;
   declare convertX: (value: any) => number;
   declare convertY: (value: any) => number;
   declare xAxis: string;
   declare yAxis: string;

   constructor(config?: SnapPointFinderConfig) {
      super(config);
   }

   declareData(...args: any[]) {
      super.declareData(...args, {
         cursorX: undefined,
         cursorY: undefined,
         snapX: undefined,
         snapY: undefined,
         snapRecord: undefined,
         maxDistance: undefined,
      });
   }

   explore(context: RenderingContext, instance: SnapPointFinderInstance) {
      instance.xAxis = (context.axes as any)?.[this.xAxis];
      instance.yAxis = (context.axes as any)?.[this.yAxis];
      super.explore(context, instance);
   }

   onInitAccumulator = (acc: SnapAccumulator, { data, xAxis, yAxis }: SnapPointFinderInstance) => {
      const d = data as any;
      acc.cursor = {
         x: d.cursorX,
         y: d.cursorY,
         mapped: false,
      };
      acc.dist = d.maxDistance > 0 ? Math.pow(d.maxDistance, 2) : Number.POSITIVE_INFINITY;
      acc.snapX = null;
      acc.snapY = null;
      acc.xAxis = xAxis;
      acc.yAxis = yAxis;
   };

   onMap = (acc: SnapAccumulator, x: any, y: any, name: string, p: any) => {
      let { xAxis, yAxis, cursor } = acc;

      if (!cursor.mapped) {
         cursor.mappedX = cursor.x != null ? xAxis?.map(this.convertX(cursor.x)) : null;
         cursor.mappedY = cursor.y != null ? yAxis?.map(this.convertY(cursor.y)) : null;
         cursor.mapped = true;
      }

      let d: number | null = null;
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
   };

   onReduce = (acc: SnapAccumulator, instance: PointReducerInstance<SnapAccumulator>) => {
      instance.set("snapX", acc.snapX);
      instance.set("snapY", acc.snapY);
      instance.set("snapRecord", acc.snapRecord);
   };
}

SnapPointFinder.prototype.maxDistance = 50;
SnapPointFinder.prototype.convertX = (x) => x;
SnapPointFinder.prototype.convertY = (y) => y;
SnapPointFinder.prototype.xAxis = "x";
SnapPointFinder.prototype.yAxis = "y";
