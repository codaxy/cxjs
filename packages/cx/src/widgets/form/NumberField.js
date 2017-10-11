import {Widget, VDOM, getContent} from '../../ui/Widget';
import {Field, getFieldTooltip, autoFocus} from './Field';
import {Format} from '../../ui/Format';
import {Culture} from '../../ui/Culture';
import {StringTemplate} from '../../data/StringTemplate';
import {tooltipParentWillReceiveProps, tooltipParentWillUnmount, tooltipMouseMove, tooltipMouseLeave, tooltipParentDidMount} from '../overlay/tooltip-ops';
import {stopPropagation, preventDefault} from '../../util/eventCallbacks';
import {Icon} from '../Icon';
import {Localization} from '../../ui/Localization';
import ClearIcon from '../icons/clear';
import {isString} from '../../util/isString';
import {isNumber} from '../../util/isNumber';
import {isDefined} from '../../util/isDefined';
import {isArray} from '../../util/isArray';

import {enableCultureSensitiveFormatting} from "../../ui/Format";
enableCultureSensitiveFormatting();

export class NumberField extends Field {

   declareData() {
      super.declareData({
         value: null,
         disabled: undefined,
         readOnly: undefined,
         enabled: undefined,
         placeholder: undefined,
         required: undefined,
         format: undefined,
         minValue: undefined,
         maxValue: undefined,
         minExclusive: undefined,
         maxExclusive: undefined,
         incrementPercentage: undefined,
         increment: undefined,
         icon: undefined
      }, ...arguments);
   }

   init() {
      if (isDefined(this.step))
         this.increment = this.step;
         
      if (isDefined(this.hideClear))
         this.showClear = !this.hideClear;

      super.init();
   }

   prepareData(context, instance) {
      let {data} = instance;
      data.formatted = Format.value(data.value, data.format);
      super.prepareData(context, instance);
   }

   formatValue(context, {data}) {
      return data.formatted;
   }
   
   validate(context, instance) {
      super.validate(context, instance);

      let {data} = instance;
      if (isNumber(data.value) && !data.error) {
         if (isNumber(data.minValue)) {
            if (data.value < data.minValue)
               data.error = StringTemplate.format(this.minValueErrorText, data.minValue);
            else if (data.value == data.minValue && data.minExclusive)
               data.error = StringTemplate.format(this.minExclusiveErrorText, data.minValue);
         }

         if (isNumber(data.maxValue)) {
            if (data.value > data.maxValue)
               data.error = StringTemplate.format(this.maxValueErrorText, data.maxValue);
            else if (data.value == data.maxValue && data.maxExclusive)
               data.error = StringTemplate.format(this.maxExclusiveErrorText, data.maxValue);
         }
      }
   }

   renderInput(context, instance, key) {
      return (
         <Input
            key={key}
            data={instance.data}
            shouldUpdate={instance.shouldUpdate}
            instance={instance}
            label={this.labelPlacement && getContent(this.renderLabel(context, instance, "label"))}
            help={this.helpPlacement && getContent(this.renderHelp(context, instance, "help"))}
         />
      )
   }
}

NumberField.prototype.baseClass = "numberfield";
NumberField.prototype.reactOn = "enter change wheel blur";
NumberField.prototype.format = 'n';
NumberField.prototype.inputType = 'text';

NumberField.prototype.maxValueErrorText = 'Enter {0:n} or less.';
NumberField.prototype.maxExclusiveErrorText = 'Enter a number less than {0:n}.';
NumberField.prototype.minValueErrorText = 'Enter {0:n} or more.';
NumberField.prototype.minExclusiveErrorText = 'Enter a number greater than {0:n}.';
NumberField.prototype.inputErrorText = 'Invalid number entered.';
NumberField.prototype.suppressErrorsUntilVisited = true;

NumberField.prototype.incrementPercentage = 0.1;
NumberField.prototype.snapToIncrement = true;
NumberField.prototype.icon = null;
NumberField.prototype.showClear = false;
NumberField.prototype.alwaysShowClear = false;

Widget.alias('numberfield', NumberField);
Localization.registerPrototype('cx/widgets/NumberField', NumberField);


class Input extends VDOM.Component {

   constructor(props) {
      super(props);
      this.state = {
         focus: false
      };
   }

   shouldComponentUpdate(props, state) {
      return props.shouldUpdate || state !== this.state;
   }

   render() {
      let {data, instance, label, help} = this.props;
      let {widget, state} = instance;
      let {CSS, baseClass, suppressErrorsUntilVisited} = widget;

      let icon = data.icon && (
            <div className={CSS.element(baseClass, 'left-icon')}>
               {
                  Icon.render(data.icon, {className: CSS.element(baseClass, 'icon')})
               }
            </div>
         );

      let insideButton;
      if (!data.readOnly && !data.disabled) {
         if (widget.showClear && (((widget.alwaysShowClear || !data.required) && data.value != null) || instance.state.inputError))
            insideButton = (
               <div className={CSS.element(baseClass, 'clear')}
                  onMouseDown={ e => e.preventDefault() }
                  onClick={ e => this.onClearClick(e) }
                  >
                  <ClearIcon className={CSS.element(baseClass, 'icon')}/>
               </div>
            );
      }

      let empty = this.input ? !this.input.value  : data.empty;

      return <div
         className={CSS.expand(data.classNames, CSS.state({
            visited: state.visited,
            focus: this.state.focus,
            icon: !!icon,
            empty: empty && !data.placeholder,
            error: data.error && (state.visited || !suppressErrorsUntilVisited || !empty)
         }))}
         style={data.style}
         onMouseDown={stopPropagation}
         onTouchStart={stopPropagation}>
         <input id={data.id}
            type={widget.inputType}
            className={CSS.element(baseClass, "input")}
            defaultValue={data.formatted}
            ref={el => {
               this.input = el
            }}
            style={data.inputStyle}
            disabled={data.disabled}
            readOnly={data.readOnly}
            placeholder={data.placeholder}
            {...data.inputAttrs}
            onMouseMove={e => tooltipMouseMove(e, ...getFieldTooltip(this.props.instance))}
            onMouseLeave={e => tooltipMouseLeave(e, ...getFieldTooltip(this.props.instance))}
            //onInput={ e => this.onChange(e, 'input') }
            onChange={ e => this.onChange(e, 'change') }
            onKeyDown={::this.onKeyDown}
            onBlur={ e => {
               this.onChange(e, 'blur')
            }}
            onFocus={ e => this.onFocus() }
            onWheel={ e => {
               this.onChange(e, 'wheel')
            }}
            onClick={stopPropagation}
         />
         {insideButton}
         {icon}
         {label}
         {help}
      </div>
   }

