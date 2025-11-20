/** @jsxImportSource react */

import { Widget, VDOM, getContent } from "../../ui/Widget";
import { HtmlElement, HtmlElementInstance } from "../HtmlElement";
import { Field, getFieldTooltip, FieldInstance } from "./Field";
import {
   tooltipParentWillReceiveProps,
   tooltipMouseMove,
   tooltipMouseLeave,
   tooltipParentDidMount,
} from "../overlay/tooltip-ops";
import { stopPropagation, preventDefault } from "../../util/eventCallbacks";
import DropdownIcon from "../icons/drop-down";
import ClearIcon from "../icons/clear";
import { Localization } from "../../ui/Localization";
import { isString } from "../../util/isString";
import { isDefined } from "../../util/isDefined";
import { KeyCode } from "../../util/KeyCode";
import { autoFocus } from "../autoFocus";
import type { RenderingContext } from "../../ui/RenderingContext";
import type { Instance } from "../../ui/Instance";
import { FieldConfig } from "./Field";
import { Prop, StringProp, BooleanProp } from "../../ui/Prop";

export interface SelectConfig extends FieldConfig {
   value?: Prop<number | string>;
   emptyValue?: unknown;
   enabled?: BooleanProp;
   placeholder?: StringProp;
   hideClear?: boolean;
   showClear?: boolean;
   alwaysShowClear?: boolean;
   baseClass?: string;
   multiple?: boolean;
   convertValues?: boolean;
   nullString?: string;
}

export class Select<Config extends SelectConfig = SelectConfig> extends Field<Config> {
   declare public baseClass: string;
   public hideClear?: boolean;
   public showClear!: boolean;
   public alwaysShowClear!: boolean;
   public multiple!: boolean;
   public convertValues!: boolean;
   public nullString!: string;

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(
         {
            value: undefined,
            disabled: undefined,
            enabled: undefined,
            required: undefined,
            placeholder: undefined,
            icon: undefined,
         },
         ...args,
      );
   }

   init(): void {
      if (isDefined(this.hideClear)) this.showClear = !this.hideClear;
      if (this.alwaysShowClear) this.showClear = true;
      super.init();
   }

   renderInput(context: RenderingContext, instance: FieldInstance<Select>, key: string): React.ReactNode {
      return (
         <SelectComponent
            key={key}
            instance={instance}
            multiple={this.multiple}
            select={(v: string) => this.select(v, instance)}
            label={this.labelPlacement && getContent(this.renderLabel(context, instance, "label"))}
            help={this.helpPlacement && getContent(this.renderHelp(context, instance, "help"))}
            icon={this.renderIcon(context, instance, "icon")}
         >
            {this.renderChildren(context, instance)}
         </SelectComponent>
      );
   }

   convert(value: string): string | number | boolean | null {
      if (value == this.nullString) return null;
      if (value == "true") return true;
      if (value == "false") return false;
      if (value.match(/^\d+(\.\d+)?$/)) return Number(value);
      return value;
   }

   select(value: string, instance: Instance): void {
      let processedValue: string | number | boolean | null = value;
      if (this.convertValues && value != null) processedValue = this.convert(value);
      instance.set("value", processedValue);
   }

   add(item: unknown): void {
      if (isString(item)) return;
      super.add(item);
   }
}

Select.prototype.baseClass = "select";
Select.prototype.multiple = false;
Select.prototype.convertValues = true;
Select.prototype.nullString = "";
Select.prototype.suppressErrorsUntilVisited = true;
Select.prototype.showClear = true;
Select.prototype.alwaysShowClear = false;
Select.prototype.icon = null;

Widget.alias("select", Select);
Localization.registerPrototype("cx/widgets/Select", Select);

interface SelectComponentProps {
   instance: FieldInstance<Select>;
   multiple: boolean;
   select: (value: string) => void;
   label?: React.ReactNode;
   help?: React.ReactNode;
   icon?: React.ReactNode;
   children?: React.ReactNode;
}

interface SelectComponentState {
   visited: boolean;
   focus: boolean;
}

class SelectComponent extends VDOM.Component<SelectComponentProps, SelectComponentState> {
   select: HTMLSelectElement | null = null;

   constructor(props: SelectComponentProps) {
      super(props);
      this.state = {
         visited: false,
         focus: false,
      };
   }

