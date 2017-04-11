import {Widget, VDOM} from '../../ui/Widget';
import {Field, getFieldTooltip} from './Field';
import {Culture} from '../../ui/Culture';
import {FocusManager, oneFocusOut, offFocusOut} from '../../ui/FocusManager';
import {StringTemplate} from '../../data/StringTemplate';
import {zeroTime} from '../../util/date/zeroTime';
import {dateDiff} from '../../util/date/dateDiff';
import {lowerBoundCheck} from '../../util/date/lowerBoundCheck';
import {upperBoundCheck} from '../../util/date/upperBoundCheck';
import {sameDate} from '../../util/date/sameDate';
import {
   tooltipParentWillReceiveProps,
   tooltipParentWillUnmount,
   tooltipMouseMove,
   tooltipMouseLeave,
   tooltipParentDidMount
} from '../overlay/Tooltip';
import {KeyCode} from '../../util';
import {Localization} from '../../ui/Localization';
import ForwardIcon from '../icons/forward';
import DropdownIcon from '../icons/drop-down';

export class Calendar extends Field {

   declareData() {
      super.declareData({
         value: undefined,
         refDate: undefined,
         disabled: undefined,
         minValue: undefined,
         minExclusive: undefined,
         maxValue: undefined,
         maxExclusive: undefined
      }, ...arguments);
   }

   init() {
      super.init();
   }

   prepareData(context, {data}) {
      data.stateMods = {
         disabled: data.disabled
      };

      if (data.value)
         data.date = zeroTime(new Date(data.value));

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
      return <CalendarCmp key={key}
         instance={instance}
         handleSelect={(e, date) => this.handleSelect(e, instance, date)}
      />
   }

   handleSelect(e, instance, date) {

      var {store, data} = instance;

      e.stopPropagation();

      if (data.disabled)
         return;

      if (!validationCheck(date, data))
         return;

      if (this.onBeforeSelect && this.onBeforeSelect(e, instance, date) === false)
         return;

      instance.set('value', date.toISOString());

      if (this.onSelect)
         this.onSelect(e, instance, date);
   }
}

Calendar.prototype.baseClass = "calendar";
Calendar.prototype.highlightToday = true;
Calendar.prototype.maxValueErrorText = 'Select a date not after {0:d}.';
Calendar.prototype.maxExclusiveErrorText = 'Select a date before {0:d}.';
Calendar.prototype.minValueErrorText = 'Select a date not before {0:d}.';
Calendar.prototype.minExclusiveErrorText = 'Select a date after {0:d}.';
Calendar.prototype.suppressErrorsUntilVisited = false;

Localization.registerPrototype('cx/widgets/Calendar', Calendar);

const validationCheck = (date, data) => {

   if (data.maxValue && !upperBoundCheck(date, data.maxValue, data.maxExclusive))
      return false;

   if (data.minValue && !lowerBoundCheck(date, data.minValue, data.minExclusive))
      return false;

   return true;
};

export class CalendarCmp extends VDOM.Component {

   constructor(props) {
      super(props);
      var {data} = props.instance;

      var refDate = data.refDate ? data.refDate : data.date || zeroTime(new Date());

      this.state = Object.assign({
         hover: false,
         focus: false,
         cursor: zeroTime(data.date || refDate),
      }, this.getPage(refDate))

      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseDown = this.handleMouseDown.bind(this);
   }

   getPage(refDate) {
      refDate = zeroTime(refDate); //make a copy
      var monthDate = new Date(refDate.getFullYear(), refDate.getMonth(), 1);

      var startDate = new Date(monthDate);
      startDate.setDate(1 - startDate.getDay());

      var endDate = new Date(monthDate);
      endDate.setMonth(monthDate.getMonth() + 1);
      endDate.setDate(endDate.getDate() - 1);
      endDate.setDate(endDate.getDate() + 6 - endDate.getDay());

      return {
         refDate,
         startDate,
         endDate
      }
   }

