/** @jsxImportSource react */

import * as React from "react";
import { StringTemplate } from "../../data/StringTemplate";
import { Culture } from "../../ui/Culture";
import { Cx } from "../../ui/Cx";
import type { DropdownInstance, Instance } from "../../ui/Instance";
import { Localization } from "../../ui/Localization";
import type { RenderingContext } from "../../ui/RenderingContext";
import { VDOM, Widget, getContent } from "../../ui/Widget";
import { getActiveElement, parseDateInvariant } from "../../util";
import { dateDiff } from "../../util/date/dateDiff";
import { zeroTime } from "../../util/date/zeroTime";
import { stopPropagation } from "../../util/eventCallbacks";
import { Format } from "../../util/Format";
import { isTouchDevice } from "../../util/isTouchDevice";
import { isTouchEvent } from "../../util/isTouchEvent";
import { KeyCode } from "../../util/KeyCode";
import { autoFocus } from "../autoFocus";
import ClearIcon from "../icons/clear";
import DropdownIcon from "../icons/drop-down";
import { Dropdown } from "../overlay/Dropdown";
import {
   tooltipMouseLeave,
   tooltipMouseMove,
   tooltipParentDidMount,
   tooltipParentWillReceiveProps,
   tooltipParentWillUnmount,
} from "../overlay/tooltip-ops";
import { Calendar } from "./Calendar";
import { DateTimePicker } from "./DateTimePicker";
import { Field, getFieldTooltip } from "./Field";
import { TimeList } from "./TimeList";

