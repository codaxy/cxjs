/**@jsxImportSource react */

// @ts-expect-error
import { DateTimeCulture } from "intl-io";
import { StringTemplate } from "../../data/StringTemplate";
import { Culture } from "../../ui";
import { Cx } from "../../ui/Cx";
import { Localization } from "../../ui/Localization";
import { VDOM, Widget, getContent } from "../../ui/Widget";
import { Console } from "../../util/Console";
import { KeyCode } from "../../util/KeyCode";
import { dateDiff } from "../../util/date/dateDiff";
import { parseDateInvariant } from "../../util";
import { monthStart } from "../../util/date/monthStart";
import { stopPropagation } from "../../util/eventCallbacks";
import { isDefined } from "../../util/isDefined";
import { isTouchDevice } from "../../util/isTouchDevice";
import { isTouchEvent } from "../../util/isTouchEvent";
import { autoFocus } from "../autoFocus";
import ClearIcon from "../icons/clear";
import DropdownIcon from "../icons/drop-down";
import { Dropdown, DropdownConfig } from "../overlay/Dropdown";
import {
   tooltipMouseLeave,
   tooltipMouseMove,
   tooltipParentDidMount,
   tooltipParentWillReceiveProps,
   tooltipParentWillUnmount,
} from "../overlay/tooltip-ops";
import { Field, getFieldTooltip, FieldInstance, FieldConfig } from "./Field";
import { MonthPicker } from "./MonthPicker";
import { getActiveElement } from "../../util/getActiveElement";
import type { RenderingContext } from "../../ui/RenderingContext";
import type { Instance, DropdownWidgetProps } from "../../ui/Instance";
import type { Config, Prop, BooleanProp, StringProp } from "../../ui/Prop";

export class MonthFieldInstance<F extends MonthField = MonthField>
   extends FieldInstance<F>
   implements DropdownWidgetProps
{
   lastDropdown?: Instance;
   dropdownOpen?: boolean;
   selectedIndex?: number;
   component?: any;
}

export interface MonthFieldConfig extends FieldConfig {
   /** Selected month. This should be a Date object or a valid date string consumable by Date.parse function. */
   value?: Prop<string | Date>;

   /** Set to `true` to allow range select. */
   range?: BooleanProp;

   /** Start of the selected month range. Used only if `range` is set to `true`. */
   from?: Prop<string | Date>;

   /** End of the selected month range. Used only if `range` is set to `true`. */
   to?: Prop<string | Date>;

   /** Defaults to `false`. Used to make the field read-only. */
   readOnly?: BooleanProp;

   /** The opposite of `disabled`. */
   enabled?: BooleanProp;

   /** Default text displayed when the field is empty. */
   placeholder?: StringProp;

   /** Minimum date value. */
   minValue?: Prop<string | Date>;

   /** Set to `true` to disallow the `minValue`. Default value is `false`. */
   minExclusive?: BooleanProp;

   /** Maximum date value. */
   maxValue?: Prop<string | Date>;

   /** Set to `true` to disallow the `maxValue`. Default value is `false`. */
   maxExclusive?: BooleanProp;

   /** String representing culture. Default is `en`. */
   culture?: string;

   /** Set to `true` to hide the clear button. Default value is `false`. */
   hideClear?: boolean;

   /** Base CSS class to be applied on the field. Defaults to `monthfield`. */
   baseClass?: string;

   /** Maximum value error text. */
   maxValueErrorText?: string;

   /** Maximum exclusive value error text. */
   maxExclusiveErrorText?: string;

   /** Minimum value error text. */
   minValueErrorText?: string;

   /** Minimum exclusive value error text. */
   minExclusiveErrorText?: string;

   /** Invalid input error text. */
   inputErrorText?: string;

   /** Name or configuration of the icon to be put on the left side of the input. */
   icon?: StringProp | Config;

   /** Set to `false` to hide the clear button. Default value is `true`. */
   showClear?: boolean;

   /** Set to `true` to display the clear button even if `required` is set. Default is `false`. */
   alwaysShowClear?: boolean;

   /** The function that will be used to convert Date objects before writing data to the store. */
   encoding?: (date: Date) => any;

   /** Additional configuration to be passed to the dropdown. */
   dropdownOptions?: Partial<DropdownConfig>;

   /** A boolean flag that determines whether the `to` date is included in the range. */
   inclusiveTo?: boolean;

