import type { RenderingContext } from "../../ui/RenderingContext";
import type { WidgetInstance } from "../../ui/Instance";
import { Widget, VDOM, getContent } from "../../ui/Widget";
import { Field, getFieldTooltip } from "./Field";
import { tooltipMouseMove, tooltipMouseLeave } from "../overlay/tooltip-ops";
import { stopPropagation } from "../../util/eventCallbacks";
import { KeyCode } from "../../util/KeyCode";
import { isUndefined } from "../../util/isUndefined";
import * as React from "react";

export class Radio extends Field {
   public selection?: unknown;
   public option?: unknown;
   public native?: boolean;
   public default?: boolean;

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(
         {
            value: undefined,
            selection: undefined,
            option: undefined,
            disabled: undefined,
            enabled: undefined,
            readOnly: undefined,
            required: undefined,
            text: undefined,
         },
         ...args
      );
   }

   init(): void {
      if (this.selection) this.value = this.selection;

      super.init();
   }

   formatValue(context: RenderingContext, { data }: WidgetInstance): React.ReactNode {
      return data.text;
   }

   prepareData(context: RenderingContext, instance: WidgetInstance): void {
      super.prepareData(context, instance);
      let { data } = instance;
      data.checked = data.value === data.option;
      if (this.default && isUndefined(data.value)) instance.set("value", data.option);
   }

   renderValue(context: RenderingContext, { data }: WidgetInstance): React.ReactNode {
      if (data.value === data.option) return super.renderValue(context, { data });
      return null;
   }

   renderWrap(context: RenderingContext, instance: WidgetInstance, key: string, content: React.ReactNode): React.ReactElement {
      var { data } = instance;
      return (
         <label
            key={key}
            className={data.classNames}
            style={data.style}
            onMouseDown={stopPropagation}
            onTouchStart={stopPropagation}
            onMouseMove={(e) => tooltipMouseMove(e, ...getFieldTooltip(instance))}
            onMouseLeave={(e) => tooltipMouseLeave(e, ...getFieldTooltip(instance))}
            onClick={(e) => {
               this.handleClick(e, instance);
            }}
            htmlFor={data.id}
         >
            {content}
            {this.labelPlacement && getContent(this.renderLabel(context, instance, "label"))}
         </label>
      );
   }

   renderNativeCheck(context: RenderingContext, instance: WidgetInstance): React.ReactElement {
      var { CSS, baseClass } = this;
      var { data } = instance;
      return (
         <input
            key="input"
            className={CSS.element(baseClass, "radio")}
            id={data.id}
            type="radio"
            checked={data.checked}
            disabled={data.disabled}
            {...data.inputAttrs}
            onClick={stopPropagation}
            onChange={(e) => {
               this.handleChange(e, instance);
            }}
         />
      );
   }

   renderCheck(context: RenderingContext, instance: WidgetInstance): React.ReactElement {
      return <RadioCmp key="check" instance={instance} data={instance.data} />;
   }

   renderInput(context: RenderingContext, instance: WidgetInstance, key: string): React.ReactElement {
      var { data } = instance;
      var text = data.text || this.renderChildren(context, instance);
      var { CSS, baseClass } = this;
      return this.renderWrap(context, instance, key, [
         this.native ? this.renderNativeCheck(context, instance) : this.renderCheck(context, instance),
         text ? (
            <div key="text" className={CSS.element(baseClass, "text")}>
               {text}
            </div>
         ) : (
            <span key="baseline" className={CSS.element(baseClass, "baseline")}>
               &nbsp;
            </span>
         ),
      ]);
   }

   handleClick(e: React.MouseEvent, instance: WidgetInstance): void {
      if (this.native) e.stopPropagation();
      else {
         var el = document.getElementById(instance.data.id);
         if (el) el.focus();
         e.preventDefault();
         this.handleChange(e, instance);
      }
   }

   handleChange(e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent, instance: WidgetInstance): void {
      var { data } = instance;
      if (data.disabled || data.readOnly || data.viewMode) return;
      instance.set("value", data.option);
   }
}

Radio.prototype.baseClass = "radio";
Radio.prototype.native = false;
Radio.prototype.default = false;

Widget.alias("radio", Radio);

interface RadioCmpProps {
   key?: string;
   instance: WidgetInstance;
   data: Record<string, unknown>;
}

interface RadioCmpState {
   value: unknown;
}

class RadioCmp extends VDOM.Component<RadioCmpProps, RadioCmpState> {
   constructor(props: RadioCmpProps) {
      super(props);
      this.state = {
         value: props.data.checked,
      };
   }

   UNSAFE_componentWillReceiveProps(props: RadioCmpProps): void {
      this.setState({
         value: props.data.checked,
      });
   }

   render(): React.ReactElement {
      var { instance, data } = this.props;
      var { widget } = instance;
      var { baseClass, CSS } = widget;

      return (
         <span
            key="check"
            tabIndex={data.disabled ? undefined : ((data.tabIndex as number) || 0)}
            className={CSS.element(baseClass, "input", {
               checked: this.state.value,
            })}
            style={CSS.parseStyle(data.inputStyle)}
            id={data.id}
            onClick={this.onClick.bind(this)}
            onKeyDown={this.onKeyDown.bind(this)}
         />
      );
   }

   onClick(e: React.MouseEvent): void {
      var { instance, data } = this.props;
      var { widget } = instance;
      if (!data.disabled && !data.readOnly) {
         e.stopPropagation();
         e.preventDefault();
         (widget as Radio).handleChange(e, instance);
      }
   }

   onKeyDown(e: React.KeyboardEvent): void {
      let { instance } = this.props;
      const widget = instance.widget as Radio;
      if (widget.handleKeyDown && widget.handleKeyDown(e as unknown as KeyboardEvent, instance) === false) return;

      switch (e.keyCode) {
         case KeyCode.space:
            this.onClick(e as unknown as React.MouseEvent);
            break;
      }
   }
}
