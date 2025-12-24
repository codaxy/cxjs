/** @jsxImportSource react */

import { BooleanProp, NumberProp, StringProp, StructuredProp, StyleProp } from "../../ui/Prop";
import type { RenderingContext } from "../../ui/RenderingContext";
import { VDOM, Widget, getContent } from "../../ui/Widget";
import { addEventListenerWithOptions } from "../../util/addEventListenerWithOptions";
import { getTopLevelBoundingClientRect } from "../../util/getTopLevelBoundingClientRect";
import { isDefined } from "../../util/isDefined";
import { isUndefined } from "../../util/isUndefined";
import { captureMouseOrTouch, getCursorPos } from "../overlay/captureMouse";
import {
   tooltipMouseLeave,
   tooltipMouseMove,
   tooltipParentDidMount,
   tooltipParentWillReceiveProps,
   tooltipParentWillUnmount,
   type TooltipConfig,
} from "../overlay/tooltip-ops";
import { Field, FieldConfig, FieldInstance, getFieldTooltip } from "./Field";
import type { Instance } from "../../ui/Instance";

export interface SliderConfig extends FieldConfig {
   /** Low value of the slider range. */
   from?: NumberProp;

   /** High value of the slider range. */
   to?: NumberProp;

   /** Rounding step. */
   step?: NumberProp;

   /** Minimum allowed value. Default is `0`. */
   minValue?: NumberProp;

   /** Maximum allowed value. Default is `100`. */
   maxValue?: NumberProp;

   /** Style object to be applied on the selected axis range. */
   rangeStyle?: StyleProp;

   /** Style object to be applied on the handle. */
   handleStyle?: StyleProp;

   /** Minimum allowed value. Default is `0`. */
   min?: NumberProp;

   /** Maximum allowed value. Default is `100`. */
   max?: NumberProp;

   /** High value of the slider range. */
   value?: NumberProp;

   /** Set to `true` to orient the slider vertically. */
   vertical?: boolean;

   /** Invert vertical slider behavior. Set this to `true` if you want the slider to go from `top` to `bottom`. */
   invert?: boolean;

   /** Range tooltip configuration. */
   toTooltip?: StringProp | StructuredProp;

   /** Range tooltip configuration. */
   valueTooltip?: StringProp | StructuredProp;

   /** Range tooltip configuration. */
   fromTooltip?: StringProp | StructuredProp;

   /** When set to `true`, slider responds to mouse wheel events, while hovering it. It will not work if both `from` and `to` values are used. Default value is `false`. */
   wheel?: BooleanProp;

   /** Value increment/decrement, when controlling the slider with mouse wheel. Default value is set to `1%` of range. */
   increment?: NumberProp;

   /** Increment percentage. Default value is `0.01` (1%). */
   incrementPercentage?: number;

   /** Set to `true` to make the slider read-only. */
   readOnly?: BooleanProp;

   /** Custom validation function. */
   onValidate?: string | ((value: number, instance: Instance, validationParams: Record<string, unknown>) => unknown);
}

