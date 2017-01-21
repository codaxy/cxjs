import {Widget, VDOM, getContent} from '../../ui/Widget';
import {Field} from './Field';
import {MonthPicker} from './MonthPicker';
import {DateTimeCulture} from 'intl-io';
import {Format} from '../../util/Format';
import {Dropdown} from '../overlay/Dropdown';
import {Console} from '../../util/Console';
import {StringTemplate} from '../../data/StringTemplate';
import {monthStart} from '../../util/date/monthStart';
import {dateDiff} from '../../util/date/dateDiff';
import {tooltipComponentWillReceiveProps, tooltipComponentWillUnmount, tooltipMouseMove, tooltipMouseLeave, tooltipComponentDidMount} from '../overlay/Tooltip';
import {stopPropagation} from '../../util/eventCallbacks';
import {Icon} from '../Icon';
import CalendarIcon from '../icons/calendar';
import ClearIcon from '../icons/clear';
import { KeyCode } from '../../util';
import {isTouchEvent} from '../../util/isTouchEvent';
import { isTouchDevice } from '../../util';
import {Localization} from '../../ui/Localization';

export class MonthField extends Field {

   declareData() {

      if (this.mode == 'range') {
         this.range = true;
         this.mode = 'edit';
         Console.warn('Please use the range flag on MonthFields. Syntax mode="range" is deprecated.', this);
      }

      let values = {};

      if (this.range) {
         values = {
            from: undefined,
            to: undefined
         }
      }
      else {
         values = {
            value: undefined
         }
      }

      super.declareData(values, {
         disabled: undefined,
         readOnly: undefined,
         enabled: undefined,
         placeholder: undefined,
         required: undefined,
         minValue: undefined,
         minExclusive: undefined,
         maxValue: undefined,
         maxExclusive: undefined
      }, ...arguments);
   }

   init() {
      if (!this.culture)
         this.culture = new DateTimeCulture(Format.culture);
      super.init();
   }

   prepareData(context, {data}) {
      super.prepareData(...arguments);

      let formatOptions = {
         year: 'numeric',
         month: 'short'
      };

      if (!this.range && data.value) {
         data.date = new Date(data.value);
         data.formatted = this.culture.format(data.date, formatOptions);
      }
      else if (this.range && data.from && data.to) {
         data.from = new Date(data.from);
         data.to = new Date(data.to);
         data.to.setDate(data.to.getDate() - 1);
         let fromStr = this.culture.format(data.from, formatOptions);
         let toStr = this.culture.format(data.to, formatOptions);
         if (fromStr != toStr)
            data.formatted = fromStr + ' - ' + toStr;
         else
            data.formatted = fromStr;
      }

      if (data.refDate)
         data.refDate = monthStart(new Date(data.refDate));

      if (data.maxValue)
         data.maxValue = monthStart(new Date(data.maxValue));

      if (data.minValue)
         data.minValue = monthStart(new Date(data.minValue));

      super.prepareData(...arguments);
   }

   validateRequired(context, instance) {
      var {data} = instance;
      if (this.range) {
         if (!data.from || !data.to)
            return this.requiredText;
      }
      else super.validateRequired(context, instance);
   }

   validate(context, instance) {
      super.validate(context, instance);
      var {data} = instance;
      if (!data.error && data.date) {
         var d;
         if (data.maxValue) {
            d = dateDiff(data.date, data.maxValue);
            if (d > 0)
               data.error = StringTemplate.format(this.maxValueErrorText, data.maxValue);
            else if (d == 0 && data.maxExclusive)
               data.error = StringTemplate.format(this.maxExclusiveErrorText, data.maxValue);
         }


         if (data.minValue) {
            d = dateDiff(data.date, data.minValue);
            if (d < 0)
               data.error = StringTemplate.format(this.minValueErrorText, data.minValue);
            else if (d == 0 && data.minExclusive)
               data.error = StringTemplate.format(this.minExclusiveErrorText, data.minValue);
         }
      }
   }