   componentWillReceiveProps(props) {
      let {data, state} = props.instance;
      if (this.input.value != props.data.formatted && (this.props.data.formatted != data.formatted || !state.inputError)) {
         this.input.value = props.data.formatted || '';
         props.instance.setState({
            inputError: false
         });
      }
      tooltipParentWillReceiveProps(this.input, ...getFieldTooltip(props.instance));
   }

   componentDidMount() {
      tooltipParentDidMount(this.input, ...getFieldTooltip(this.props.instance));
      autoFocus(this.input, this);
   }

   componentDidUpdate() {
      autoFocus(this.input, this);
   }

   componentWillUnmount() {
      tooltipParentWillUnmount(this.props.instance);
   }

   getPreCursorDigits(text, cursor) {
      let res = '';
      let culture = Culture.getNumberCulture();
      let decimalSeparator = culture.decimalSeparator || '.';
      for (let i = 0; i < cursor; i++) {
         if ('0' <= text[i] && text[i] <= '9')
            res += text[i];
         else if (text[i] == decimalSeparator)
            res += '.';
         else if (text[i] == '-')
            res += '-';
      }
      return res;
   }

   updateCursorPosition(preCursorText) {
      if (isString(preCursorText)) {
         var cursor = 0;
         var preCursor = 0;
         var text = this.input.value || '';
         while (preCursor < preCursorText.length && cursor < text.length) {
            if (text[cursor] == preCursorText[preCursor]) {
               cursor++;
               preCursor++;
            } else {
               cursor++;
            }
         }
         this.input.setSelectionRange(cursor, cursor);
      }
   }

   calculateIncrement(value, strength) {
      if (value == 0)
         return 0.1;

      let absValue = Math.abs(value * strength);
      let log10 = Math.floor(Math.log10(absValue) + 0.001);
      let size = Math.pow(10, log10);
      if (absValue / size > 4.999)
         return 5 * size;
      if (absValue / size > 1.999)
         return 2 * size;
      return size;
   }

   onClearClick(e) {
      this.input.value = '';
      this.props.instance.set('value', null);
   }

   onKeyDown(e) {
      let {instance} = this.props;
      if (instance.widget.handleKeyDown(e, instance) === false)
         return;

      if (e.keyCode == 13) this.onChange(e, 'enter');
   }

   onChange(e, change) {

      let {instance} = this.props;
      let {data, widget} = instance;

      if (widget.reactOn.indexOf(change) == -1 || data.disabled || data.readOnly)
         return;

      if (change == 'blur') {
         instance.setState({visited: true});
         if (this.state.focus)
            this.setState({
               focus: false
            });
      }

      if (e.target.value) {
         let v = Culture.getNumberCulture().parse(e.target.value);
         if (isNaN(v)) {
            instance.setState({
               inputError: instance.widget.inputErrorText
            });
            return;
         }

         if (change == 'wheel') {
            e.preventDefault();
            var increment = data.increment != null ? data.increment : this.calculateIncrement(v, data.incrementPercentage);
            v = v + (e.deltaY < 0 ? increment : -increment);
            if (widget.snapToIncrement) {
               v = Math.round(v / increment) * increment;
            }

            if (data.minValue != null) {
               if (data.minExclusive) {
                  if (v <= data.minValue)
                     return;
               } else {
                  v = Math.max(v, data.minValue);
               }
            }

            if (data.maxValue != null) {
               if (data.maxExclusive) {
                  if (v >= data.maxValue)
                     return;
               } else {
                  v = Math.min(v, data.maxValue);
               }
            }
         }

         var fmt = data.format;

         var formatted = Format.value(v, fmt);
         //re-parse to avoid differences between formatted value and value in the store
         var culture = Culture.getNumberCulture();
         v = culture.parse(formatted);

         if (change == 'input' && this.input.selectionStart == this.input.selectionEnd && e.target.value[this.input.selectionEnd - 1] == culture.decimalSeparator)
            return;

         if (change != 'blur'
            && (e.target.value[e.target.value.length - 1] != '.' && e.target.value[e.target.value.length - 1] != ',')
            && (e.target.value[e.target.value.length - 1] != '0'
               || e.target.value.indexOf(culture.decimalSeparator) == -1
               || (this.input.selectionStart == this.input.selectionEnd && this.input.selectionStart != e.target.value.length)
            )) {
            let preCursorText = this.getPreCursorDigits(this.input.value, this.input.selectionStart);
            this.input.value = formatted;
            this.updateCursorPosition(preCursorText);
         }

         instance.set('value', v);
      } else
         instance.set('value', null);

      instance.setState({
         inputError: false
      });
   }

   onFocus(){
      let {instance} = this.props;
      let {widget} = instance;
      if (widget.trackFocus) {
         this.setState({
            focus: true
         });
      }
   }
}