   /** Optional configuration options for the MonthPicker component rendered within the dropdown. */
   monthPickerOptions?: Config;
}

export class MonthField<Config extends MonthFieldConfig = MonthFieldConfig> extends Field<Config, MonthFieldInstance> {
   declare public baseClass: string;
   declare public mode?: string;
   declare public range?: BooleanProp;
   declare public from?: Prop<string | Date>;
   declare public to?: Prop<string | Date>;
   declare public value?: Prop<string | Date>;
   declare public culture: DateTimeCulture;
   declare public hideClear?: boolean;
   declare public showClear?: boolean;
   declare public alwaysShowClear?: boolean;
   declare public encoding?: (date: Date) => string;
   declare public dropdownOptions?: Partial<DropdownConfig>;
   declare public inclusiveTo?: boolean;
   declare public monthPickerOptions?: Record<string, any>;
   declare public maxValueErrorText: string;
   declare public maxExclusiveErrorText: string;
   declare public minValueErrorText: string;
   declare public minExclusiveErrorText: string;
   declare public inputErrorText?: string;
   declare public minExclusive?: BooleanProp;
   declare public maxExclusive?: BooleanProp;
   declare public minValue?: Prop<string | Date>;
   declare public maxValue?: Prop<string | Date>;
   declare public placeholder?: StringProp;
   declare public reactOn: string;

   declareData(...args: Record<string, unknown>[]): void {
      if (this.mode == "range") {
         this.range = true;
         this.mode = "edit";
         Console.warn('Please use the range flag on MonthFields. Syntax mode="range" is deprecated.', this);
      }

      let values: Record<string, unknown> = {};

      if (this.range) {
         values = {
            from: null,
            to: null,
         };
      } else {
         values = {
            value: this.emptyValue,
         };
      }

      super.declareData(
         values,
         {
            disabled: undefined,
            readOnly: undefined,
            enabled: undefined,
            placeholder: undefined,
            required: undefined,
            minValue: undefined,
            minExclusive: undefined,
            maxValue: undefined,
            maxExclusive: undefined,
            icon: undefined,
         },
         ...args,
      );
   }

   isEmpty(data: Record<string, unknown>): boolean {
      return this.range ? data.from == null : data.value == null;
   }

   init(): void {
      if (!this.culture) this.culture = Culture.getDateTimeCulture();

      if (isDefined(this.hideClear)) this.showClear = !this.hideClear;

      if (this.alwaysShowClear) this.showClear = true;

      super.init();
   }

   prepareData(context: RenderingContext, instance: MonthFieldInstance): void {
      super.prepareData(context, instance);

      let { data } = instance;

      let formatOptions = {
         year: "numeric",
         month: "short",
      };

      if (!this.range && data.value) {
         data.date = parseDateInvariant(data.value);
         data.formatted = this.culture.format(data.date, formatOptions);
      } else if (this.range && data.from && data.to) {
         data.from = parseDateInvariant(data.from);
         data.to = parseDateInvariant(data.to);
         if (!this.inclusiveTo) data.to.setDate(data.to.getDate() - 1);
         let fromStr = this.culture.format(data.from, formatOptions);
         let toStr = this.culture.format(data.to, formatOptions);
         if (fromStr != toStr) data.formatted = fromStr + " - " + toStr;
         else data.formatted = fromStr;
      }

      if (data.refDate) data.refDate = monthStart(parseDateInvariant(data.refDate));

      if (data.maxValue) data.maxValue = monthStart(parseDateInvariant(data.maxValue));

      if (data.minValue) data.minValue = monthStart(parseDateInvariant(data.minValue));

      instance.lastDropdown = context.lastDropdown;
   }

   validateRequired(context: RenderingContext, instance: MonthFieldInstance): string | undefined {
      const { data } = instance;
      if (this.range) {
         if (!data.from || !data.to) return this.requiredText;
      } else return super.validateRequired(context, instance);
   }

   validate(context: RenderingContext, instance: MonthFieldInstance): void {
      super.validate(context, instance);
      var { data } = instance;
      if (!data.error && data.date) {
         var d;
         if (data.maxValue) {
            d = dateDiff(data.date, data.maxValue);
            if (d > 0) data.error = StringTemplate.format(this.maxValueErrorText, data.maxValue);
            else if (d == 0 && data.maxExclusive)
               data.error = StringTemplate.format(this.maxExclusiveErrorText, data.maxValue);
         }

         if (data.minValue) {
            d = dateDiff(data.date, data.minValue);
            if (d < 0) data.error = StringTemplate.format(this.minValueErrorText, data.minValue);
            else if (d == 0 && data.minExclusive)
               data.error = StringTemplate.format(this.minExclusiveErrorText, data.minValue);
         }
      }
   }