   moveCursor(e, date, options = {}) {
      e.preventDefault();
      e.stopPropagation();

      date = zeroTime(date);
      if (date.getTime() == this.state.cursor.getTime())
         return;

      var refDate = this.state.refDate;

      if (options.movePage || date < this.state.startDate || date > this.state.endDate)
         refDate = date;

      this.setState({
         ...this.getPage(refDate),
         cursor: date
      });
   }

   move(e, period, delta) {
      e.preventDefault();
      e.stopPropagation();

      var refDate = this.state.refDate;

      switch (period) {
         case 'y':
            refDate.setFullYear(refDate.getFullYear() + delta);
            break;

         case 'm':
            refDate.setMonth(refDate.getMonth() + delta);
            break;
      }

      var page = this.getPage(refDate);
      if (this.state.cursor < page.startDate)
         page.cursor = page.startDate;
      else if (this.state.cursor > page.endDate)
         page.cursor = page.endDate;

      this.setState(page);
   }

   handleKeyPress(e) {

      var cursor = new Date(this.state.cursor);

      switch (e.keyCode) {
         case KeyCode.enter:
            this.props.handleSelect(e, this.state.cursor);
            break;

         case KeyCode.left:
            cursor.setDate(cursor.getDate() - 1);
            this.moveCursor(e, cursor);
            break;

         case KeyCode.right:
            cursor.setDate(cursor.getDate() + 1);
            this.moveCursor(e, cursor);
            break;

         case KeyCode.up:
            cursor.setDate(cursor.getDate() - 7);
            this.moveCursor(e, cursor);
            break;

         case KeyCode.down:
            cursor.setDate(cursor.getDate() + 7);
            this.moveCursor(e, cursor);
            break;

         case KeyCode.pageUp:
            cursor.setMonth(cursor.getMonth() - 1);
            this.moveCursor(e, cursor, {movePage: true});
            break;

         case KeyCode.pageDown:
            cursor.setMonth(cursor.getMonth() + 1);
            this.moveCursor(e, cursor, {movePage: true});
            break;

         case KeyCode.home:
            cursor.setDate(1);
            this.moveCursor(e, cursor, {movePage: true});
            break;

         case KeyCode.end:
            cursor.setMonth(cursor.getMonth() + 1);
            cursor.setDate(0);
            this.moveCursor(e, cursor, {movePage: true});
            break;

         default:
            let {widget} = this.props.instance;
            if (widget.onKeyDown)
               widget.onKeyDown(e, this.props.instance);
            break;
      }
   }

   handleWheel(e) {
      e.preventDefault();
      e.stopPropagation();

      var cursor = new Date(this.state.cursor);

      if (e.deltaY < 0) {
         cursor.setMonth(cursor.getMonth() - 1)
         this.moveCursor(e, cursor, {movePage: true});
      }
      else if (e.deltaY > 0) {
         cursor.setMonth(cursor.getMonth() + 1)
         this.moveCursor(e, cursor, {movePage: true});
      }
   }

   handleBlur(e) {
      FocusManager.nudge();
      let {widget} = this.props.instance;
      if (widget.onBlur)
         widget.onBlur();
      this.setState({
         focus: false
      });
   }

   handleFocus(e) {
      oneFocusOut(this, this.el, ::this.handleFocusOut);
      this.setState({
         focus: true
      });
   }

   handleFocusOut() {
      let {widget} = this.props.instance;
      if (widget.onFocusOut)
         widget.onFocusOut();
   }

   handleMouseLeave(e) {
      tooltipMouseLeave(e, ...getFieldTooltip(this.props.instance));
      this.setState({
         hover: false
      });
   }

   handleMouseEnter(e) {
      this.setState({
         hover: true
      });
   }

   handleMouseMove(e) {
      this.moveCursor(e, new Date(e.target.dataset.date));
   }

   handleMouseDown(e){
      this.props.handleSelect(e, new Date(e.target.dataset.date));
   }

   componentDidMount() {
      //calendar doesn't bring up keyboard so it's ok to focus it even on mobile
      if (this.props.instance.widget.autoFocus)
         this.el.focus();

      tooltipParentDidMount(this.el, ...getFieldTooltip(this.props.instance));
   }

