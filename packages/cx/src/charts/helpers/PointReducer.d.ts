import * as Cx from "../../core";
import { Instance } from "../../ui/Instance";

export interface PointReducerProps extends Cx.PureContainerProps {
   /** A callback function used to initialize the accumulator. */
   onInitAccumulator?: (accumulator: Cx.Record, instance?: Instance) => void;

   /** A callback function used to collect information about all data points. */
   onMap?: (accumulator: Cx.Record, x?: number, y?: number, name?: string) => void;

   /** A callback function used to process accumulated information and write results. */
   onReduce?: (accumulator: Cx.Record, instance?: Instance) => void;

   /** Parameters that trigger filter predicate re-creation. */
   filterParams?: StructuredProp;

   /** A callback function used to create a predicate for filtering points. */
   onCreatePointFilter?: (
      filterParams: any,
      instance: Instance,
   ) => (x: number, y: number, name: string, data: any, array?: any[], index?: number) => boolean;
}

export class PointReducer extends Cx.Widget<PointReducerProps> {}