   renderInput(context: RenderingContext, instance: MonthFieldInstance, key: string): React.ReactNode {
      return (
         <MonthInput
            key={key}
            data={instance.data}
            instance={instance}
            monthPicker={{
               ...this.monthPickerOptions,
               value: this.value,
               from: this.from,
               to: this.to,
               range: this.range,
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
            icon={this.renderIcon(context, instance, "icon")}
         />
      );
   }

   formatValue(context: RenderingContext, instance: Instance): string {
      return instance.data.formatted || "";
   }

   parseDate(date: string | Date | null): Date | null {
      if (!date) return null;
      if (date instanceof Date) return date;
      let parsed = this.culture.parse(date, { useCurrentDateForDefaults: true });
      return parsed;
   }

   handleSelect(instance: MonthFieldInstance, date1: Date | null, date2: Date | null): void {
      let { widget } = instance;
      let encode = widget.encoding ?? Culture.getDefaultDateEncoding();
      instance.setState({
         inputError: false,
      });
      if (this.range) {
         let d1 = date1 ? encode(date1) : this.emptyValue;
         let toDate = date2;
         if (date2 && this.inclusiveTo) {
            toDate = new Date(date2);
            toDate.setDate(toDate.getDate() - 1);
         }
         let d2 = toDate ? encode(toDate) : this.emptyValue;
         instance.set("from", d1);
         instance.set("to", d2);
      } else {
         let value = date1 ? encode(date1) : this.emptyValue;
         instance.set("value", value);
      }
   }
}

MonthField.prototype.baseClass = "monthfield";
MonthField.prototype.maxValueErrorText = "Select {0:d} or before.";
MonthField.prototype.maxExclusiveErrorText = "Select a date before {0:d}.";
MonthField.prototype.minValueErrorText = "Select {0:d} or later.";
MonthField.prototype.minExclusiveErrorText = "Select a date after {0:d}.";
MonthField.prototype.inputErrorText = "Invalid date entered";
MonthField.prototype.suppressErrorsUntilVisited = true;
MonthField.prototype.icon = "calendar";
MonthField.prototype.showClear = true;
MonthField.prototype.alwaysShowClear = false;
MonthField.prototype.range = false;
MonthField.prototype.reactOn = "enter blur";
MonthField.prototype.inclusiveTo = false;

Localization.registerPrototype("cx/widgets/MonthField", MonthField);

Widget.alias("monthfield", MonthField);

interface MonthInputProps {
   instance: MonthFieldInstance;
   data: Record<string, any>;
   monthPicker: Record<string, any>;
   label?: React.ReactNode;
   help?: React.ReactNode;
   icon?: React.ReactNode;
}

interface MonthInputState {
   dropdownOpen: boolean;
   focus: boolean;
}

class MonthInput extends VDOM.Component<MonthInputProps, MonthInputState> {
   input?: HTMLInputElement | null;
   dropdown?: Widget;
   openDropdownOnFocus: boolean = false;
   scrollableParents?: Element[];
   updateDropdownPosition: () => void = () => {};

   constructor(props: MonthInputProps) {
      super(props);
      this.props.instance.component = this;
      this.state = {
         dropdownOpen: false,
         focus: false,
      };
   }

   getDropdown(): Widget {
      if (this.dropdown) return this.dropdown;

      let { widget, lastDropdown } = this.props.instance;

      var dropdown = {
         scrollTracking: true,
         inline: !isTouchDevice() || !!lastDropdown,
         placementOrder:
            "down down-left down-right up up-left up-right right right-up right-down left left-up left-down",
         touchFriendly: true,
         ...widget.dropdownOptions,
         type: Dropdown,
         relatedElement: this.input,
         items: {
            type: MonthPicker,
            ...this.props.monthPicker,
            encoding: widget.encoding,
            inclusiveTo: widget.inclusiveTo,
            autoFocus: true,
            onFocusOut: (e: React.MouseEvent) => {
               this.closeDropdown(e);
            },
            onKeyDown: (e: React.KeyboardEvent) => this.onKeyDown(e),
            onSelect: (e: React.MouseEvent) => {
               let touch = isTouchEvent();
               this.closeDropdown(e, () => {
                  if (!touch) this.input!.focus();
               });
            },
         },
         constrain: true,
         firstChildDefinesWidth: true,
      };

      return (this.dropdown = Widget.create(dropdown));
   }

   render(): React.ReactNode {
      const { instance, label, help, data, icon: iconVDOM } = this.props;
      const { widget, state } = instance;
      var { CSS, baseClass, suppressErrorsUntilVisited } = widget;

      let insideButton, icon;

      if (!data.readOnly && !data.disabled) {
         if (
            widget.showClear &&
            (((widget.alwaysShowClear || !data.required) && !data.empty) || instance.state.inputError)
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

      if (iconVDOM) {
         icon = <div className={CSS.element(baseClass, "left-icon")}>{iconVDOM}</div>;
      }

      var dropdown: React.ReactElement | false = false;
      if (this.state.dropdownOpen)
         dropdown = (
            <Cx
               widget={this.getDropdown()}
               parentInstance={instance}
               options={{ name: "monthfield-dropdown" }}
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
                  icon: !!icon,
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
                  this.input = el;
               }}
               type="text"
               className={CSS.expand(CSS.element(baseClass, "input"), data.inputClass)}
               style={data.inputStyle}
               defaultValue={data.formatted}
               disabled={data.disabled}
               readOnly={data.readOnly}
               tabIndex={data.tabIndex}
               placeholder={data.placeholder}
               onInput={(e) => this.onChange((e.target as HTMLInputElement).value, "input")}
               onChange={(e) => this.onChange((e.target as HTMLInputElement).value, "change")}
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

      if (this.state.dropdownOpen) this.closeDropdown(e);
      else {
         this.openDropdownOnFocus = true;
      }

      //icon click
      if (e.target != this.input) {
         e.preventDefault();
         if (!this.state.dropdownOpen) this.openDropdown(e);
         else this.input!.focus();
      }
   }

   onFocus(e: React.FocusEvent): void {
      let { instance } = this.props;
      let { widget } = instance;
      if (widget.trackFocus) {
         this.setState({
            focus: true,
         });
      }
      if (this.openDropdownOnFocus) this.openDropdown(e);
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
                  this.input!.focus();
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
      if (!this.state.dropdownOpen) this.props.instance.setState({ visited: true });

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

         this.props.instance.setState({ visited: true });
         this.setState({ dropdownOpen: false }, callback);
      } else if (callback) callback();
   }

   openDropdown(e?: React.KeyboardEvent | React.MouseEvent | React.FocusEvent): void {
      const { data } = this.props.instance;
      this.openDropdownOnFocus = false;

      if (!this.state.dropdownOpen && !(data.disabled || data.readOnly)) {
         this.setState({ dropdownOpen: true });
      }
   }

   onClearClick(e: React.MouseEvent): void {
      e.stopPropagation();
      e.preventDefault();

      const { instance } = this.props;
      const { widget } = instance;

      widget.handleSelect(instance, null, null);
   }

   UNSAFE_componentWillReceiveProps(props: MonthInputProps): void {
      const { data, state } = props.instance;
      if (data.formatted != this.input!.value && (data.formatted != this.props.data.formatted || !state.inputError)) {
         this.input!.value = data.formatted || "";
         props.instance.setState({
            inputError: false,
         });
      }
      tooltipParentWillReceiveProps(this.input!, ...getFieldTooltip(this.props.instance));
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
         this.onChange(this.input.value, "blur");
      }
      tooltipParentWillUnmount(this.props.instance);
   }

   onChange(inputValue: string, eventType: string): void {
      const { instance } = this.props;
      const { widget } = instance;

      if (widget.reactOn.indexOf(eventType) == -1) return;

      var parts = inputValue.split("-");
      var date1 = widget.parseDate(parts[0]);
      var date2 = widget.parseDate(parts[1]) || date1;

      if ((date1 != null && isNaN(date1.getTime())) || (date2 != null && isNaN(date2.getTime()))) {
         instance.setState({
            inputError: widget.inputErrorText,
         });
      } else if (eventType == "blur" || eventType == "enter") {
         if (date2) date2 = new Date(date2.getFullYear(), date2.getMonth() + 1, 1);
         instance.setState({
            visited: true,
         });
         widget.handleSelect(instance, date1, date2);
      }
   }
}
