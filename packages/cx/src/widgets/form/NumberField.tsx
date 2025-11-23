/** @jsxImportSource react */

import { Widget, VDOM, getContent } from "../../ui/Widget";
import { Field, getFieldTooltip, FieldInstance, FieldConfig } from "./Field";
import { Format } from "../../ui/Format";
import { Culture } from "../../ui/Culture";
import type { RenderingContext } from "../../ui/RenderingContext";
import type { Instance } from "../../ui/Instance";
import { StringTemplate } from "../../data/StringTemplate";
import {
   tooltipParentWillReceiveProps,
   tooltipParentWillUnmount,
   tooltipMouseMove,
   tooltipMouseLeave,
   tooltipParentDidMount,
} from "../overlay/tooltip-ops";
import { stopPropagation } from "../../util/eventCallbacks";
import { Localization } from "../../ui/Localization";
import ClearIcon from "../icons/clear";
import { isString } from "../../util/isString";
import { isNumber } from "../../util/isNumber";
import { isDefined } from "../../util/isDefined";
import { getActiveElement } from "../../util/getActiveElement";

import { enableCultureSensitiveFormatting } from "../../ui/Format";
import { KeyCode } from "../../util/KeyCode";
import { autoFocus } from "../autoFocus";
import { Prop, NumberProp, StringProp, BooleanProp } from "../../ui/Prop";

enableCultureSensitiveFormatting();

export interface NumberFieldConfig extends FieldConfig {
   value?: NumberProp;
   readOnly?: BooleanProp;
   enabled?: BooleanProp;
   placeholder?: StringProp;
   format?: StringProp;
   minValue?: NumberProp;
   minExclusive?: BooleanProp;
   maxValue?: NumberProp;
   maxExclusive?: BooleanProp;
   constrain?: BooleanProp;
   incrementPercentage?: NumberProp;
   increment?: NumberProp;
   step?: number;
   baseClass?: string;
   snapToIncrement?: boolean;
   showClear?: boolean;
   hideClear?: boolean;
   alwaysShowClear?: boolean;
   reactOn?: string;
   inputType?: "text" | "password";
   maxValueErrorText?: string;
   maxExclusiveErrorText?: string;
   minValueErrorText?: string;
   minExclusiveErrorText?: string;
   inputErrorText?: string;
   scale?: number;
   offset?: number;
}

export class NumberField<Config extends NumberFieldConfig = NumberFieldConfig> extends Field<Config> {
   declare public baseClass: string;
   declare public reactOn: string;
   declare public format: string;
   declare public inputType: string;
   declare public incrementPercentage: number;
   declare public increment?: number;
   declare public scale: number;
   declare public offset: number;
   declare public step?: number;
   declare public hideClear?: boolean;
   declare public showClear?: boolean;
   declare public alwaysShowClear?: boolean;
   declare public snapToIncrement?: boolean;
   declare public onParseInput?: string | ((value: string, instance: Instance) => number | undefined);
   declare public minValueErrorText: string;
   declare public maxValueErrorText: string;
   declare public minExclusiveErrorText: string;
   declare public maxExclusiveErrorText: string;
   declare public inputErrorText?: string;

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
            minValue: undefined,
            maxValue: undefined,
            constrain: undefined,
            minExclusive: undefined,
            maxExclusive: undefined,
            incrementPercentage: undefined,
            increment: undefined,
            icon: undefined,
            scale: undefined,
            offset: undefined,
         },
         ...args,
      );
   }

   init(): void {
      if (isDefined(this.step)) this.increment = this.step;

      if (isDefined(this.hideClear)) this.showClear = !this.hideClear;

      if (this.alwaysShowClear) this.showClear = true;

      super.init();
   }

   prepareData(context: RenderingContext, instance: FieldInstance<NumberField>): void {
      let { data, state, cached } = instance;
      data.formatted = Format.value(data.value, data.format);

      if (!cached.data || data.value != cached.data.value) state.empty = data.value == null;

      super.prepareData(context, instance);
   }

   formatValue(context: RenderingContext, { data }: FieldInstance<NumberField>): string | number | undefined {
      return data.formatted;
   }

   parseValue(value: string, instance: FieldInstance<NumberField>): number {
      if (this.onParseInput) {
         let result = instance.invoke("onParseInput", value, instance);
         if (result !== undefined) return result;
      }
      return Culture.getNumberCulture().parse(value);
   }

   validate(context: RenderingContext, instance: FieldInstance<NumberField>): void {
      super.validate(context, instance);

      let { data } = instance;
      if (isNumber(data.value) && !data.error) {
         if (isNumber(data.minValue)) {
            if (data.value < data.minValue)
               data.error = StringTemplate.format(this.minValueErrorText, Format.value(data.minValue, data.format));
            else if (data.value == data.minValue && data.minExclusive)
               data.error = StringTemplate.format(this.minExclusiveErrorText, Format.value(data.minValue, data.format));
         }

         if (isNumber(data.maxValue)) {
            if (data.value > data.maxValue)
               data.error = StringTemplate.format(this.maxValueErrorText, Format.value(data.maxValue, data.format));
            else if (data.value == data.maxValue && data.maxExclusive)
               data.error = StringTemplate.format(this.maxExclusiveErrorText, Format.value(data.maxValue, data.format));
         }
      }
   }

   renderInput(context: RenderingContext, instance: FieldInstance<NumberField>, key: string): React.ReactNode {
      return (
         <Input
            key={key}
            data={instance.data}
            instance={instance}
            label={this.labelPlacement && getContent(this.renderLabel(context, instance, "label"))}
            help={this.helpPlacement && getContent(this.renderHelp(context, instance, "help"))}
            icon={this.renderIcon(context, instance, "icon")}
         />
      );
   }

   validateRequired(context: RenderingContext, instance: FieldInstance<NumberField>): string | undefined {
      return instance.state.empty && this.requiredText;
   }
}