export class DateTimeField extends Field {
   public showClear?: boolean;
   public alwaysShowClear?: boolean;
   public hideClear?: boolean;
   public format?: string;
   public segment?: string;
   public maxValueErrorText?: string;
   public maxExclusiveErrorText?: string;
   public minValueErrorText?: string;
   public minExclusiveErrorText?: string;
   public inputErrorText?: string;
   public disabledDaysOfWeekErrorText?: string;
   public suppressErrorsUntilVisited?: boolean;
   public labelPlacement?: string;
   public helpPlacement?: string;
   public emptyValue?: unknown;
   public value?: unknown;
   public minValue?: unknown;
   public maxValue?: unknown;
   public minExclusive?: boolean;
   public maxExclusive?: boolean;
   public picker?: string;
   public partial?: boolean;
   public encoding?: (date: Date) => string;
   public disabledDaysOfWeek?: number[] | null;
   public reactOn?: string;
   public focusInputFirst?: boolean;
   public dropdownOptions?: Record<string, any>;
   public onParseInput?: string | ((date: unknown, instance: Instance) => Date | undefined);
   public autoFocus?: boolean;
   public trackFocus?: boolean;
   public showSeconds?: boolean;
   public step?: number;

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(
         {
            value: this.emptyValue,
            disabled: undefined,
            readOnly: undefined,
            enabled: undefined,
            placeholder: undefined,
            required: undefined,
            minValue: undefined,
            minExclusive: undefined,
            maxValue: undefined,
            maxExclusive: undefined,
            format: undefined,
            icon: undefined,
            autoOpen: undefined,
         },
         ...args,
      );
   }

   init(): void {
      if (typeof this.hideClear !== "undefined") this.showClear = !this.hideClear;

      if (this.alwaysShowClear) this.showClear = true;

      if (!this.format) {
         switch (this.segment) {
            case "datetime":
               this.format = "datetime;YYYYMMddhhmm";
               break;

            case "time":
               this.format = "time;hhmm";
               break;

            case "date":
               this.format = "date;yyyyMMMdd";
               break;
         }
      }
      super.init();
   }

   prepareData(context: RenderingContext, instance: Instance): void {
      let { data } = instance;
      let dropdownInstance = instance as DropdownInstance;

      if (data.value) {
         let date = parseDateInvariant(data.value);
         //  let date = new Date(data.value);

         if (isNaN(date.getTime())) data.formatted = String(data.value);
         else {
            // handle utc edge cases
            if (this.segment == "date") date = zeroTime(date);
            data.formatted = Format.value(date, data.format);
         }
         data.date = date;
      } else data.formatted = "";

      if (data.refDate) data.refDate = zeroTime(parseDateInvariant(data.refDate));

      if (data.maxValue) data.maxValue = parseDateInvariant(data.maxValue);

      if (data.minValue) data.minValue = parseDateInvariant(data.minValue);

      if (this.segment == "date") {
         if (data.minValue) data.minValue = zeroTime(data.minValue);

         if (data.maxValue) data.maxValue = zeroTime(data.maxValue);
      }

      dropdownInstance.lastDropdown = context.lastDropdown;

      super.prepareData(context, instance);
   }

   validate(context: RenderingContext, instance: Instance): void {
      super.validate(context, instance);
      let { data, widget } = instance;
      let dateTimeWidget = widget as DateTimeField;

      if (!data.error && data.date) {
         if (isNaN(data.date)) data.error = this.inputErrorText;
         else {
            let d;
            if (data.maxValue) {
               d = dateDiff(data.date, data.maxValue);
               if (d > 0) data.error = StringTemplate.format(this.maxValueErrorText!, data.maxValue);
               else if (d == 0 && data.maxExclusive)
                  data.error = StringTemplate.format(this.maxExclusiveErrorText!, data.maxValue);
            }
            if (data.minValue) {
               d = dateDiff(data.date, data.minValue);
               if (d < 0) data.error = StringTemplate.format(this.minValueErrorText!, data.minValue);
               else if (d == 0 && data.minExclusive)
                  data.error = StringTemplate.format(this.minExclusiveErrorText!, data.minValue);
            }
            if (dateTimeWidget.disabledDaysOfWeek) {
               if (dateTimeWidget.disabledDaysOfWeek.includes(data.date.getDay()))
                  data.error = this.disabledDaysOfWeekErrorText;
            }
         }
      }
   }

   renderInput(context: RenderingContext, instance: Instance, key: string | number): React.ReactNode {
      return (
         <DateTimeInput
            key={key}
            instance={instance}
            data={instance.data}
            picker={{
               value: this.value,
               minValue: this.minValue,
               maxValue: this.maxValue,
               minExclusive: this.minExclusive,
               maxExclusive: this.maxExclusive,
               maxValueErrorText: this.maxValueErrorText,
               maxExclusiveErrorText: this.maxExclusiveErrorText,
               minValueErrorText: this.minValueErrorText,
               minExclusiveErrorText: this.minExclusiveErrorText,
            }}
            label={this.labelPlacement && getContent(this.renderLabel(context, instance, "label"))}
            help={this.helpPlacement && getContent(this.renderHelp(context, instance, "help"))}
            icon={getContent(this.renderIcon(context, instance, "icon"))}
         />
      );
   }

   formatValue(context: RenderingContext, { data }: Instance): React.ReactNode {
      return data.value ? data.formatted : null;
   }

   parseDate(date: unknown, instance: Instance): Date | null {
      if (!date) return null;
      if (date instanceof Date) return date;
      if (this.onParseInput) {
         let result = instance.invoke("onParseInput", date, instance);
         if (result !== undefined) return result;
      }
      date = Culture.getDateTimeCulture().parse(date, { useCurrentDateForDefaults: true }) as Date;
      return date as Date | null;
   }
}

DateTimeField.prototype.baseClass = "datetimefield";
DateTimeField.prototype.maxValueErrorText = "Select {0:d} or before.";
DateTimeField.prototype.maxExclusiveErrorText = "Select a date before {0:d}.";
DateTimeField.prototype.minValueErrorText = "Select {0:d} or later.";
DateTimeField.prototype.minExclusiveErrorText = "Select a date after {0:d}.";
DateTimeField.prototype.inputErrorText = "Invalid date entered.";
DateTimeField.prototype.disabledDaysOfWeekErrorText = "Selected day of week is not allowed.";

