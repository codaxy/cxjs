import {Widget, VDOM} from '../../ui/Widget';
import {Field, getFieldTooltip} from './Field';
import {Format} from '../../ui/Format';
import {Culture} from '../../ui/Culture';
import {StringTemplate} from '../../data/StringTemplate';
import {tooltipParentWillReceiveProps, tooltipParentWillUnmount, tooltipMouseMove, tooltipMouseLeave, tooltipParentDidMount} from '../overlay/Tooltip';
import {stopPropagation, preventDefault} from '../../util/eventCallbacks';
import {Icon} from '../Icon';
import {isTouchDevice} from '../../util';
import {Localization} from '../../ui/Localization';
import ClearIcon from '../icons/clear';

export class NumberField extends Field {

   declareData() {
      super.declareData({
         value: undefined,
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
         increment: undefined
      }, ...arguments);
   }

   init() {
      if (typeof this.step != 'undefined')
         this.increment = this.step;
         
      if (typeof this.hideClear != 'undefined')
         this.showClear = !this.hideClear;

      super.init();
   }

   prepareData(context, instance) {
      super.prepareData(context, instance);
      let {data} = instance;

      data.formatted = Format.value(data.value, data.format);
   }

   formatValue(context, {data}) {
      return data.formatted;
   }
   
   validate(context, instance) {
      super.validate(context, instance);

      let {data} = instance;
      if (typeof data.value == 'number' && !data.error) {
         if (typeof data.minValue == 'number') {
            if (data.value < data.minValue)
               data.error = StringTemplate.format(this.minValueErrorText, data.minValue);
            else if (data.value == data.minValue && data.minExclusive)
               data.error = StringTemplate.format(this.minExclusiveErrorText, data.minValue);
         }

         if (typeof data.maxValue == 'number') {
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
         />
      )
   }
}

NumberField.prototype.baseClass = "numberfield";
NumberField.prototype.reactOn = "input wheel blur";
NumberField.prototype.format = 'n';
NumberField.prototype.inputType = 'text';

NumberField.prototype.maxValueErrorText = 'The number should be at most {0:n}.';
NumberField.prototype.maxExclusiveErrorText = 'The number should be less than {0:n}.';
NumberField.prototype.minValueErrorText = 'The number should be at least {0:n}.';
NumberField.prototype.minExclusiveErrorText = 'The number should be greater than {0:n}.';
NumberField.prototype.inputErrorText = 'Invalid number entered.';
NumberField.prototype.suppressErrorTooltipsUntilVisited = true;

NumberField.prototype.incrementPercentage = 0.1;
NumberField.prototype.snapToIncrement = true;
NumberField.prototype.icon = null;
NumberField.prototype.showClear = false;

Widget.alias('numberfield', NumberField);
Localization.registerPrototype('cx/widgets/NumberField', NumberField);


class Input extends VDOM.Component {

   constructor(props) {
      super(props);
      this.state = {
         visited: props.data.visited
      };
   }

   shouldComponentUpdate(props, state) {
      return props.shouldUpdate || state != this.state;
   }

   render() {
      let {data, instance} = this.props;
      let {widget} = instance;
      let {CSS, baseClass} = widget;

      let icon = widget.icon && (
            <div className={CSS.element(baseClass, 'left-icon')}>
               {
                  Icon.render(widget.icon, {className: CSS.element(baseClass, 'icon')})
               }
            </div>
         );

      let insideButton;
      if (!data.readOnly && !data.disabled) {
         if (widget.showClear && !data.required && data.value != null)
            insideButton = (
               <div className={CSS.element(baseClass, 'clear')}
                  onMouseDown={ e => e.preventDefault() }
                  onClick={ e => this.onClearClick(e) }
                  >
                  <ClearIcon className={CSS.element(baseClass, 'icon')}/>
               </div>
            );
      }

      return <div
         className={CSS.expand(data.classNames, CSS.state({
            visited: data.visited || this.state && this.state.visited,
            icon: widget.icon
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
            onMouseMove={e => tooltipMouseMove(e, ...getFieldTooltip(this.props.instance, this.state))}
            onMouseLeave={e => tooltipMouseLeave(e, ...getFieldTooltip(this.props.instance, this.state))}
            onInput={ e => this.onChange(e, 'input') }
            onChange={ e => this.onChange(e, 'change') }
            onKeyDown={ e => {
               if (e.keyCode == 13) this.onChange(e, 'enter')
            }}
            onBlur={ e => {
               this.onChange(e, 'blur')
            }}
            onWheel={ e => {
               this.onChange(e, 'wheel')
            }}
            onClick={stopPropagation}
         />
         {insideButton}
         {icon}
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
      if (data.visited)
         this.setState({visited: true});
      tooltipParentWillReceiveProps(this.input, ...getFieldTooltip(props.instance, this.state));
   }

   componentDidMount() {
      tooltipParentDidMount(this.input, ...getFieldTooltip(this.props.instance, this.state));
      if (this.props.data.autoFocus && !isTouchDevice())
         this.input.focus();
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
      if (typeof preCursorText == 'string') {
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
      this.props.instance.set('value', null);
   }

   onChange(e, change) {

      let instance = this.props.instance;
      let {data, widget} = instance;

      if (widget.reactOn.indexOf(change) == -1)
         return;

      if (change == 'blur')
         this.setState({visited: true});

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
}