export class Slider extends Field<SliderConfig, FieldInstance<Slider>> {
   declare baseClass: string;
   declare min?: number;
   declare max?: number;
   declare minValue: number;
   declare maxValue: number;
   declare value?: number;
   declare vertical: boolean;
   declare invert: boolean;
   declare from?: number;
   declare to?: number;
   declare showFrom?: boolean;
   declare showTo?: boolean;
   declare toTooltip?: TooltipConfig;
   declare fromTooltip?: TooltipConfig;
   declare valueTooltip?: TooltipConfig;
   declare incrementPercentage: number;
   declare wheel: boolean;

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(
         {
            from: 0,
            to: 0,
            step: undefined,
            minValue: undefined,
            maxValue: undefined,
            increment: undefined,
            incrementPercentage: undefined,
            wheel: undefined,
            disabled: undefined,
            enabled: undefined,
            readOnly: undefined,
            rangeStyle: {
               structured: true,
            },
            handleStyle: {
               structured: true,
            },
            invert: false,
         },
         ...args,
      );
   }

   init(): void {
      if (isDefined(this.min)) this.minValue = this.min;

      if (isDefined(this.max)) this.maxValue = this.max;

      if (this.value != null) this.to = this.value;

      if (isUndefined(this.from)) this.from = this.minValue;
      else this.showFrom = true;

      if (isUndefined(this.to)) this.to = this.maxValue;
      else this.showTo = true;

      if (this.valueTooltip) this.toTooltip = this.valueTooltip;

      super.init();
   }

   prepareData(context: RenderingContext, instance: FieldInstance<Slider>): void {
      let { data } = instance;
      data.stateMods = {
         ...data.stateMods,
         horizontal: !this.vertical,
         vertical: this.vertical,
         disabled: data.disabled,
      };
      super.prepareData(context, instance);
   }

   renderInput(context: RenderingContext, instance: FieldInstance<Slider>, key: string): React.ReactNode {
      return (
         <SliderComponent
            key={key}
            instance={instance}
            data={instance.data}
            label={this.labelPlacement && getContent(this.renderLabel(context, instance, "label"))}
         />
      );
   }
}

Slider.prototype.baseClass = "slider";
Slider.prototype.minValue = 0;
Slider.prototype.maxValue = 100;
Slider.prototype.vertical = false;
Slider.prototype.incrementPercentage = 0.01;
Slider.prototype.wheel = false;
Slider.prototype.invert = false;

Widget.alias("slider", Slider);

interface SliderComponentProps {
   instance: FieldInstance<Slider>;
   data: Record<string, any>;
   label?: React.ReactNode;
}

interface SliderComponentState {
   from: number;
   to: number;
   drag?: boolean;
}

interface DomRefs {
   el?: HTMLElement;
   range?: HTMLElement;
   from?: HTMLElement;
   to?: HTMLElement;
}

class SliderComponent extends VDOM.Component<SliderComponentProps, SliderComponentState> {
   dom: DomRefs;
   unsubscribeOnWheel?: () => void;

   constructor(props: SliderComponentProps) {
      super(props);
      this.dom = {};
      let { data } = props;
      this.state = {
         from: data.from as number,
         to: data.to as number,
      };
   }