DateTimeField.prototype.suppressErrorsUntilVisited = true;
DateTimeField.prototype.icon = "calendar";
DateTimeField.prototype.showClear = true;
DateTimeField.prototype.alwaysShowClear = false;
DateTimeField.prototype.reactOn = "enter blur";
DateTimeField.prototype.segment = "datetime";
DateTimeField.prototype.picker = "auto";
DateTimeField.prototype.disabledDaysOfWeek = null;
DateTimeField.prototype.focusInputFirst = false;

Widget.alias("datetimefield", DateTimeField);
Localization.registerPrototype("cx/widgets/DateTimeField", DateTimeField);

interface DateTimeInputProps {
   instance: Instance;
   data: Record<string, unknown>;
   picker: Record<string, unknown>;
   label?: React.ReactNode;
   help?: React.ReactNode;
   icon?: React.ReactNode;
}

interface DateTimeInputState {
   dropdownOpen: boolean;
   focus: boolean;
   dropdownOpenTime?: number;
}

class DateTimeInput extends VDOM.Component<DateTimeInputProps, DateTimeInputState> {
   input!: HTMLInputElement;
   dropdown?: Widget;
   scrollableParents?: Element[];
   openDropdownOnFocus: boolean = false;
   updateDropdownPosition: () => void;
   scrolling?: boolean;

   constructor(props: DateTimeInputProps) {
      super(props);
      (props.instance as any).component = this;
      this.state = {
         dropdownOpen: false,
         focus: false,
      };
      this.updateDropdownPosition = () => {};
   }

   getDropdown(): Widget {
      if (this.dropdown) return this.dropdown;

      let { widget, lastDropdown } = this.props.instance as DropdownInstance;
      let dateTimeWidget = widget as DateTimeField;

      let pickerConfig;

      switch (dateTimeWidget.picker) {
         case "calendar":
            pickerConfig = {
               type: Calendar,
               partial: dateTimeWidget.partial,
               encoding: dateTimeWidget.encoding,
               disabledDaysOfWeek: dateTimeWidget.disabledDaysOfWeek,
               focusable: !dateTimeWidget.focusInputFirst,
            };
            break;

         case "list":
            pickerConfig = {
               type: TimeList,
               style: "height: 300px",
               encoding: dateTimeWidget.encoding,
               step: dateTimeWidget.step,
               format: dateTimeWidget.format,
               scrollSelectionIntoView: true,
            };
            break;

         default:
            pickerConfig = {
               type: DateTimePicker,
               segment: dateTimeWidget.segment,
               encoding: dateTimeWidget.encoding,
               showSeconds: dateTimeWidget.showSeconds,
            };
            break;
      }

      let dropdown = {
         scrollTracking: true,
         inline: !isTouchDevice() || !!lastDropdown,
         matchWidth: false,
         placementOrder: "down down-right down-left up up-right up-left",
         touchFriendly: true,
         firstChildDefinesHeight: true,
         firstChildDefinesWidth: true,
         ...dateTimeWidget.dropdownOptions,
         type: Dropdown,
         relatedElement: this.input,
         onFocusOut: (e: unknown) => {
            this.closeDropdown(e);
         },
         onMouseDown: stopPropagation,
         items: {
            ...pickerConfig,
            ...this.props.picker,
            autoFocus: !dateTimeWidget.focusInputFirst,
            tabIndex: dateTimeWidget.focusInputFirst ? -1 : 0,
            onKeyDown: (e: React.KeyboardEvent) => this.onKeyDown(e),
            onSelect: (e: React.MouseEvent, calendar: any, date: Date) => {
               e.stopPropagation();
               e.preventDefault();
               let touch = isTouchEvent();
               this.closeDropdown(e, () => {
                  if (date) {
                     // If a blur event occurs before we re-render the input,
                     // the old input value is parsed and written to the store.
                     // We want to prevent that by eagerly updating the input value.
                     // This can happen if the date field is within a menu.
                     let newFormattedValue = Format.value(date, this.props.data.format as string);
                     this.input.value = newFormattedValue;
                  }
                  if (!touch) this.input.focus();
               });
            },
         },
      };

      return (this.dropdown = Widget.create(dropdown));
   }