   renderInput(context, instance, key) {
      return <MonthInput key={key}
                         instance={instance}
                         monthPicker={{
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
                            minExclusiveErrorText: this.minExclusiveErrorText
                         }}
      />
   }

   formatValue(context, {data}) {
      return data.formatted || '';
   }

   parseDate(date) {
      if (!date)
         return null;
      if (date instanceof Date)
         return date;
      date = this.culture.parse(date, {useCurrentDateForDefaults: true});
      return date;
   }

   onSelect(instance, date1, date2) {
      instance.setState({
         inputError: false
      });

      if (this.range) {
         instance.set('from', date1 ? date1.toISOString() : null);
         instance.set('to', date2 ? date2.toISOString() : null);
      }
      else
         instance.set('value', date1 ? date1.toISOString() : null);
   }
}

MonthField.prototype.baseClass = "monthfield";
MonthField.prototype.memoize = false;
MonthField.prototype.maxValueErrorText = 'Selected date is after the latest allowed date of {0:d}.';
MonthField.prototype.maxExclusiveErrorText = 'Selected date should be before {0:d}.';
MonthField.prototype.minValueErrorText = 'Selected date is before the earliest allowed date of {0:d}.';
MonthField.prototype.minExclusiveErrorText = 'Selected date should be after {0:d}.';
MonthField.prototype.inputErrorText = 'Invalid date entered';
MonthField.prototype.suppressErrorTooltipsUntilVisited = true;
MonthField.prototype.icon = 'calendar';
MonthField.prototype.hideClear = false;
MonthField.prototype.range = false;

Localization.registerPrototype('cx/widgets/MonthField', MonthField);

Widget.alias('monthfield', MonthField);

class MonthInput extends VDOM.Component {

   constructor(props) {
      super(props);
      this.props.instance.component = this;
      var {data} = this.props.instance;
      this.data = data;
      this.state = {
         dropdownOpen: false,
         visited: data.visited
      };
   }

   getDropdown() {
      if (this.dropdown)
         return this.dropdown;

      var dropdown = {
         type: Dropdown,
         relatedElement: this.input,
         scrollTracking: true,
         inline: true,
         placementOrder: 'down down-left down-right up up-left up-right right right-up right-down left left-up left-down',
         touchFriendly: true,
         items: {
            type: MonthPicker,
            ...this.props.monthPicker,
            autoFocus: true,
            onFocusOut: e => {
               this.closeDropdown(e);
            },
            onKeyDown: e => this.onKeyDown(e),
            onSelect: (e) => {
               let touch = isTouchEvent(e);
               this.closeDropdown(e, () => {
                  if (!touch)
                     this.input.focus();
               });
            }
         },
         constrain: true,
         firstChildDefinesWidth: true
      };

      return this.dropdown = Widget.create(dropdown);
   }

   render() {
      var {instance} = this.props;
      var {data, store, widget} = instance;
      var {CSS, baseClass} = widget;

      var insideButton;

      if (!data.readOnly) {
         if (!widget.hideClear && !data.required && !data.disabled && (widget.range ? data.from != null : data.value != null)) {
            insideButton = (
               <div className={CSS.element(baseClass, 'clear')}
                    onMouseDown={e=> {
                       this.onClearClick(e);
                    }}>
                  <ClearIcon className={CSS.element(baseClass, 'icon')} />
               </div>
            )
         } else {
            insideButton = (
               <div className={CSS.element(baseClass, 'tool')}>
                  { Icon.render(widget.icon, {className: CSS.element(baseClass, 'icon')}) }
               </div>
            )
         }
      }

      var dropdown = false;
      if (this.state.dropdownOpen)
         dropdown = instance.prepareRenderCleanupChild(this.getDropdown(), store, 'dropdown', {name: 'datefield-dropdown'});

      return <div className={CSS.expand(data.classNames, CSS.state({visited: data.visited || this.state.visited}))}
                  style={data.style}
                  onMouseDown={::this.onMouseDown}
                  onTouchStart={::this.onMouseDown}
                  onClick={stopPropagation}>
         <input id={data.id}
                ref={el=>{this.input = el}}
                type="text"
                className={CSS.element(baseClass, 'input')}
                style={data.inputStyle}
                defaultValue={data.formatted}
                disabled={data.disabled}
                readOnly={data.readOnly}
                placeholder={data.placeholder}
                onInput={ e => this.onChange(e, 'input') }
                onChange={ e => this.onChange(e, 'change') }
                onKeyDown={ e => this.onKeyDown(e) }
                onBlur={ e => { this.onBlur(e) } }
                onFocus={ e => { this.onFocus(e) } }
                onMouseMove={e=>tooltipMouseMove(e, this.props.instance, this.state)}
                onMouseLeave={e=>tooltipMouseLeave(e, this.props.instance)}
         />
         { insideButton }
         { dropdown }
      </div>;
   }

