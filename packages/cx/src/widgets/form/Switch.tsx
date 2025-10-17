import type { RenderingContext } from "../../ui/RenderingContext";
import type { WidgetInstance } from "../../ui/Instance";
import { Widget, VDOM, getContent } from "../../ui/Widget";
import { KeyCode } from "../../util/KeyCode";
import { parseStyle } from "../../util/parseStyle";
import { Field, getFieldTooltip } from "./Field";
import { tooltipMouseMove, tooltipMouseLeave } from "../overlay/tooltip-ops";
import { preventFocus } from "../../ui/FocusManager";
import { isDefined } from "../../util/isDefined";
import * as React from "react";

export class Switch extends Field {
   public on?: unknown;
   public off?: unknown;
   public value?: unknown;
   public rangeStyle?: Record<string, unknown> | string;
   public handleStyle?: Record<string, unknown> | string;
   public focusOnMouseDown?: boolean;

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
         ...args
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

   prepareData(context: RenderingContext, instance: WidgetInstance): void {
      let { data } = instance;

      if (isDefined(this.off)) data.on = !data.off;

      data.stateMods = {
         ...data.stateMods,
         on: data.on,
         disabled: data.disabled,
      };
      super.prepareData(context, instance);
   }

   renderInput(context: RenderingContext, instance: WidgetInstance, key: string): React.ReactElement {
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
            tabIndex={data.disabled ? undefined : ((data.tabIndex as number) || 0)}
            onMouseDown={(e) => {
               e.stopPropagation();
               if (!this.focusOnMouseDown) preventFocus(e);
            }}
            onClick={(e) => {
               this.toggle(e, instance);
            }}
            onKeyDown={(e) => {
               if (widget.handleKeyDown && widget.handleKeyDown(e as unknown as KeyboardEvent, instance) === false) return;
               if (e.keyCode == KeyCode.space) {
                  this.toggle(e, instance);
               }
            }}
            onMouseMove={(e) => {
               const tooltip = getFieldTooltip(instance);
               if (Array.isArray(tooltip)) {
                  tooltipMouseMove(e, ...tooltip);
               }
            }}
            onMouseLeave={(e) => {
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

   toggle(e: React.MouseEvent | React.KeyboardEvent, instance: WidgetInstance): void {
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
