/** @jsxImportSource react */

import { Axis, AxisConfig, AxisInstance } from "./Axis";
import { VDOM } from "../../ui/Widget";
import { NumericScale } from "./NumericScale";
import { Format } from "../../util/Format";
import { RenderingContext } from "../../ui/RenderingContext";
import { NumberProp, BooleanProp, StringProp } from "../../ui/Prop";

export interface NumericAxisConfig extends AxisConfig {
   /** Minimum value. */
   min?: NumberProp;

   /** Maximum value. */
   max?: NumberProp;

   /** Set to `true` to normalize the input range. */
   normalized?: BooleanProp;

   /** Number used to divide values before rendering axis labels. Default value is `1`. */
   labelDivisor?: NumberProp;

   /** Base CSS class to be applied to the element. Defaults to `numericaxis`. */
   baseClass?: string;

   tickDivisions?: Array<number[]>;

   /** A number ranged between `0-2`. `0` means that the range is aligned with the lowest ticks. Default value is `1`, which means that the range is aligned with medium ticks. Use value `2` to align with major ticks. */
   snapToTicks?: 0 | 1 | 2;

   /** Value format. Default is `n`. */
   format?: StringProp;

   /** Size of a zone reserved for labels for both lower and upper end of the axis. */
   deadZone?: NumberProp;

   /** Size of a zone reserved for labels near the upper (higher) end of the axis.  */
   upperDeadZone?: NumberProp;

   /** Size of a zone reserved for labels near the lower end of the axis.   */
   lowerDeadZone?: NumberProp;

   /** Specifies minimum value increment between labels. Useful when formatting is not flexible enough, i.e. set to 1 for integer axes to avoid duplicate labels. */
   minLabelTickSize?: number;

   minTickStep?: number;
}

export class NumericAxis extends Axis {
   declare deadZone: number;
   declare lowerDeadZone: number;
   declare upperDeadZone: number;
   declare snapToTicks: number;
   declare tickDivisions: number[][];
   declare minLabelTickSize: number;
   declare minTickStep: number;
   declare format: string;
   declare labelDivisor: number;
   declare normalized: boolean;

   constructor(config: NumericAxisConfig) {
      super(config);
   }

   init(): void {
      if (this.deadZone) {
         this.lowerDeadZone = this.deadZone;
         this.upperDeadZone = this.deadZone;
      }
      super.init();
   }

   declareData(...args: any[]): void {
      super.declareData(
         {
            min: undefined,
            max: undefined,
            normalized: undefined,
            inverted: undefined,
            labelDivisor: undefined,
            format: undefined,
            lowerDeadZone: undefined,
            upperDeadZone: undefined,
         },
         ...args,
      );
   }

   initInstance(context: RenderingContext, instance: AxisInstance): void {
      instance.calculator = new NumericScale();
   }

   explore(context: RenderingContext, instance: AxisInstance): void {
      super.explore(context, instance);
      let { min, max, normalized, inverted, lowerDeadZone, upperDeadZone } = instance.data;
      instance.calculator.reset(
         min,
         max,
         this.snapToTicks,
         this.tickDivisions,
         this.minTickDistance,
         this.minTickStep,
         this.minLabelDistance,
         this.minLabelTickSize,
         normalized,
         inverted,
         lowerDeadZone,
         upperDeadZone,
      );
   }

   render(context: RenderingContext, instance: AxisInstance, key: string): React.ReactNode {
      let { data } = instance;

      if (!data.bounds.valid()) return null;

      let baseFormatter = Format.parse(data.format);
      let formatter = data.labelDivisor != 1 ? (v: number) => baseFormatter(v / data.labelDivisor) : baseFormatter;

      return (
         <g key={key} className={data.classNames} style={data.style}>
            {this.renderTicksAndLabels(context, instance, formatter, this.minLabelDistance)}
         </g>
      );
   }

   static XY() {
      return {
         x: { type: NumericAxis },
         y: { type: NumericAxis, vertical: true },
      };
   }
}

NumericAxis.prototype.baseClass = "numericaxis";
NumericAxis.prototype.tickDivisions = [
   [1, 2, 10, 20, 100],
   [1, 5, 10, 20, 100],
];

NumericAxis.prototype.snapToTicks = 1;
NumericAxis.prototype.normalized = false;
NumericAxis.prototype.format = "n";
NumericAxis.prototype.labelDivisor = 1;
NumericAxis.prototype.minLabelTickSize = 0;
NumericAxis.prototype.minTickStep = 0;

Axis.alias("numeric", NumericAxis);
