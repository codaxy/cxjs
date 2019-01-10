import * as Cx from '../../core';
import {Instance} from '../../ui/Instance';

interface PointReducerProps extends Cx.PureContainerProps {

   /** A callback function used to initialize the accumulator. */
   onInitAccumulator?: (accumulator: Cx.Record, instance?: Instance) => void;

   /** A callback function used to collect information about all data points. */
   onMap?: (accumulator: Cx.Record, x?: number, y?: number, name?: string) => void;

   /** A callback function used to process accumulated information and write results. */
   onReduce?: (accumulator: Cx.Record, instance?: Instance) => void;
}

export class PointReducer extends Cx.Widget<PointReducerProps> {}