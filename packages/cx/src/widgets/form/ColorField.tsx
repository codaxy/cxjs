import * as React from "react";
import { Widget, VDOM, getContent } from "../../ui/Widget";
import { Cx } from "../../ui/Cx";
import { Field, getFieldTooltip } from "./Field";
import { Dropdown } from "../overlay/Dropdown";
import { ColorPicker } from "./ColorPicker";
import { parseColor } from "../../util/color/parseColor";
import { isTouchDevice } from "../../util/isTouchDevice";
import { isTouchEvent } from "../../util/isTouchEvent";
import type { RenderingContext } from "../../ui/RenderingContext";
import type { WidgetInstance } from "../../ui/Instance";

import {
   tooltipParentWillReceiveProps,
   tooltipParentWillUnmount,
   tooltipMouseMove,
   tooltipMouseLeave,
   tooltipParentDidMount,
} from "../overlay/tooltip-ops";
import { stopPropagation } from "../../util/eventCallbacks";
import { KeyCode } from "../../util/KeyCode";

import DropdownIcon from "../icons/drop-down";
import ClearIcon from "../icons/clear";
import { Localization } from "../../ui/Localization";
import { isDefined } from "../../util/isDefined";
import { getActiveElement } from "../../util/getActiveElement";

interface ColorInputProps {
   key?: string;
   instance: WidgetInstance;
   data: Record<string, unknown>;
   picker: {
      value: unknown;
      format: string;
   };
   label?: React.ReactNode;
   help?: React.ReactNode;
}

interface ColorInputState {
   dropdownOpen: boolean;
   focus: boolean;
}

export class ColorField extends Field {
   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(
         {
            value: this.emptyValue,
            disabled: undefined,
            readOnly: undefined,
            enabled: undefined,
            placeholder: undefined,
            required: undefined,
            format: undefined,
         },
         ...args,
      );
   }

   init(): void {
      if (isDefined(this.hideClear)) this.showClear = !this.hideClear;

      if (this.alwaysShowClear) this.showClear = true;

      super.init();
   }

   prepareData(context: RenderingContext, instance: WidgetInstance): void {
      let { data } = instance;
      data.stateMods = [
         data.stateMods,
         {
            empty: !data.value,
         },
      ];
      instance.lastDropdown = context.lastDropdown;
      super.prepareData(context, instance);
   }

   renderInput(context: RenderingContext, instance: WidgetInstance, key: string | number): React.ReactNode {
      return (
         <ColorInput
            key={key}
            instance={instance}
            data={instance.data}
            picker={{
               value: this.value,
               format: this.format,
            }}
            label={this.labelPlacement && getContent(this.renderLabel(context, instance, "label"))}
            help={this.helpPlacement && getContent(this.renderHelp(context, instance, "help"))}
         />
      );
   }
}

ColorField.prototype.baseClass = "colorfield";
ColorField.prototype.format = "rgba";
ColorField.prototype.suppressErrorsUntilVisited = true;
ColorField.prototype.showClear = true;
ColorField.prototype.alwaysShowClear = false;

Widget.alias("color-field", ColorField);
Localization.registerPrototype("cx/widgets/ColorField", ColorField);

class ColorInput extends VDOM.Component<ColorInputProps, ColorInputState> {
   data: Record<string, unknown>;
   dropdown?: Widget;
   input!: HTMLInputElement;
   openDropdownOnFocus: boolean = false;
   scrollableParents?: Element[];
   updateDropdownPosition: () => void;

   constructor(props: ColorInputProps) {
      super(props);
      let { data } = this.props;
      this.data = data;
      this.state = {
         dropdownOpen: false,
         focus: false,
      };
      this.updateDropdownPosition = () => {};
   }

