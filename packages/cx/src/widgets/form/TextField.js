import { Widget, VDOM, getContent } from "../../ui/Widget";
import { Field, getFieldTooltip } from "./Field";
import {
   tooltipParentWillReceiveProps,
   tooltipParentWillUnmount,
   tooltipMouseMove,
   tooltipMouseLeave,
   tooltipParentDidMount,
} from "../overlay/tooltip-ops";
import { stopPropagation, preventDefault } from "../../util/eventCallbacks";
import { StringTemplate } from "../../data/StringTemplate";
import { Icon } from "../Icon";
import { KeyCode } from "../../util/KeyCode";
import { Localization } from "../../ui/Localization";
import ClearIcon from "../icons/clear";
import { autoFocus } from "../autoFocus";
import { isString } from "../../util/isString";
import { getActiveElement } from "../../util/getActiveElement";

export class TextField extends Field {
   init() {
      if (typeof this.hideClear !== "undefined") this.showClear = !this.hideClear;

      if (this.alwaysShowClear) this.showClear = true;

      super.init();
   }

   declareData() {
      super.declareData(
         {
            value: this.emptyValue,
            disabled: undefined,
            readOnly: undefined,
            enabled: undefined,
            placeholder: undefined,
            required: undefined,
            minLength: undefined,
            maxLength: undefined,
            icon: undefined,
            trim: undefined,
         },
         ...arguments,
      );
   }

   renderInput(context, instance, key) {
      return (
         <Input
            key={key}
            instance={instance}
            data={instance.data}
            label={this.labelPlacement && getContent(this.renderLabel(context, instance, "label"))}
            help={this.helpPlacement && getContent(this.renderHelp(context, instance, "help"))}
            icon={this.renderIcon(context, instance, "icon")}
         />
      );
   }

   validate(context, instance) {
      super.validate(context, instance);

      let { data } = instance;

      if (!data.error && data.value) {
         if (this.validationRegExp) this.validationRegExp.lastIndex = 0;
         if (this.validationRegExp && !this.validationRegExp.test(data.value)) data.error = this.validationErrorText;
         else if (typeof data.value === "string" && data.minLength != null && data.value.length < data.minLength)
            data.error = StringTemplate.format(this.minLengthValidationErrorText, data.minLength, data.value.length);
         else if (typeof data.value === "string" && data.maxLength != null && data.value.length > data.maxLength)
            data.error = StringTemplate.format(this.maxLengthValidationErrorText, data.maxLength, data.value.length);
      }
   }
}

TextField.prototype.baseClass = "textfield";
TextField.prototype.reactOn = "change input blur enter";
TextField.prototype.inputType = "text";
TextField.prototype.validationErrorText = "The entered value is not valid.";
TextField.prototype.minLengthValidationErrorText = "Enter {[{0}-{1}]} more character(s).";
TextField.prototype.maxLengthValidationErrorText = "Use {0} characters or fewer.";
TextField.prototype.suppressErrorsUntilVisited = true;
TextField.prototype.icon = null;
TextField.prototype.showClear = false;
TextField.prototype.alwaysShowClear = false;
TextField.prototype.keyboardShortcut = false;
TextField.prototype.trim = false;

Localization.registerPrototype("cx/widgets/TextField", TextField);

class Input extends VDOM.Component {
   constructor(props) {
      super(props);
      this.state = {
         focus: false,
      };
   }

