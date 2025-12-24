/** @jsxImportSource react */
import type { RenderingContext } from "../../ui/RenderingContext";
import type { Instance } from "../../ui/Instance";
import { Widget, VDOM, getContent } from "../../ui/Widget";
import { KeyCode } from "../../util/KeyCode";
import { parseStyle } from "../../util/parseStyle";
import { Field, FieldConfig, getFieldTooltip, FieldInstance } from "./Field";
import { tooltipMouseMove, tooltipMouseLeave } from "../overlay/tooltip-ops";
import { preventFocus } from "../../ui/FocusManager";
import { isDefined } from "../../util/isDefined";
import { BooleanProp, StringProp, StyleProp } from "../../ui/Prop";

export interface SwitchConfig extends FieldConfig {
   /** Value indicating that switch is on. */
   on?: BooleanProp;

   /** Value indicating that switch is off. */
   off?: BooleanProp;

   /** Value indicating that switch is on. */
   value?: BooleanProp;

   /** Defaults to `false`. Used to make the field read-only. */
   readOnly?: BooleanProp;

   /** Text description. */
   text?: StringProp;

   /** Style object to be applied on the axis range when the switch is on. */
   rangeStyle?: StyleProp;

   /** Style object to be applied on the switch handle. */
   handleStyle?: StyleProp;

   /** Base CSS class to be applied to the field. Defaults to `switch`. */
   baseClass?: string;

   /** Determines if button should receive focus on mousedown event. Default is `false`. */
   focusOnMouseDown?: boolean;

   /** Custom validation function. */
   onValidate?: string | ((value: boolean, instance: Instance, validationParams: Record<string, unknown>) => unknown);
}

export class Switch extends Field<SwitchConfig> {
   declare public on?: unknown;
   declare public off?: unknown;
   declare public value?: unknown;
   declare public rangeStyle?: Record<string, unknown> | string;
   declare public handleStyle?: Record<string, unknown> | string;
   declare public focusOnMouseDown?: boolean;

   constructor(config?: SwitchConfig) {
      super(config);
   }

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(
         {
            on: false,
            off: true,
            value: undefined,
            disabled: undefined,
            enabled: undefined,
            readOnly: undefined,
            text: undefined,
            rangeStyle: {
               structured: true,
            },
            handleStyle: {
               structured: true,
            },
         },
         ...args,
      );
   }

   isEmpty(): boolean {
      return false;
   }

   init(): void {
      if (isDefined(this.value)) this.on = this.value;

      this.rangeStyle = parseStyle(this.rangeStyle);
      this.handleStyle = parseStyle(this.handleStyle);

      super.init();
   }

   prepareData(context: RenderingContext, instance: FieldInstance<Switch>): void {
      let { data } = instance;

      if (isDefined(this.off)) data.on = !data.off;

      data.stateMods = {
         ...data.stateMods,
         on: data.on,
         disabled: data.disabled,
      };
      super.prepareData(context, instance);
   }

   renderInput(context: RenderingContext, instance: FieldInstance, key: string): React.ReactElement {
      let { data, widget } = instance;
      let { rangeStyle, handleStyle } = data;
      let { CSS, baseClass } = this;

      let text = data.text || this.renderChildren(context, instance);
      let renderTextElement = text?.length != 0;

      return (
         <div
            key={key}
            className={data.classNames}
            style={data.style}
            id={data.id}
            tabIndex={data.disabled ? undefined : (data.tabIndex as number) || 0}
            onMouseDown={(e: React.MouseEvent) => {
               e.stopPropagation();
               if (!this.focusOnMouseDown) preventFocus(e);
            }}
            onClick={(e: React.MouseEvent) => {
               this.toggle(e, instance);
            }}
            onKeyDown={(e: React.KeyboardEvent) => {
               const switchWidget = widget as Switch;
               if (switchWidget.handleKeyDown && switchWidget.handleKeyDown(e, instance) === false) return;
               if (e.keyCode == KeyCode.space) {
                  this.toggle(e, instance);
               }
            }}
            onMouseMove={(e: React.MouseEvent) => {
               const tooltip = getFieldTooltip(instance);
               if (Array.isArray(tooltip)) {
                  tooltipMouseMove(e, ...tooltip);
               }
            }}
            onMouseLeave={(e: React.MouseEvent) => {
               const tooltip = getFieldTooltip(instance);
               if (Array.isArray(tooltip)) {
                  tooltipMouseLeave(e, ...tooltip);
               }
            }}
         >
            {this.labelPlacement && getContent(this.renderLabel(context, instance, "label"))}
            &nbsp;
            <div className={CSS.element(baseClass, "axis")}>
               <div className={CSS.element(baseClass, "range")} style={parseStyle(rangeStyle)} />
               <div className={CSS.element(baseClass, "space")}>
                  <div className={CSS.element(baseClass, "handle")} style={parseStyle(handleStyle)} />
               </div>
            </div>
            {renderTextElement && (
               <div key="text" className={CSS.element(this.baseClass, "text")}>
                  {text}
               </div>
            )}
         </div>
      );
   }

   toggle(e: React.MouseEvent | React.KeyboardEvent, instance: Instance): void {
      let { data } = instance;
      if (data.readOnly || data.disabled) return;
      instance.set("on", !data.on);
      instance.set("off", data.on);
      e.preventDefault();
      e.stopPropagation();
   }
}

Switch.prototype.baseClass = "switch";
Switch.prototype.focusOnMouseDown = false;

Widget.alias("switch", Switch);