   render(): React.ReactNode {
      let { instance, data, label } = this.props;
      let { widget } = instance;
      let { CSS, baseClass } = widget;
      let { minValue, maxValue } = data;
      let { from, to } = this.state;

      from = Math.min(maxValue, Math.max(minValue, from));
      to = Math.min(maxValue, Math.max(minValue, to));

      let handleStyle = CSS.parseStyle(data.handleStyle);
      let anchor = widget.vertical ? (widget.invert ? "top" : "bottom") : "left";
      let rangeStart = from - minValue;
      let rangeSize = to - from;

      let fromHandleStyle = {
         ...handleStyle,
         [anchor]: `${(100 * (from - minValue)) / (maxValue - minValue)}%`,
      };

      let toHandleStyle = {
         ...handleStyle,
         [anchor]: `${(100 * (to - minValue)) / (maxValue - minValue)}%`,
      };

      let rangeStyle = {
         ...CSS.parseStyle(data.rangeStyle),
         [anchor]: `${(100 * rangeStart) / (maxValue - minValue)}%`,
         [widget.vertical ? "height" : "width"]: `${(100 * rangeSize) / (maxValue - minValue)}%`,
      };

      return (
         <div
            className={data.classNames}
            style={data.style}
            id={data.id}
            onClick={(e: React.MouseEvent) => this.onClick(e)}
            ref={(el: HTMLDivElement | null) => {
               this.dom.el = el || undefined;
            }}
            onMouseMove={(e: React.MouseEvent) => tooltipMouseMove(e, ...getFieldTooltip(instance))}
            onMouseLeave={(e: React.MouseEvent) => tooltipMouseLeave(e, ...getFieldTooltip(instance))}
         >
            {label}&nbsp;
            <div className={CSS.element(baseClass, "axis")}>
               {rangeSize > 0 && <div key="range" className={CSS.element(baseClass, "range")} style={rangeStyle} />}
               <div
                  key="space"
                  className={CSS.element(baseClass, "space")}
                  ref={(c: HTMLDivElement | null) => {
                     this.dom.range = c || undefined;
                  }}
               >
                  {widget.showFrom && (
                     <div
                        key="from"
                        className={CSS.element(baseClass, "handle")}
                        tabIndex={data.disabled ? undefined : (data.tabIndex as number) || 0}
                        style={fromHandleStyle}
                        onMouseDown={(e: React.MouseEvent) => this.onHandleMouseDown(e, "from")}
                        onMouseMove={(e: React.MouseEvent) =>
                           tooltipMouseMove(e, instance, widget.fromTooltip, { tooltipName: "fromTooltip" })
                        }
                        onMouseLeave={(e: React.MouseEvent) => this.onHandleMouseLeave(e, "from")}
                        onTouchStart={(e: React.TouchEvent) => this.onHandleMouseDown(e, "from")}
                        ref={(c: HTMLDivElement | null) => {
                           this.dom.from = c || undefined;
                        }}
                     />
                  )}
                  {widget.showTo && (
                     <div
                        key="to"
                        className={CSS.element(baseClass, "handle")}
                        tabIndex={data.disabled ? undefined : 0}
                        style={toHandleStyle}
                        onMouseDown={(e: React.MouseEvent) => this.onHandleMouseDown(e, "to")}
                        onMouseMove={(e: React.MouseEvent) =>
                           tooltipMouseMove(e, instance, widget.toTooltip, { tooltipName: "toTooltip" })
                        }
                        onMouseLeave={(e: React.MouseEvent) => this.onHandleMouseLeave(e, "to")}
                        onTouchStart={(e: React.TouchEvent) => this.onHandleMouseDown(e, "to")}
                        ref={(c: HTMLDivElement | null) => {
                           this.dom.to = c || undefined;
                        }}
                     />
                  )}
               </div>
            </div>
         </div>
      );
   }

   UNSAFE_componentWillReceiveProps(props: SliderComponentProps): void {
      this.setState({
         from: props.data.from,
         to: props.data.to,
      });

      let { instance } = props;
      let { widget } = instance;
      tooltipParentWillReceiveProps(this.dom.to!, instance, widget.toTooltip, { tooltipName: "toTooltip" });
      tooltipParentWillReceiveProps(this.dom.from!, instance, widget.fromTooltip, { tooltipName: "fromTooltip" });
   }

   componentWillUnmount(): void {
      tooltipParentWillUnmount(this.props.instance);
      this.unsubscribeOnWheel?.();
   }

   componentDidMount(): void {
      let { instance } = this.props;
      let { widget } = instance;
      tooltipParentDidMount(this.dom.to!, instance, widget.toTooltip, { tooltipName: "toTooltip" });
      tooltipParentDidMount(this.dom.from!, instance, widget.fromTooltip, { tooltipName: "fromTooltip" });

      this.unsubscribeOnWheel = addEventListenerWithOptions(this.dom.el!, "wheel", (e) => this.onWheel(e), {
         passive: false,
      });
   }

   onHandleMouseLeave(e: React.MouseEvent, handle: "from" | "to"): void {
      if (!this.state.drag) {
         let tooltipName = handle + "Tooltip";
         let { instance } = this.props;
         let tooltip = handle == "from" ? instance.widget.fromTooltip : instance.widget.toTooltip;
         tooltipMouseLeave(e, instance, tooltip, { tooltipName });
      }
   }