   render(): React.ReactNode {
      let { multiple, select, instance, label, help, icon: iconVDOM } = this.props;
      let { data, widget, state } = instance;
      let { CSS, baseClass } = widget;

      let icon = iconVDOM && <div className={CSS.element(baseClass, "left-icon")}>{iconVDOM}</div>;

      let insideButton,
         readOnly = data.disabled || data.readOnly;

      if (
         widget.showClear &&
         !readOnly &&
         !this.props.multiple &&
         (widget.alwaysShowClear || !data.required) &&
         data.placeholder &&
         !data.empty
      ) {
         insideButton = (
            <div
               onMouseDown={preventDefault}
               onClick={(e) => this.onClearClick(e)}
               className={CSS.element(baseClass, "clear")}
            >
               <ClearIcon className={CSS.element(baseClass, "icon")} />
            </div>
         );
      } else {
         insideButton = (
            <div className={CSS.element(baseClass, "tool")}>
               <DropdownIcon className={CSS.element(baseClass, "icon")} />
            </div>
         );
      }

      let placeholder;
      if (data.placeholder) {
         placeholder = (
            <option value={widget.nullString} className={CSS.element(baseClass, "placeholder")} disabled hidden>
               {data.placeholder}
            </option>
         );
      }

      return (
         <div
            className={CSS.expand(
               data.classNames,
               CSS.state({
                  visited: state.visited,
                  icon: !!iconVDOM,
                  focus: this.state.focus,
                  error: state.visited && data.error,
                  empty: data.empty && !data.placeholder,
               }),
            )}
            style={data.style}
            onMouseDown={stopPropagation}
            onTouchStart={stopPropagation}
         >
            <select
               id={data.id}
               ref={(el) => {
                  this.select = el;
               }}
               className={CSS.expand(CSS.element(baseClass, "select"), data.inputClass)}
               style={data.inputStyle}
               value={data.value == null ? widget.nullString : String(data.value)}
               multiple={multiple}
               disabled={data.disabled}
               tabIndex={data.tabIndex}
               {...data.inputAttrs}
               onBlur={this.onBlur.bind(this)}
               onFocus={(e) => this.onFocus()}
               onKeyDown={this.onKeyDown.bind(this)}
               onChange={(e) => {
                  e.preventDefault();
                  select(e.target.value);
               }}
               onMouseMove={(e) => tooltipMouseMove(e, ...getFieldTooltip(instance))}
               onMouseLeave={(e) => tooltipMouseLeave(e, ...getFieldTooltip(instance))}
            >
               {placeholder}
               {this.props.children}
            </select>
            {insideButton}
            {icon}
            {label}
            {help}
         </div>
      );
   }

   onBlur(): void {
      this.props.instance.setState({ visited: true });
      if (this.state.focus)
         this.setState({
            focus: false,
         });
   }

   onFocus(): void {
      let { instance } = this.props;
      let { widget } = instance;
      if (widget.trackFocus) {
         this.setState({
            focus: true,
         });
      }
   }

   onClearClick(e: React.MouseEvent): void {
      e.preventDefault();
      e.stopPropagation();
      let { instance } = this.props;
      let { widget } = instance;
      instance.set("value", widget.emptyValue);
   }

   onKeyDown(e: React.KeyboardEvent): void {
      switch (e.keyCode) {
         case KeyCode.up:
         case KeyCode.down:
            e.stopPropagation();
            break;
      }
   }

   componentDidMount(): void {
      const { select } = this.props;
      if (this.select) {
         select(this.select.value);
         tooltipParentDidMount(this.select, ...getFieldTooltip(this.props.instance));
         autoFocus(this.select, this);
      }
   }

   componentDidUpdate(): void {
      if (this.select) {
         autoFocus(this.select, this);
      }
   }

   UNSAFE_componentWillReceiveProps(props: SelectComponentProps): void {
      if (this.select) {
         tooltipParentWillReceiveProps(this.select, ...getFieldTooltip(props.instance));
      }
   }
}

export class Option extends HtmlElement {
   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(
         {
            value: undefined,
            disabled: undefined,
            enabled: undefined,
            selected: undefined,
            text: undefined,
         },
         ...args,
      );
   }

   prepareData(context: RenderingContext, instance: HtmlElementInstance): void {
      super.prepareData(context, instance);
      const { data } = instance;
      if (!data.empty) data.value = data.value.toString();
   }

   render(context: RenderingContext, instance: HtmlElementInstance, key: string): React.ReactNode {
      const { data } = instance;
      return (
         <option key={key} value={data.value}>
            {data.text || this.renderChildren(context, instance)}
         </option>
      );
   }
}

Widget.alias("option", Option);