   componentWillReceiveProps(props) {
      var {data} = props.instance;
      if (data.date)
         this.setState({
            ...this.getPage(data.date),
            value: data.date
         });

      tooltipParentWillReceiveProps(this.el, ...getFieldTooltip(props.instance));
   }

   componentWillUnmount() {
      offFocusOut(this);
      tooltipParentWillUnmount(this.props.instance);
   }

   render() {
      var {data, widget} = this.props.instance;
      var {CSS, baseClass} = widget;

      var refDate = this.state.refDate;

      var month = refDate.getMonth();
      var year = refDate.getFullYear();

      var startDate = new Date(year, month, 1);
      startDate.setDate(1 - startDate.getDay());

      var weeks = [];
      var date = startDate;

      var today = zeroTime(new Date());

      while (date < refDate || date.getMonth() == month) {
         let days = [];
         for (var i = 0; i < 7; i++) {
            let unselectable = !validationCheck(date, data);
            let classNames = CSS.state({
               outside: month != date.getMonth(),
               unselectable: unselectable,
               selected: data.date && sameDate(data.date, date),
               cursor: (this.state.hover || this.state.focus) && (this.state.cursor && sameDate(this.state.cursor, date)),
               today: widget.highlightToday && sameDate(date, today)
            });
            let dateInst = new Date(date);
            days.push(<td key={i}
               className={classNames}
               data-date={`${dateInst.getFullYear()}-${dateInst.getMonth()+1}-${dateInst.getDate()}`}
               onMouseMove={ unselectable ? null : this.handleMouseMove }
               onMouseDown={ unselectable ? null : this.handleMouseDown }>
               {date.getDate()}</td>);
            date.setDate(date.getDate() + 1);
         }
         weeks.push(<tr key={weeks.length} className={CSS.element(baseClass, 'week')}>
            <td/>
            {days}
            <td />
         </tr>);
      }

      var culture = Culture.getDateTimeCulture();
      var monthNames = culture.getMonthNames('long');
      var dayNames = culture.getWeekdayNames('short').map(x => x.substr(0, 2));

      return <div className={data.classNames}
         tabIndex={data.disabled ? null : 0}
         onKeyDown={e => this.handleKeyPress(e)}
         onMouseDown={e => e.stopPropagation()}
         ref={el => {
            this.el = el
         }}
         onMouseMove={e => tooltipMouseMove(e, ...getFieldTooltip(this.props.instance))}
         onMouseLeave={e => this.handleMouseLeave(e)}
         onMouseEnter={e => this.handleMouseEnter(e)}
         onWheel={e => this.handleWheel(e)}
         onFocus={e => this.handleFocus(e)}
         onBlur={e => this.handleBlur(e)}
      >
         <table>
            <thead>
            <tr key="h" className={CSS.element(baseClass, 'header')}>
               <td />
               <td onClick={e => this.move(e, 'y', -1)}>
                  <ForwardIcon className={CSS.element(baseClass, 'icon-prev-year')}/>
               </td>
               <td onClick={e => this.move(e, 'm', -1)}>
                  <DropdownIcon className={CSS.element(baseClass, 'icon-prev-month')}/>
               </td>
               <th
                  className={CSS.element(baseClass, 'display')}
                  colSpan="3"
               >
                  {monthNames[month]}<br/>
                  {year}
               </th>
               <td onClick={e => this.move(e, 'm', +1)}>
                  <DropdownIcon className={CSS.element(baseClass, 'icon-next-month')}/>
               </td>
               <td onClick={e => this.move(e, 'y', +1)}>
                  <ForwardIcon className={CSS.element(baseClass, 'icon-next-year')}/>
               </td>
               <td />
            </tr>
            <tr key="d" className={CSS.element(baseClass, 'day-names')}>
               <td />
               {dayNames.map((name, i) => <th key={i}>{name}</th>)}
               <td />
            </tr>
            </thead>
            <tbody>
            {weeks}
            </tbody>
         </table>
      </div>;
   }
}

Widget.alias('calendar', Calendar);