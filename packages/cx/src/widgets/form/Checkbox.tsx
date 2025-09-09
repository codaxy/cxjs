/** @jsxImportSource react */

import { Widget, VDOM, getContent } from "../../ui/Widget";
import { Field, getFieldTooltip } from "./Field";
import { tooltipMouseMove, tooltipMouseLeave } from "../overlay/tooltip-ops";
import { stopPropagation } from "../../util/eventCallbacks";
import { KeyCode } from "../../util/KeyCode";
import CheckIcon from "../icons/check";
import SquareIcon from "../icons/square";
import { Instance } from "../../ui/Instance";
import * as React from "react";

export class Checkbox extends Field {
   public checked?: any;
   public value?: any;
   public indeterminate?: boolean;
   public unfocusable?: boolean;
   public native?: boolean;
   public requiredText?: string;

   init() {
      if (this.checked) this.value = this.checked;

      super.init();
   }

   declareData(...args: any[]) {
      super.declareData(
         {
            value: !this.indeterminate ? false : undefined,
            text: undefined,
            readOnly: undefined,
            disabled: undefined,
            enabled: undefined,
            required: undefined,
            viewText: undefined,
         },
         ...args,
      );
   }

   renderWrap(context: any, instance: Instance, key: string, content: any) {
      let { data } = instance;
      return (
         <label
            key={key}
            className={data.classNames}
            onMouseDown={(e) => {
               e.stopPropagation();
               if (this.unfocusable) e.preventDefault();
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
            onClick={(e) => {
               this.handleClick(e, instance);
            }}
            style={data.style}
         >
            {content}
            {this.labelPlacement && getContent(this.renderLabel(context, instance, "label"))}
         </label>
      );
   }

   validateRequired(context: any, instance: Instance) {
      let { data } = instance;
      if (!data.value) return this.requiredText;
   }

   renderNativeCheck(context: any, instance: Instance) {
      let { CSS, baseClass } = this;
      let { data } = instance;
      return (
         <input
            key="input"
            className={CSS.element(baseClass, "checkbox")}
            id={data.id}
            type="checkbox"
            checked={data.value || false}
            disabled={data.disabled}
            {...data.inputAttrs}
            onClick={stopPropagation}
            onChange={(e) => {
               this.handleChange(e, instance, (e.target as HTMLInputElement).checked);
            }}
         />
      );
   }

   renderCheck(context: any, instance: Instance) {
      return <CheckboxCmp key="check" instance={instance} data={instance.data} />;
   }

   renderInput(context: any, instance: Instance, key: string) {
      let { data } = instance;
      let text = data.text || this.renderChildren?.(context, instance);
      let { CSS, baseClass } = this;
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

   renderValue(context: any, { data }: { data: any }) {
      if (!data.viewText) return super.renderValue(context, { data }, undefined);
      return <span className={this.CSS.element(this.baseClass, "view-text")}>{data.viewText}</span>;
   }

   formatValue(context: any, instance: Instance) {
      let { data } = instance;
      return data.value && (data.text || this.renderChildren?.(context, instance));
   }

   handleClick(e: any, instance: Instance) {
      if (this.native) e.stopPropagation();
      else {
         var el = document.getElementById(instance.data.id);
         if (el) el.focus();
         if (!instance.data.viewMode) {
            e.preventDefault();
            e.stopPropagation();
            this.handleChange(e, instance, !instance.data.value);
         }
      }
   }

   handleChange(e: any, instance: Instance, checked?: boolean) {
      let { data } = instance;

      if (data.readOnly || data.disabled || data.viewMode) return;

      instance.set("value", checked != null ? checked : e.target.checked);
   }
}

Checkbox.prototype.baseClass = "checkbox";
Checkbox.prototype.native = false;
Checkbox.prototype.indeterminate = false;
Checkbox.prototype.unfocusable = false;

Widget.alias("checkbox", Checkbox);

interface CheckboxCmpProps {
   key?: string;
   instance: Instance;
   data: any;
}

interface CheckboxCmpState {
   value: any;
}

class CheckboxCmp extends React.Component<CheckboxCmpProps, CheckboxCmpState> {
   constructor(props: CheckboxCmpProps) {
      super(props);
      this.state = {
         value: props.data.value,
      };
   }

   UNSAFE_componentWillReceiveProps(props: CheckboxCmpProps) {
      this.setState({
         value: props.data.value,
      });
   }

   render() {
      let { instance, data } = this.props;
      let { widget } = instance;
      let { baseClass, CSS } = widget;

      let check: string | boolean = false;

      if (this.state.value == null && (widget as Checkbox).indeterminate) check = "indeterminate";
      else if (this.state.value) check = "check";

      return (
         <span
            key="check"
            tabIndex={(widget as Checkbox).unfocusable || data.disabled ? null : data.tabIndex || 0}
            className={CSS.element(baseClass, "input", {
               checked: check,
            })}
            style={CSS.parseStyle(data.inputStyle)}
            id={data.id}
            onClick={this.onClick.bind(this)}
            onKeyDown={this.onKeyDown.bind(this)}
         >
            {check == "check" && <CheckIcon className={CSS.element(baseClass, "input-check")} />}
            {check == "indeterminate" && <SquareIcon className={CSS.element(baseClass, "input-check")} />}
         </span>
      );
   }

   onClick(e: any) {
      let { instance, data } = this.props;
      let { widget } = instance;
      if (!data.disabled && !data.readOnly) {
         e.stopPropagation();
         e.preventDefault();
         this.setState({ value: !this.state.value });
         (widget as Checkbox).handleChange(e, instance, !this.state.value);
      }
   }

   onKeyDown(e: any) {
      let { instance } = this.props;
      if ((instance.widget as any).handleKeyDown && (instance.widget as any).handleKeyDown(e, instance) === false) return;

      switch (e.keyCode) {
         case KeyCode.space:
            this.onClick(e);
            break;
      }
   }
}