   getDropdown(): Widget {
      if (this.dropdown) return this.dropdown;

      let { widget, lastDropdown } = this.props.instance;

      let dropdown = {
         scrollTracking: true,
         autoFocus: true, //put focus on the dropdown to prevent opening the keyboard
         focusable: true,
         inline: !isTouchDevice() || !!lastDropdown,
         touchFriendly: true,
         placementOrder:
            " down down-left down-right up up-left up-right right right-up right-down left left-up left-down",
         ...widget.dropdownOptions,
         type: Dropdown,
         relatedElement: this.input,
         items: {
            type: ColorPicker,
            ...this.props.picker,
            onColorClick: (e) => {
               e.stopPropagation();
               e.preventDefault();
               let touch = isTouchEvent();
               this.closeDropdown(e, () => {
                  if (!touch) this.input.focus();
               });
            },
         },
         onFocusOut: () => {
            this.closeDropdown();
         },
         dismissAfterScroll: () => {
            this.closeDropdown();
         },
         firstChildDefinesHeight: true,
         firstChildDefinesWidth: true,
      };

      return (this.dropdown = Widget.create(dropdown));
   }

   render(): React.ReactNode {
      let { instance, label, help, data } = this.props;
      let { widget, state } = instance;
      let { CSS, baseClass, suppressErrorsUntilVisited } = widget;

      let insideButton;
      if (!data.readOnly && !data.disabled) {
         if (
            widget.showClear &&
            (((!data.required || widget.alwaysShowClear) && !data.empty) || instance.state.inputError)
         )
            insideButton = (
               <div
                  className={CSS.element(baseClass, "clear")}
                  onMouseDown={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                  }}
                  onClick={(e) => {
                     this.onClearClick(e);
                  }}
               >
                  <ClearIcon className={CSS.element(baseClass, "icon")} />
               </div>
            );
         else
            insideButton = (
               <div className={CSS.element(baseClass, "right-icon")}>
                  <DropdownIcon className={CSS.element(baseClass, "icon")} />
               </div>
            );
      }

      let well = (
         <div className={CSS.element(baseClass, "left-icon")}>
            <div style={{ backgroundColor: data.value }}></div>
         </div>
      );

      let dropdown = false;
      if (this.state.dropdownOpen)
         dropdown = (
            <Cx
               widget={this.getDropdown()}
               parentInstance={instance}
               options={{ name: "colorfield-dropdown" }}
               subscribe
            />
         );

      let empty = this.input ? !this.input.value : data.empty;