NumberField.prototype.baseClass = "numberfield";
NumberField.prototype.reactOn = "enter blur";
NumberField.prototype.format = "n";
NumberField.prototype.inputType = "text";

NumberField.prototype.maxValueErrorText = "Enter {0} or less.";
NumberField.prototype.maxExclusiveErrorText = "Enter a number less than {0}.";
NumberField.prototype.minValueErrorText = "Enter {0} or more.";
NumberField.prototype.minExclusiveErrorText = "Enter a number greater than {0}.";
NumberField.prototype.inputErrorText = "Invalid number entered.";
NumberField.prototype.suppressErrorsUntilVisited = true;

NumberField.prototype.incrementPercentage = 0.1;
NumberField.prototype.scale = 1;
NumberField.prototype.offset = 0;
NumberField.prototype.snapToIncrement = true;
NumberField.prototype.icon = null;
NumberField.prototype.showClear = false;
NumberField.prototype.alwaysShowClear = false;

Widget.alias("numberfield", NumberField);
Localization.registerPrototype("cx/widgets/NumberField", NumberField);

interface InputProps {
   instance: FieldInstance<NumberField>;
   data: Record<string, any>;
   label?: React.ReactNode;
   help?: React.ReactNode;
   icon?: React.ReactNode;
}

interface InputState {
   focus: boolean;
}

class Input extends VDOM.Component<InputProps, InputState> {
   input?: HTMLInputElement;

   constructor(props: InputProps) {
      super(props);
      this.state = {
         focus: false,
      };
   }

   render(): React.ReactNode {
      let { data, instance, label, help, icon: iconVDOM } = this.props;
      let { widget, state } = instance;
      let { CSS, baseClass, suppressErrorsUntilVisited } = widget;

      let icon = iconVDOM && <div className={CSS.element(baseClass, "left-icon")}>{iconVDOM}</div>;

      let insideButton;
      if (!data.readOnly && !data.disabled) {
         if (
            widget.showClear &&
            (((widget.alwaysShowClear || !data.required) && !data.empty) || instance.state.inputError)
         )
            insideButton = (
               <div
                  className={CSS.element(baseClass, "clear")}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => this.onClearClick(e)}
               >
                  <ClearIcon className={CSS.element(baseClass, "icon")} />
               </div>
            );
      }

      let empty = this.input ? !this.input.value : data.empty;

