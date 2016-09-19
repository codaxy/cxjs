import {Widget, VDOM} from '../Widget';
import {Field} from './Field';
import {Format} from '../../util/Format';
import {Culture} from '../Culture';
import {StringTemplate} from '../../data/StringTemplate';
import {tooltipComponentWillReceiveProps, tooltipComponentWillUnmount, tooltipMouseMove, tooltipMouseLeave, tooltipComponentDidMount} from '../overlay/Tooltip';

import {stopPropagation} from '../eventCallbacks';

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
      super.init();
   }

   prepareData(context, instance) {
      super.prepareData(context, instance);
      var {data} = instance;

      data.formatted = Format.value(data.value, data.format);
   }

   formatValue(context, {data}) {
      return data.formatted;
   }
   
   validate(context, instance) {
      super.validate(context, instance);

      var {data} = instance;
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
      return <Input key={key+'-content'}
                    data={instance.data}
                    instance={instance}
                    inputType="text"
                    handleChange={(e, change, v) => this.handleChange(e, change, instance, v)}
      />
   }

   handleChange(e, change, instance, value) {
      if (this.reactOn.indexOf(change) != -1) {
         instance.set('value', value);
      }
   }
}

NumberField.prototype.baseClass = "numberfield";
NumberField.prototype.reactOn = "input wheel blur";
NumberField.prototype.format = 'n';

NumberField.prototype.maxValueErrorText = 'The number should be at most {0:n}.';
NumberField.prototype.maxExclusiveErrorText = 'The number should be less than {0:n}.';

NumberField.prototype.minValueErrorText = 'The number should be at least {0:n}.';
NumberField.prototype.minExclusiveErrorText = 'The number should be greater than {0:n}.';

NumberField.prototype.suppressErrorTooltipsUntilVisited = true;

NumberField.prototype.incrementPercentage = 0.1;
NumberField.prototype.snapToIncrement = true;

Widget.alias('numberfield', NumberField);


class Input extends VDOM.Component {

   constructor(props) {
      super(props);
      this.data = props.instance.data;
      this.state = {
         visited: props.instance.data.visited
      };
   }

   render() {
      var {data, widget} = this.props.instance;
      var {CSS, baseClass} = widget;

      return <div className={CSS.expand(data.classNames, CSS.state({visited: data.visited || this.state && this.state.visited}))}
                  style={data.style}
                  onMouseDown={stopPropagation}
                  onTouchStart={stopPropagation}>
         <input id={data.id}
                type={this.props.inputType}
                className={CSS.element(baseClass, "input")}
                defaultValue={data.formatted}
                ref={el=>{this.input = el}}
                style={data.inputStyle}
                disabled={data.disabled}
                readOnly={data.readOnly}
                placeholder={data.placeholder}
                onMouseMove={e=>tooltipMouseMove(e, this.props.instance, this.state)}
                onMouseLeave={e=>tooltipMouseLeave(e, this.props.instance)}
                onInput={ e => this.onChange(e, 'input') }
                onChange={ e => this.onChange(e, 'change') }
                onKeyDown={ e => { if (e.keyCode == 13) this.onChange(e, 'enter') }}
                onBlur={ e=> { this.onChange(e, 'blur') }}
                onWheel={ e=> { this.onChange(e, 'wheel') }}
                onClick={stopPropagation}
         />
      </div>
   }

   componentWillReceiveProps(props) {
      var {data, state} = props.instance;
      if (this.input.value != props.data.formatted && (this.data.formatted != data.formatted || !state.inputError)) {
         this.input.value = props.data.formatted || '';
         props.instance.setState({
            inputError: false
         });
      }
      this.data = data;
      if (data.visited)
         this.setState({ visited: true });
      tooltipComponentWillReceiveProps(this.input, props.instance, this.state);
   }

   componentDidMount() {
      tooltipComponentDidMount(this.input, this.props.instance, this.state);
      if (this.props.instance.data.autoFocus)
         this.input.focus();
   }

   componentWillUnmount() {
      tooltipComponentWillUnmount(this.input);
   }

   getPreCursorDigits(text, cursor) {
      var res = '';
      for (var i = 0; i < cursor; i++) {
         if ('0' <= text[i] && text[i] <= '9')
            res += text[i];
         else if (text[i] == '.') //TODO Read decimal separator from culture
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

      var absValue = Math.abs(value * strength);
      var log10 = Math.floor(Math.log10(absValue) + 0.001);
      var size = Math.pow(10, log10);
      if (absValue / size > 4.999)
         return 5 * size;
      if (absValue / size > 1.999)
         return 2 * size;
      return size;
   }

   onChange(e, change) {

      var instance = this.props.instance;
      var {data, widget} = instance;

      if (change == 'blur')
         this.setState({visited: true});

      if (e.target.value) {
         var v = Culture.getNumberCulture().parse(e.target.value);
         if (isNaN(v)) {
            this.props.instance.setState({
               inputError: 'Invalid number entered.'
            });
            return;
         }

         if (change == 'wheel') {
            var increment = data.increment != null ? data.increment : this.calculateIncrement(v, data.incrementPercentage);
            v = v + (e.deltaY < 0 ? increment : -increment);
            if (widget.snapToIncrement) {
               v = Math.round(v / increment) * increment;
            }
            e.preventDefault();
         }

         var fmt = data.format;

         var formatted = Format.value(v, fmt);
         //re-parse to avoid differences between formatted value and value in the store
         var culture = Culture.getNumberCulture();
         v = culture.parse(formatted);
         if (change != 'blur'
            && (e.target.value[e.target.value.length - 1] != '.' && e.target.value[e.target.value.length - 1] != ',')
            && (e.target.value[e.target.value.length - 1] != '0' || e.target.value.indexOf(culture.decimalSeparator) == '-1')) {
            var preCursorText = this.getPreCursorDigits(this.input.value, this.input.selectionStart);
            this.input.value = formatted;
            this.updateCursorPosition(preCursorText);
         }

         this.props.handleChange(e, change, v);
      } else
         this.props.handleChange(e, change, null);
   }
}