      return (
         <div
            className={CSS.expand(
               data.classNames,
               CSS.state({
                  visited: state.visited,
                  focus: this.state.focus || this.state.dropdownOpen,
                  icon: true,
                  empty: empty && !data.placeholder,
                  error: data.error && (state.visited || !suppressErrorsUntilVisited || !empty),
               }),
            )}
            style={data.style}
            onMouseDown={this.onMouseDown.bind(this)}
            onTouchStart={stopPropagation}
            onClick={stopPropagation}
         >
            <input
               id={data.id}
               ref={(el) => {
                  this.input = el!;
               }}
               type="text"
               className={CSS.expand(CSS.element(baseClass, "input"), data.inputClass)}
               style={data.inputStyle}
               defaultValue={this.trim(data.value || "")}
               disabled={data.disabled}
               readOnly={data.readOnly}
               tabIndex={data.tabIndex}
               placeholder={data.placeholder}
               {...data.inputAttrs}
               onInput={(e) => this.onChange((e.target as HTMLInputElement).value, "input")}
               onChange={(e) => this.onChange((e.target as HTMLInputElement).value, "change")}
               onKeyDown={(e) => this.onKeyDown(e)}
               onBlur={(e) => {
                  this.onBlur(e);
               }}
               onFocus={(e) => {
                  this.onFocus(e);
               }}
               onMouseMove={(e) => {
                  const tooltip = getFieldTooltip(instance);
                  tooltipMouseMove(e, tooltip[0], tooltip[1]);
               }}
               onMouseLeave={(e) => {
                  const tooltip = getFieldTooltip(instance);
                  tooltipMouseLeave(e, tooltip[0], tooltip[1]);
               }}
            />
            {well}
            {insideButton}
            {dropdown}
            {label}
            {help}
         </div>
      );
   }

   onMouseDown(e: React.MouseEvent): void {
      e.stopPropagation();
      if (this.state.dropdownOpen) this.closeDropdown(e);
      else {
         this.openDropdownOnFocus = true;
      }

      //icon click
      if (e.target != this.input) {
         e.preventDefault();
         if (!this.state.dropdownOpen) this.openDropdown(e);
         else this.input.focus();
      }
   }

   onFocus(e: React.FocusEvent): void {
      if (this.openDropdownOnFocus) this.openDropdown(e);

      let { instance } = this.props;
      let { widget } = instance;
      if (widget.trackFocus) {
         this.setState({
            focus: true,
         });
      }
   }

   onKeyDown(e: React.KeyboardEvent): void {
      let { instance } = this.props;
      if (instance.widget.handleKeyDown(e, instance) === false) return;

      switch (e.keyCode) {
         case KeyCode.enter:
            e.stopPropagation();
            this.onChange((e.target as HTMLInputElement).value, "enter");
            break;

         case KeyCode.esc:
            if (this.state.dropdownOpen) {
               e.stopPropagation();
               this.closeDropdown(e, () => {
                  this.input.focus();
               });
            }
            break;

         case KeyCode.left:
         case KeyCode.right:
            e.stopPropagation();
            break;

         case KeyCode.down:
            this.openDropdown(e);
            e.stopPropagation();
            e.preventDefault();
            break;
      }
   }

   onBlur(e: React.FocusEvent): void {
      if (this.state.focus)
         this.setState({
            focus: false,
         });
      this.onChange((e.target as HTMLInputElement).value, "blur");
   }

   closeDropdown(e?: React.KeyboardEvent | React.MouseEvent, callback?: () => void): void {
      if (this.state.dropdownOpen) {
         if (this.scrollableParents)
            this.scrollableParents.forEach((el) => {
               el.removeEventListener("scroll", this.updateDropdownPosition);
            });

         this.setState({ dropdownOpen: false }, callback);
      } else if (callback) callback();
   }

   openDropdown(e: React.KeyboardEvent | React.MouseEvent): void {
      let { data } = this.props;
      this.openDropdownOnFocus = false;

      if (!this.state.dropdownOpen && !(data.disabled || data.readOnly)) {
         this.setState({ dropdownOpen: true });
      }
   }

   trim(value: string): string {
      return value.replace(/\s/g, "");
   }

   UNSAFE_componentWillReceiveProps(props: ColorInputProps): void {
      let { data, instance } = props;
      let { state } = instance;
      let nv = this.trim(data.value || "");
      if (nv != this.input.value && (this.data.value != data.value || !state.inputError)) {
         this.input.value = nv;
         instance.setState({
            inputError: false,
         });
      }
      this.data = data;

      const tooltip1 = getFieldTooltip(instance);
      tooltipParentWillReceiveProps(this.input, tooltip1[0], tooltip1[1]);
   }

   componentDidMount(): void {
      const tooltip2 = getFieldTooltip(this.props.instance);
      tooltipParentDidMount(this.input, tooltip2[0], tooltip2[1]);
      if (this.props.instance.widget.autoFocus && !isTouchDevice()) this.input.focus();
   }

   componentWillUnmount(): void {
      if (this.input == getActiveElement() && this.input.value != this.props.data.value) {
         this.onChange(this.input.value, "blur");
      }
      tooltipParentWillUnmount(this.props.instance);
   }

   onClearClick(e: React.MouseEvent): void {
      let { instance } = this.props;
      instance.set("value", instance.widget.emptyValue);
      instance.setState({
         inputError: false,
      });
      e.stopPropagation();
      e.preventDefault();
   }

   onChange(inputValue: string, eventType: string): void {
      let { instance, data } = this.props;
      let { widget } = instance;

      if (eventType == "blur") {
         instance.setState({ visited: true });
      }

      let isValid;
      try {
         parseColor(inputValue);
         isValid = true;
      } catch (e) {
         isValid = false;
      }

      if (eventType == "blur" || eventType == "enter") {
         let value = inputValue || widget.emptyValue;
         if (isValid && value !== data.value) instance.set("value", value);

         instance.setState({
            inputError: !isValid && "Invalid color entered.",
         });
      }
   }
}
