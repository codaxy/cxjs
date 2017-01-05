import {Widget, VDOM, getContent} from '../../ui/Widget';
import {Field} from './Field';
import {Calendar} from './Calendar';
import {Culture} from '../../ui/Culture';

import {Dropdown} from '../overlay/Dropdown';
import {StringTemplate} from '../../data/StringTemplate';
import {zeroTime} from '../../util/date/zeroTime';
import {dateDiff} from '../../util/date/dateDiff';
import {tooltipComponentWillReceiveProps, tooltipComponentWillUnmount, tooltipMouseMove, tooltipMouseLeave, tooltipComponentDidMount} from '../overlay/Tooltip';

import {Localization} from '../../ui/Localization';
import CalendarIcon from '../icons/calendar';
import {Icon} from '../Icon';
import ClearIcon from '../icons/clear';

export class DateField extends Field {

   declareData() {
      super.declareData({
         value: undefined,
         disabled: undefined,
         readOnly: undefined,
         enabled: undefined,
         placeholder: undefined,
         required: undefined,
         minValue: undefined,
         minExclusive: undefined,
         maxValue: undefined,
         maxExclusive: undefined,
         format: undefined
      }, ...arguments);
   }

   init() {
      super.init();
   }

   prepareData(context, {data}) {
      super.prepareData(...arguments);

      if (data.value) {
         var date = new Date(data.value);
         data.formatted = Culture.getDateTimeCulture().format(date, data.format);
      }

      if (data.refDate)
         data.refDate = zeroTime(new Date(data.refDate));

      if (data.maxValue)
         data.maxValue = zeroTime(new Date(data.maxValue));

      if (data.minValue)
         data.minValue = zeroTime(new Date(data.minValue));

      super.prepareData(...arguments);
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
      return <DateInput key={key}
                        instance={instance}
                        onSelect={ date => this.onSelect(instance, date) }
                        parseDate={ date => this.parseDate(date) }
                        calendar={{
                           value: this.value,
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
      return data.value ? data.formatted : null;
   }

   parseDate(date) {
      if (!date)
         return null;
      if (date instanceof Date)
         return date;
      date = Culture.getDateTimeCulture().parse(date, { useCurrentDateForDefaults: true });
      return date;
   }

   onSelect(instance, date) {

      instance.setState({
         inputError: false
      });

      instance.set('value', date ? date.toISOString() : null);
   }
}

DateField.prototype.baseClass = "datefield";
DateField.prototype.memoize = false;
DateField.prototype.maxValueErrorText = 'Selected date is after the latest allowed date of {0:d}.';
DateField.prototype.maxExclusiveErrorText = 'Selected date should be before {0:d}.';
DateField.prototype.minValueErrorText = 'Selected date is after the latest allowed date of {0:d}.';
DateField.prototype.minExclusiveErrorText = 'Selected date should be before {0:d}.';
DateField.prototype.suppressErrorTooltipsUntilVisited = true;
DateField.prototype.icon = 'calendar';
DateField.prototype.hideClear = false;

Widget.alias('datefield', DateField);

Localization.registerPrototype('Cx.ui.form.DateField', DateField);

class DateInput extends VDOM.Component {

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
         matchWidth: false,
         placementOrder: 'down-right down down-left up-right up up-left',
         touchFriendly: true,
         items: {
            type: Calendar,
            ...this.props.calendar,
            autoFocus: true,
            onFocusOut: e=> {
               this.closeDropdown(e);
            },
            onKeyDown: e=>this.onKeyDown(e),
            onSelect: (e) => {
               e.stopPropagation();
               e.preventDefault();
               this.closeDropdown(e, ()=> {
                  this.input.focus();
               });
            }
         },
         firstChildDefinesHeight: true
      };

      return this.dropdown = Widget.create(dropdown);
   }

   render() {
      var {instance} = this.props;
      var {data, store, widget} = instance;
      var {CSS, baseClass} = widget;

      var insideButton;

      if (!data.readOnly) {
         if (!widget.hideClear && !data.required && data.value != null && !data.disabled) {
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
                  onTouchStart={::this.onMouseDown}>
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
         case 13:
            e.stopPropagation();
            this.onChange(e, 'enter');
            break;

         case 27: //esc
            if (this.state.dropdownOpen) {
               e.stopPropagation();
               this.closeDropdown(e, ()=> {
                  this.input.focus();
               });
            }
            break;

         case 37:
         case 39:
              e.stopPropagation();
              break;

         case 40: //down arrow
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
      this.props.onSelect(null);
      e.stopPropagation();
      e.preventDefault();
   }

   componentWillReceiveProps(props) {
      var {data, state} = props.instance;
      if (data.formatted != this.input.value && (data.formatted != this.data.formatted || !state.inputError)) {
         this.input.value = data.formatted || '';
         props.instance.setState({
            inputError: false
         })
      }
      this.data = data;
      if (data.visited)
         this.setState({ visited: true });
      tooltipComponentWillReceiveProps(this.input, this.props.instance, this.state);
   }

   componentDidMount() {
      tooltipComponentDidMount(this.input, this.props.instance, this.state);
      if (this.props.instance.data.autoFocus)
         this.input.focus();
   }

   componentWillUnmount() {
      tooltipComponentWillUnmount(this.input);
   }

   onChange(e, eventType) {
      var date = this.props.parseDate(e.target.value);

      if (eventType == 'blur' || eventType == 'enter') {
         if (date == null)
            this.props.onSelect(null);
         else if (!isNaN(date))
            this.props.onSelect(date);
         else
            this.props.instance.setState({
               inputError: 'Invalid date entered.'
            });
      }
   }
}