   render(): React.ReactNode {
      let { instance, label, help, icon: iconVDOM } = this.props;
      let { data, widget, state } = instance;
      let { CSS, baseClass, suppressErrorsUntilVisited } = widget;
      let dateTimeWidget = widget as DateTimeField;

      let insideButton, icon;

      if (!data.readOnly && !data.disabled) {
         if (
            dateTimeWidget.showClear &&
            (((dateTimeWidget.alwaysShowClear || !data.required) && !data.empty) || instance.state?.inputError)
         )
            insideButton = (
               <div
                  className={CSS.element(baseClass, "clear")}
                  onMouseDown={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                  }}
                  onClick={(e) => this.onClearClick(e)}
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

      if (iconVDOM) {
         icon = <div className={CSS.element(baseClass, "left-icon")}>{iconVDOM}</div>;
      }

      let dropdown: React.ReactNode | undefined;
      if (this.state.dropdownOpen)
         dropdown = (
            <Cx
               widget={this.getDropdown()}
               parentInstance={instance}
               options={{ name: "datefield-dropdown" }}
               subscribe
            />
         );

      let empty = this.input ? !this.input.value : data.empty;

      return (
         <div
            className={CSS.expand(
               data.classNames,
               CSS.state({
                  visited: state?.visited,
                  focus: this.state.focus || this.state.dropdownOpen,
                  icon: !!icon,
                  empty: empty && !data.placeholder,
                  error: data.error && (state?.visited || !suppressErrorsUntilVisited || !empty),
               }),
            )}
            style={data.style as React.CSSProperties}
            onMouseDown={this.onMouseDown.bind(this)}
            onTouchStart={stopPropagation}
         >
            <input
               id={data.id as string}
               ref={(el) => {
                  this.input = el!;
               }}
               type="text"
               className={CSS.expand(CSS.element(baseClass, "input"), data.inputClass)}
               style={data.inputStyle as React.CSSProperties}
               defaultValue={data.formatted as string}
               disabled={data.disabled as boolean}
               readOnly={data.readOnly as boolean}
               tabIndex={data.tabIndex as number}
               placeholder={data.placeholder as string}
               {...(data.inputAttrs as Record<string, any>)}
               onInput={(e) => this.onChange((e.target as HTMLInputElement).value, "input")}
               onChange={(e) => this.onChange(e.target.value, "change")}
               onKeyDown={(e) => this.onKeyDown(e)}
               onBlur={(e) => {
                  this.onBlur(e);
               }}
               onFocus={(e) => {
                  this.onFocus(e);
               }}
               onMouseMove={(e) => tooltipMouseMove(e, ...getFieldTooltip(this.props.instance))}
               onMouseLeave={(e) => tooltipMouseLeave(e, ...getFieldTooltip(this.props.instance))}
            />
            {icon}
            {insideButton}
            {dropdown}
            {label}
            {help}
         </div>
      );
   }

   onMouseDown(e: React.MouseEvent): void {
      e.stopPropagation();
      let { widget } = this.props.instance;
      let dateTimeWidget = widget as DateTimeField;

      if (this.state.dropdownOpen) {
         this.closeDropdown(e);
      } else {
         this.openDropdownOnFocus = true;
      }

      //icon click
      if (e.target !== this.input) {
         e.preventDefault();

         //the field should not focus only in case when dropdown will open and autofocus
         if (dateTimeWidget.focusInputFirst || this.state.dropdownOpen) this.input.focus();

         if (this.state.dropdownOpen) this.closeDropdown(e);
         else this.openDropdown();
      }
   }

   onFocus(e: React.FocusEvent): void {
      let { instance } = this.props;
      let { widget } = instance;
      let dateTimeWidget = widget as DateTimeField;

      if (dateTimeWidget.trackFocus) {
         this.setState({
            focus: true,
         });
      }
      if (this.openDropdownOnFocus || dateTimeWidget.focusInputFirst) this.openDropdown();
   }

   onKeyDown(e: React.KeyboardEvent): void {
      let { instance } = this.props;
      if ((instance.widget as DateTimeField).handleKeyDown(e, instance) === false) return;

      switch (e.keyCode) {
         case KeyCode.enter:
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
            this.openDropdown();
            e.stopPropagation();
            e.preventDefault();
            break;
      }
   }

   onBlur(e: React.FocusEvent<HTMLInputElement>): void {
      let { widget } = this.props.instance;
      let dateTimeWidget = widget as DateTimeField;

      if (!this.state.dropdownOpen) this.props.instance.setState({ visited: true });
      else if (dateTimeWidget.focusInputFirst) this.closeDropdown(e);
      if (this.state.focus)
         this.setState({
            focus: false,
         });
      this.onChange(e.target.value, "blur");
   }

   closeDropdown(e: unknown, callback?: () => void): void {
      if (this.state.dropdownOpen) {
         if (this.scrollableParents)
            this.scrollableParents.forEach((el) => {
               el.removeEventListener("scroll", this.updateDropdownPosition);
            });

         this.setState({ dropdownOpen: false }, callback);
         this.props.instance.setState({ visited: true });
      } else if (callback) callback();
   }

   openDropdown(): void {
      let { data } = this.props.instance;
      this.openDropdownOnFocus = false;

      if (!this.state.dropdownOpen && !(data.disabled || data.readOnly)) {
         this.setState({
            dropdownOpen: true,
            dropdownOpenTime: Date.now(),
         });
      }
   }

   onClearClick(e: React.MouseEvent): void {
      this.setValue(null);
      e.stopPropagation();
      e.preventDefault();
   }

   UNSAFE_componentWillReceiveProps(props: DateTimeInputProps): void {
      let { data, state } = props.instance;
      if (data.formatted !== this.input.value && (data.formatted !== this.props.data.formatted || !state?.inputError)) {
         this.input.value = data.formatted || "";
         props.instance.setState({
            inputError: false,
         });
      }

      tooltipParentWillReceiveProps(this.input, ...getFieldTooltip(this.props.instance));
   }

   componentDidMount(): void {
      tooltipParentDidMount(this.input, ...getFieldTooltip(this.props.instance));
      autoFocus(this.input, this);
      if (this.props.data.autoOpen) this.openDropdown();
   }

   componentDidUpdate(): void {
      autoFocus(this.input, this);
   }

   componentWillUnmount(): void {
      if (this.input == getActiveElement() && this.input.value != this.props.data.formatted) {
         this.onChange(this.input.value, "blur");
      }
      tooltipParentWillUnmount(this.props.instance);
   }

   onChange(inputValue: string, eventType: string): void {
      let { instance, data } = this.props;
      let { widget } = instance;
      let dateTimeWidget = widget as DateTimeField;

      if (data.disabled || data.readOnly) return;

      if (dateTimeWidget.reactOn!.indexOf(eventType) === -1) return;

      if (eventType == "enter") instance.setState({ visited: true });

      this.setValue(inputValue, data.value);
   }

   setValue(text: string | null, baseValue?: unknown): void {
      let { instance, data } = this.props;
      let { widget } = instance;
      let dateTimeWidget = widget as DateTimeField;

      let date = dateTimeWidget.parseDate(text, instance);

      instance.setState({
         inputError: isNaN(date as any) && dateTimeWidget.inputErrorText,
      });

      if (!isNaN(date as any)) {
         let mixed = parseDateInvariant(baseValue as string);
         if (date && baseValue && !isNaN(mixed as any) && dateTimeWidget.partial) {
            switch (dateTimeWidget.segment) {
               case "date":
                  mixed.setFullYear(date!.getFullYear());
                  mixed.setMonth(date!.getMonth());
                  mixed.setDate(date!.getDate());
                  break;

               case "time":
                  mixed.setHours(date!.getHours());
                  mixed.setMinutes(date!.getMinutes());
                  mixed.setSeconds(date!.getSeconds());
                  break;

               default:
                  mixed = date;
                  break;
            }

            date = mixed;
         }

         let encode = dateTimeWidget.encoding || Culture.getDefaultDateEncoding();

         let value = date ? encode!(date!) : dateTimeWidget.emptyValue;

         if (!instance.set("value", value)) this.input.value = value ? Format.value(date!, data.format as string) : "";
      }
   }
}