   onHandleMouseDown(e: React.MouseEvent | React.TouchEvent, handle: "from" | "to"): void {
      e.preventDefault();
      e.stopPropagation();

      let { instance } = this.props;
      let { data, widget } = instance;
      if (data.disabled || data.readOnly) return;

      let handleEl = this.dom[handle];
      let b = getTopLevelBoundingClientRect(handleEl!);
      let pos = getCursorPos(e);
      let dx = pos.clientX - (b.left + b.right) / 2;
      let dy = pos.clientY - (b.top + b.bottom) / 2;

      let tooltipName = handle + "Tooltip";
      let tooltip = handle == "from" ? widget.fromTooltip : widget.toTooltip;

      this.setState({
         drag: true,
      });

      captureMouseOrTouch(
         e,
         (e) => {
            let { value } = this.getValues(e, widget.vertical ? dy : dx);
            if (handle === "from") {
               if (instance.set("from", value)) this.setState({ from: value });
               if (value > this.state.to) {
                  if (instance.set("to", value)) this.setState({ to: value });
               }
            } else if (handle === "to") {
               if (instance.set("to", value)) this.setState({ to: value });
               if (value < this.state.from) {
                  if (instance.set("from", value)) this.setState({ from: value });
               }
            }
            tooltipMouseMove(e, instance, tooltip, { tooltipName, target: handleEl });
         },
         (e: any) => {
            this.setState({
               drag: false,
            });
            let pos = getCursorPos(e);
            let el = document.elementFromPoint(pos.clientX, pos.clientY);
            if (el !== handleEl) tooltipMouseLeave(e, instance, tooltip as any, { tooltipName, target: handleEl });
         },
      );
   }

   getValues(
      e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent,
      d: number = 0,
   ): { percent: number; value: number } {
      let { data, widget } = this.props.instance;
      let { minValue, maxValue } = data;
      let b = getTopLevelBoundingClientRect(this.dom.range!);
      let pos = getCursorPos(e as any);
      let pct = widget.vertical
         ? widget.invert
            ? Math.max(0, Math.min(1, (pos.clientY - b.top - d) / this.dom.range!.offsetHeight))
            : Math.max(0, Math.min(1, (b.bottom - pos.clientY + d) / this.dom.range!.offsetHeight))
         : Math.max(0, Math.min(1, (pos.clientX - b.left - d) / this.dom.range!.offsetWidth));
      let delta = (maxValue - minValue) * pct;
      if (data.step) {
         let currentValue = Math.round(delta / data.step) * data.step + minValue;
         let value = this.checkBoundaries(currentValue);

         if (maxValue % data.step === 0) delta = Math.round(delta / data.step) * data.step;

         delta = value - minValue;
      }

      return {
         percent: delta / (maxValue - minValue),
         value: minValue + delta,
      };
   }

   onClick(e: React.MouseEvent): void {
      let { instance } = this.props;
      let { data, widget } = instance;
      if (!data.disabled && !data.readOnly) {
         let { value } = this.getValues(e);
         this.props.instance.set("value", value, { immediate: true });

         if (widget.showFrom) {
            this.setState({ from: value });
            this.props.instance.set("from", value, { immediate: true });
         }
         if (widget.showTo) {
            this.setState({ to: value });
            this.props.instance.set("to", value, { immediate: true });
         }
      }
   }

   onWheel(e: WheelEvent): void {
      let { instance } = this.props;
      let { data, widget } = instance;
      if ((widget.showFrom && widget.showTo) || !data.wheel) return;

      e.preventDefault();
      e.stopPropagation();

      let increment = e.deltaY > 0 ? this.getIncrement() : -this.getIncrement();

      if (!data.disabled && !data.readOnly) {
         if (widget.showFrom) {
            let value = this.checkBoundaries(data.from + increment);
            if (instance.set("from", value)) this.setState({ from: value });
         } else if (widget.showTo) {
            let value = this.checkBoundaries(data.to + increment);
            if (instance.set("to", value)) this.setState({ to: value });
         }
      }
   }

   checkBoundaries(value: number): number {
      let { data } = this.props.instance;
      if (value > data.maxValue) value = data.maxValue;
      else if (value < data.minValue) value = data.minValue;
      return value;
   }

   getIncrement(): number {
      let { instance } = this.props;
      let { data } = instance;
      let increment = data.increment || (data.maxValue - data.minValue) * data.incrementPercentage;
      return increment;
   }
}