   onMouseDown(e) {
      e.stopPropagation();

      if (this.state.dropdownOpen)
         this.closeDropdown(e);
      else {
         this.openDropdownOnFocus = true;
      }

      //icon click
      if (e.target != this.input) {
         e.preventDefault();
         if (!this.state.dropdownOpen)
            this.openDropdown(e);
         else
            this.input.focus();
      }
   }

   onFocus(e) {
      if (this.openDropdownOnFocus)
         this.openDropdown(e);
   }

   onKeyDown(e) {

      switch (e.keyCode) {
         case KeyCode.enter:
            e.stopPropagation();
            this.onChange(e, 'enter');
            break;

         case KeyCode.esc:
            if (this.state.dropdownOpen) {
               e.stopPropagation();
               this.closeDropdown(e, ()=> {
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
      if (!this.state.dropdownOpen)
         this.setState({visited: true});
      this.onChange(e, 'blur');
   }

   closeDropdown(e, callback) {
      if (this.state.dropdownOpen) {
         if (this.scrollableParents)
            this.scrollableParents.forEach(el => {
               el.removeEventListener('scroll', this.updateDropdownPosition)
            });

         this.setState({dropdownOpen: false, visited: true}, callback);
      }
      else if (callback)
         callback();
   }

   openDropdown(e) {
      var {data} = this.props.instance;
      this.openDropdownOnFocus = false;

      if (!this.state.dropdownOpen && !(data.disabled || data.readOnly)) {
         this.setState({dropdownOpen: true});
      }
   }

   onClearClick(e) {
      e.stopPropagation();
      e.preventDefault();

      var {instance} = this.props;
      var {widget} = instance;

      widget.onSelect(instance, null, null);
   }

   componentWillReceiveProps(props) {
      var {data, state} = props.instance;
      if (data.formatted != this.input.value && (data.formatted != this.data.formatted || !state.inputError)) {
         this.input.value = data.formatted || '';
         props.instance.setState({
            inputError: false
         });
      }
      this.data = data;
      if (data.visited)
         this.setState({ visited: true });
      tooltipComponentWillReceiveProps(this.input, this.props.instance, this.state);
   }

   componentDidMount() {
      if (this.props.instance.data.visited)
         this.setState({ visited: true });
      tooltipComponentDidMount(this.input, this.props.instance, this.state);
      if (this.props.instance.data.autoFocus && !isTouchDevice())
         this.input.focus();
   }

   componentWillUnmount() {
      tooltipComponentWillUnmount(this.input);
   }

   onChange(e, eventType) {
      var {instance} = this.props;
      var {widget} = instance;

      var parts = e.target.value.split('-');
      var date1 = widget.parseDate(parts[0]);
      var date2 = widget.parseDate(parts[1]) || date1;

      if (eventType == 'blur' || eventType == 'enter') {
         if ((date1 && isNaN(date1)) || (date2 && isNaN(date2))) {
            instance.setState({
               inputError: instance.inputErrorText
            });
         } else {
            if (date2)
               date2 = new Date(date2.getFullYear(), date2.getMonth() + 1, 1);
            widget.onSelect(instance, date1, date2);
         }
      }
   }
}