      return (
         <div
            className={CSS.expand(
               data.classNames,
               CSS.state({
                  visited: state.visited,
                  focus: this.state.focus,
                  icon: !!icon,
                  empty: empty && !data.placeholder,
                  error: data.error && (state.visited || !suppressErrorsUntilVisited || !empty),
               }),
            )}
            style={data.style}
            onMouseDown={stopPropagation}
            onTouchStart={stopPropagation}
         >
            <input
               id={data.id}
               type={widget.inputType}
               className={CSS.expand(CSS.element(baseClass, "input"), data.inputClass)}
               defaultValue={data.formatted}
               ref={(el: HTMLInputElement | null) => {
                  this.input = el || undefined;
               }}
               style={data.inputStyle}
               disabled={data.disabled}
               readOnly={data.readOnly}
               tabIndex={data.tabIndex}
               placeholder={data.placeholder}
               {...data.inputAttrs}
               onMouseMove={(e: React.MouseEvent<HTMLInputElement>) =>
                  tooltipMouseMove(e, ...getFieldTooltip(this.props.instance))
               }
               onMouseLeave={(e: React.MouseEvent<HTMLInputElement>) =>
                  tooltipMouseLeave(e, ...getFieldTooltip(this.props.instance))
               }
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.onChange(e, "change")}
               onKeyDown={this.onKeyDown.bind(this)}
               onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  this.onChange(e, "blur");
               }}
               onFocus={(e: React.FocusEvent<HTMLInputElement>) => this.onFocus()}
               onWheel={(e: React.WheelEvent<HTMLInputElement>) => {
                  this.onChange(e, "wheel");
               }}
               onClick={stopPropagation}
            />
            {insideButton}
            {icon}
            {label}
            {help}
         </div>
      );
   }

   UNSAFE_componentWillReceiveProps(props: InputProps): void {
      let { data, state } = props.instance;
      if (this.props.data.formatted != data.formatted && !state.inputError) {
         this.input!.value = props.data.formatted || "";
         props.instance.setState({
            inputError: false,
         });
      }
      tooltipParentWillReceiveProps(this.input!, ...getFieldTooltip(props.instance));
   }

   componentDidMount(): void {
      tooltipParentDidMount(this.input!, ...getFieldTooltip(this.props.instance));
      autoFocus(this.input, this);
   }

   componentDidUpdate(): void {
      autoFocus(this.input, this);
   }

   componentWillUnmount(): void {
      if (this.input == getActiveElement() && this.input.value != this.props.data.formatted) {
         this.onChange({ currentTarget: this.input } as React.SyntheticEvent<HTMLInputElement>, "blur");
      }
      tooltipParentWillUnmount(this.props.instance);
   }

   getPreCursorDigits(text: string, cursor: number, decimalSeparator: string): string {
      let res = "";
      for (let i = 0; i < cursor; i++) {
         if ("0" <= text[i] && text[i] <= "9") res += text[i];
         else if (text[i] == decimalSeparator) res += ".";
         else if (text[i] == "-") res += "-";
      }
      return res;
   }

   getLengthWithoutSuffix(text: string, decimalSeparator: string): number {
      let l = text.length;
      while (l > 0) {
         if ("0" <= text[l - 1] && text[l - 1] <= "9") break;
         if (text[l - 1] == decimalSeparator) break;
         l--;
      }
      return l;
   }

   getDecimalSeparator(format: string): string | null {
      let text = Format.value(0.11111111, format);
      for (let i = text.length - 1; i >= 0; i--) {
         if ("0" <= text[i] && text[i] <= "9") continue;
         if (text[i] == "," || text[i] == ".") return text[i];
         break;
      }
      return null;
   }

   updateCursorPosition(preCursorText: string | undefined): void {
      if (isString(preCursorText)) {
         let cursor = 0;
         let preCursor = 0;
         let text = this.input!.value || "";
         while (preCursor < preCursorText.length && cursor < text.length) {
            if (text[cursor] == preCursorText[preCursor]) {
               cursor++;
               preCursor++;
            } else {
               cursor++;
            }
         }
         this.input!.setSelectionRange(cursor, cursor);
      }
   }

   calculateIncrement(value: number, strength: number): number {
      if (value == 0) return 0.1;
      let absValue = Math.abs(value * strength);
      let log10 = Math.floor(Math.log10(absValue) + 0.001);
      let size = Math.pow(10, log10);
      if (absValue / size > 4.999) return 5 * size;
      if (absValue / size > 1.999) return 2 * size;
      return size;
   }

   onClearClick(e: React.MouseEvent): void {
      this.input!.value = "";
      let { instance } = this.props;
      instance.set("value", instance.widget.emptyValue, { immediate: true });
   }

   onKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
      let { instance } = this.props;
      if (instance.widget.handleKeyDown(e, instance) === false) return;

      switch (e.keyCode) {
         case KeyCode.enter:
            this.onChange(e, "enter");
            break;

         case KeyCode.left:
         case KeyCode.right:
            e.stopPropagation();
            break;
      }
   }

   onChange(e: React.SyntheticEvent<HTMLInputElement> | React.WheelEvent<HTMLInputElement>, change: string): void {
      let { instance, data } = this.props;
      let { widget } = instance;
      let inputValue = e.currentTarget.value;

      if (data.required) {
         instance.setState({
            empty: !inputValue,
         });
      }

      if (change == "blur" && this.state.focus) {
         this.setState({
            focus: false,
         });
      }

      let immediate = change == "blur" || change == "enter";

      if ((widget.reactOn.indexOf(change) == -1 && !immediate) || data.disabled || data.readOnly) return;

      if (immediate) instance.setState({ visited: true });

      let value = null;

      if (inputValue) {
         let displayValue = widget.parseValue(inputValue, instance);
         if (isNaN(displayValue)) {
            instance.setState({
               inputError: instance.widget.inputErrorText,
            });
            return;
         }

         value = displayValue * data.scale + data.offset;

         if (change == "wheel") {
            e.preventDefault();
            let increment =
               data.increment != null ? data.increment : this.calculateIncrement(value, data.incrementPercentage);
            let deltaY = (e as React.WheelEvent<HTMLInputElement>).deltaY;
            value = value + (deltaY < 0 ? increment : -increment);
            if (widget.snapToIncrement) {
               value = Math.round(value / increment) * increment;
            }

            if (data.minValue != null) {
               if (data.minExclusive) {
                  if (value <= data.minValue) return;
               } else {
                  value = Math.max(value, data.minValue);
               }
            }

            if (data.maxValue != null) {
               if (data.maxExclusive) {
                  if (value >= data.maxValue) return;
               } else {
                  value = Math.min(value, data.maxValue);
               }
            }
         }

         if (data.constrain) {
            if (data.minValue != null) {
               if (value < data.minValue) {
                  value = data.minValue;
               }
            }

            if (data.maxValue != null) {
               if (value > data.maxValue) {
                  value = data.maxValue;
               }
            }
         }

         let fmt = data.format;
         let decimalSeparator = this.getDecimalSeparator(fmt) || Format.value(1.1, "n;1")[1];

         let formatted = Format.value(value, fmt);
         // Re-parse to avoid differences between formatted value and value in the store

         value = widget.parseValue(formatted, instance) * data.scale + data.offset;

         // Allow users to type numbers like 100.0003 or -0.05 without interruptions
         // If the last typed character is zero or dot (decimal separator), skip processing it
         let selectionEnd = this.input!.selectionEnd;
         if (
            change == "change" &&
            this.input!.selectionStart == selectionEnd &&
            selectionEnd != null &&
            selectionEnd >= this.getLengthWithoutSuffix(this.input!.value, decimalSeparator) &&
            (inputValue[selectionEnd - 1] == decimalSeparator ||
               (inputValue.indexOf(decimalSeparator) >= 0 && inputValue[selectionEnd - 1] == "0") ||
               (selectionEnd == 2 && inputValue[0] === "-" && inputValue[1] === "0"))
         )
            return;

         if (change != "blur") {
            // Format, but keep the correct cursor position
            let preCursorText = this.getPreCursorDigits(
               this.input!.value,
               this.input!.selectionStart!,
               decimalSeparator,
            );
            this.input!.value = formatted;
            this.updateCursorPosition(preCursorText);
         } else {
            this.input!.value = formatted;
         }
      }

      instance.set("value", value, { immediate });

      instance.setState({
         inputError: false,
         visited: true,
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
}