   render() {
      let { instance, data, label, help, icon: iconVDOM } = this.props;
      let { widget, state } = instance;
      let { CSS, baseClass, suppressErrorsUntilVisited } = widget;

      let icon = iconVDOM && (
         <div
            className={CSS.element(baseClass, "left-icon")}
            onMouseDown={preventDefault}
            onClick={(e) => this.onChange(e.target.value, "enter")}
         >
            {iconVDOM}
         </div>
      );

      let insideButton;
      if (
         widget.showClear &&
         !data.empty &&
         !data.readOnly &&
         !data.disabled &&
         (widget.alwaysShowClear || !data.required)
      ) {
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

      let empty = this.input ? !this.trimmed(this.input.value) : data.empty;

      return (
         <div
            className={CSS.expand(
               data.classNames,
               CSS.state({
                  visited: state.visited,
                  focus: this.state.focus,
                  icon: !!icon,
                  clear: insideButton != null,
                  empty: empty && !data.placeholder,
                  error: data.error && (state.visited || !suppressErrorsUntilVisited || !empty),
               }),
            )}
            style={data.style}
            onMouseDown={stopPropagation}
            onTouchStart={stopPropagation}
         >
            <input
               ref={(el) => {
                  this.input = el;
               }}
               className={CSS.expand(CSS.element(baseClass, "input"), data.inputClass)}
               defaultValue={data.value}
               id={data.id}
               style={data.inputStyle}
               type={widget.inputType}
               disabled={data.disabled}
               readOnly={data.readOnly}
               tabIndex={data.tabIndex}
               placeholder={data.placeholder}
               {...data.inputAttrs}
               onMouseMove={this.onMouseMove.bind(this)}
               onMouseLeave={this.onMouseLeave.bind(this)}
               onInput={(e) => this.onChange(e.target.value, "input")}
               onChange={(e) => this.onChange(e.target.value, "change")}
               onKeyDown={this.onKeyDown.bind(this)}
               onFocus={this.onFocus.bind(this)}
               onBlur={this.onBlur.bind(this)}
               onClick={stopPropagation}
            />
            {insideButton}
            {icon}
            {label}
            {help}
         </div>
      );
   }

   onFocus() {
      let { instance, data } = this.props;
      let { widget } = instance;
      if (widget.trackFocus) {
         this.setState({
            focus: true,
         });
         instance.set("focused", true);
      }
      if (data.error && data.value) instance.setState({ visited: true });
   }

   onBlur(e) {
      if (this.state.focus) {
         this.setState({
            focus: false,
         });
         this.props.instance.set("focused", false);
      }
      this.onChange(e.target.value, "blur");
   }

   onClearClick(e) {
      this.input.value = ""; // prevent onChange call with old text value on blur or component unmount
      this.props.instance.set("value", this.props.instance.widget.emptyValue, { immediate: true });
   }

   onMouseMove(e) {
      tooltipMouseMove(e, ...getFieldTooltip(this.props.instance));
   }

   onMouseLeave(e) {
      tooltipMouseLeave(e, ...getFieldTooltip(this.props.instance));
   }

   componentDidMount() {
      tooltipParentDidMount(this.input, ...getFieldTooltip(this.props.instance));
      autoFocus(this.input, this);
   }

   componentDidUpdate() {
      autoFocus(this.input, this);
   }

   componentWillUnmount() {
      if (this.input == getActiveElement() && this.input.value != this.props.data.value)
         this.onChange(this.input.value, "blur");
      tooltipParentWillUnmount(this.props.instance);
   }

   onKeyDown(e) {
      let { instance } = this.props;
      if (instance.widget.handleKeyDown(e, instance) === false) return;

      switch (e.keyCode) {
         case KeyCode.enter:
            this.onChange(e.target.value, "enter");
            break;

         case KeyCode.left:
         case KeyCode.right:
            e.stopPropagation();
            break;
      }
   }

   UNSAFE_componentWillReceiveProps(props) {
      let { data } = props;
      // The second check is required for debouncing, sometimes the value in the store lags after the input
      // and update may be caused by some other property, i.e. visited
      if (data.value != this.input.value && data.value != this.props.data.value) this.input.value = data.value || "";
      tooltipParentWillReceiveProps(this.input, ...getFieldTooltip(props.instance));
   }

   onChange(textValue, change) {
      let { instance, data } = this.props;

      let immediate = change == "blur" || change == "enter";

      if (immediate) {
         instance.setState({ visited: true });
      }

      let { widget } = instance;

      if (widget.reactOn.indexOf(change) != -1) {
         let text = this.trimmed(textValue);
         if (data.maxLength != null && text.length > data.maxLength) {
            text = text.substring(0, data.maxLength);
            this.input.value = text;
         }

         let value = text || widget.emptyValue;
         if (!instance.set("value", value, { immediate })) {
            if (text != this.input.value && immediate) this.input.value = text;
         } else {
            if (value) instance.setState({ visited: true });
         }
      }
   }

   trimmed(value) {
      if (this.props.data.trim && isString(value)) return value.trim();
      return value;
   }
}

Widget.alias("textfield", TextField);
