import { DateTimeCulture } from "intl-io";
import { StringTemplate } from "../../data/StringTemplate";
import { Culture } from "../../ui";
import { Cx } from "../../ui/Cx";
import { Localization } from "../../ui/Localization";
import { VDOM, Widget, getContent } from "../../ui/Widget";
import { Console } from "../../util/Console";
import { Format } from "../../util/Format";
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
import { Dropdown } from "../overlay/Dropdown";
import {
   tooltipMouseLeave,
   tooltipMouseMove,
   tooltipParentDidMount,
   tooltipParentWillReceiveProps,
   tooltipParentWillUnmount,
} from "../overlay/tooltip-ops";
import { Field, getFieldTooltip } from "./Field";
import { MonthPicker } from "./MonthPicker";
import { getActiveElement } from "../../util/getActiveElement";

export class MonthField extends Field {
   declareData() {
      if (this.mode == "range") {
         this.range = true;
         this.mode = "edit";
         Console.warn('Please use the range flag on MonthFields. Syntax mode="range" is deprecated.', this);
      }

      let values = {};

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
         ...arguments,
      );
   }

   isEmpty(data) {
      return this.range ? data.from == null : data.value == null;
   }

   init() {
      if (!this.culture) this.culture = new DateTimeCulture(Format.culture);

      if (isDefined(this.hideClear)) this.showClear = !this.hideClear;

      if (this.alwaysShowClear) this.showClear = true;

      super.init();
   }

   prepareData(context, instance) {
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

   validateRequired(context, instance) {
      var { data } = instance;
      if (this.range) {
         if (!data.from || !data.to) return this.requiredText;
      } else return super.validateRequired(context, instance);
   }

   validate(context, instance) {
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

   renderInput(context, instance, key) {
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

   formatValue(context, { data }) {
      return data.formatted || "";
   }

   parseDate(date) {
      if (!date) return null;
      if (date instanceof Date) return date;
      date = this.culture.parse(date, { useCurrentDateForDefaults: true });
      return date;
   }

   handleSelect(instance, date1, date2) {
      let { widget } = instance;
      let encode = widget.encoding || Culture.getDefaultDateEncoding();
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

class MonthInput extends VDOM.Component {
   constructor(props) {
      super(props);
      this.props.instance.component = this;
      this.state = {
         dropdownOpen: false,
         focus: false,
      };
   }

   getDropdown() {
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
            onFocusOut: (e) => {
               this.closeDropdown(e);
            },
            onKeyDown: (e) => this.onKeyDown(e),
            onSelect: (e) => {
               let touch = isTouchEvent(e);
               this.closeDropdown(e, () => {
                  if (!touch) this.input.focus();
               });
            },
         },
         constrain: true,
         firstChildDefinesWidth: true,
      };

      return (this.dropdown = Widget.create(dropdown));
   }

   render() {
      var { instance, label, help, data, icon: iconVDOM } = this.props;
      var { widget, state } = instance;
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

      var dropdown = false;
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
               onInput={(e) => this.onChange(e.target.value, "input")}
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

   onMouseDown(e) {
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

   onFocus(e) {
      let { instance } = this.props;
      let { widget } = instance;
      if (widget.trackFocus) {
         this.setState({
            focus: true,
         });
      }
      if (this.openDropdownOnFocus) this.openDropdown(e);
   }

   onKeyDown(e) {
      let { instance } = this.props;
      if (instance.widget.handleKeyDown(e, instance) === false) return;

      switch (e.keyCode) {
         case KeyCode.enter:
            e.stopPropagation();
            this.onChange(e.target.value, "enter");
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

   onBlur(e) {
      if (!this.state.dropdownOpen) this.props.instance.setState({ visited: true });

      if (this.state.focus)
         this.setState({
            focus: false,
         });
      this.onChange(e.target.value, "blur");
   }

   closeDropdown(e, callback) {
      if (this.state.dropdownOpen) {
         if (this.scrollableParents)
            this.scrollableParents.forEach((el) => {
               el.removeEventListener("scroll", this.updateDropdownPosition);
            });

         this.props.instance.setState({ visited: true });
         this.setState({ dropdownOpen: false }, callback);
      } else if (callback) callback();
   }

   openDropdown(e) {
      var { data } = this.props.instance;
      this.openDropdownOnFocus = false;

      if (!this.state.dropdownOpen && !(data.disabled || data.readOnly)) {
         this.setState({ dropdownOpen: true });
      }
   }

   onClearClick(e) {
      e.stopPropagation();
      e.preventDefault();

      var { instance } = this.props;
      var { widget } = instance;

      widget.handleSelect(instance, null, null);
   }

   UNSAFE_componentWillReceiveProps(props) {
      var { data, state } = props.instance;
      if (data.formatted != this.input.value && (data.formatted != this.props.data.formatted || !state.inputError)) {
         this.input.value = data.formatted || "";
         props.instance.setState({
            inputError: false,
         });
      }
      tooltipParentWillReceiveProps(this.input, ...getFieldTooltip(this.props.instance));
   }

   componentDidMount() {
      tooltipParentDidMount(this.input, ...getFieldTooltip(this.props.instance));
      autoFocus(this.input, this);
   }

   componentDidUpdate() {
      autoFocus(this.input, this);
   }

   componentWillUnmount() {
      if (this.input == getActiveElement() && this.input.value != this.props.data.formatted) {
         this.onChange(this.input.value, "blur");
      }
      tooltipParentWillUnmount(this.props.instance);
   }

   onChange(inputValue, eventType) {
      var { instance } = this.props;
      var { widget } = instance;

      if (widget.reactOn.indexOf(eventType) == -1) return;

      var parts = inputValue.split("-");
      var date1 = widget.parseDate(parts[0]);
      var date2 = widget.parseDate(parts[1]) || date1;

      if ((date1 != null && isNaN(date1)) || (date2 != null && isNaN(date2))) {
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
