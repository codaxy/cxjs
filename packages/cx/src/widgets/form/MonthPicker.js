import {Widget, VDOM} from '../../ui/Widget';
import {Field, getFieldTooltip} from './Field';
import {Culture} from '../../ui/Culture';
import {FocusManager, oneFocusOut, offFocusOut, preventFocusOnTouch} from '../../ui/FocusManager';
import {StringTemplate} from '../../data/StringTemplate';
import {monthStart} from '../../util/date/monthStart';
import {dateDiff} from '../../util/date/dateDiff';
import {minDate} from '../../util/date/minDate';
import {maxDate} from '../../util/date/maxDate';
import {lowerBoundCheck} from '../../util/date/lowerBoundCheck';
import {upperBoundCheck} from '../../util/date/upperBoundCheck';
import {Console} from '../../util/Console';
import {KeyCode} from '../../util/KeyCode';
import {
   tooltipParentWillReceiveProps,
   tooltipParentWillUnmount,
   tooltipMouseMove,
   tooltipMouseLeave,
   tooltipParentDidMount
} from '../overlay/Tooltip';
import {Localization} from '../../ui/Localization';
import {scrollElementIntoView} from '../../util/scrollElementIntoView';


export class MonthPicker extends Field {

   declareData() {

      let values = {};

      if (this.mode == 'range') {
         this.range = true;
         this.mode = 'edit';
         Console.warn('Please use the range flag on MonthPickers. Syntax mode="range" is deprecated.', this);
      }

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

      if (!this.range && data.value)
         data.date = monthStart(new Date(data.value));

      if (this.range) {
         if (data.from)
            data.from = monthStart(new Date(data.from));

         if (data.to)
            data.to = monthStart(new Date(data.to));
      }

      if (data.refDate)
         data.refDate = monthStart(new Date(data.refDate));

      if (data.maxValue)
         data.maxValue = monthStart(new Date(data.maxValue));

      if (data.minValue)
         data.minValue = monthStart(new Date(data.minValue));

      super.prepareData(...arguments);
   }

   validate(context, instance) {
      super.validate(context, instance);
      let {data} = instance;
      if (!data.error && data.date) {
         let d;
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
      return <MonthPickerComponent key={key}
         instance={instance}
         handleSelect={(e, date) => this.handleSelect(e, instance, date)}
         onBlur={this.onBlur}
         onFocusOut={this.onFocusOut}
         onKeyDown={this.onKeyDown}
         autoFocus={this.autoFocus}
      />
   }

   handleSelect(instance, date1, date2) {

      let {data} = instance;

      if (data.disabled)
         return;

      if (!validationCheck(date1, data))
         return;

      if (this.onBeforeSelect && this.onBeforeSelect(e, instance, date1, date2) === false)
         return;

      if (this.range) {
         instance.set('from', date1.toISOString());
         instance.set('to', date2.toISOString());
      } else
         instance.set('value', date1.toISOString());

      if (this.onSelect)
         this.onSelect(instance, date1, date2);
   }
}

MonthPicker.prototype.baseClass = "monthpicker";
MonthPicker.prototype.range = false;
MonthPicker.prototype.startYear = 1980;
MonthPicker.prototype.endYear = 2030;
MonthPicker.prototype.bufferSize = 15;

// Localization
MonthPicker.prototype.maxValueErrorText = 'Select {0:d} or before.';
MonthPicker.prototype.maxExclusiveErrorText = 'Select a date before {0:d}.';
MonthPicker.prototype.minValueErrorText = 'Select {0:d} or later.';
MonthPicker.prototype.minExclusiveErrorText = 'Select a date after {0:d}.';
Localization.registerPrototype('cx/widgets/MonthPicker', MonthPicker);

Widget.alias('month-picker', MonthPicker);

const validationCheck = (date, data) => {

   if (data.maxValue && !upperBoundCheck(date, data.maxValue, data.maxExclusive))
      return false;

   if (data.minValue && !lowerBoundCheck(date, data.minValue, data.minExclusive))
      return false;

   return true;
};

const dateNumber = (date) => {
   return date.getFullYear() * 100 + date.getMonth() + 1;
};

export class MonthPickerComponent extends VDOM.Component {

   constructor(props) {
      super(props);
      let {data, widget} = props.instance;

      let cursor = monthStart(data.refDate ? data.refDate : data.date || data.from || new Date());

      this.dom = {};

      this.state = {
         cursorYear: cursor.getFullYear(),
         cursorMonth: cursor.getMonth() + 1,
         cursorQuarter: cursor.getMonth() / 3,
         column: 'M',
         start: widget.startYear,
         end: widget.startYear + widget.bufferSize
      };
   }

   extractCursorInfo(el) {
      if (!el.attributes['data-point'].value)
         return false;
      let parts = el.attributes['data-point'].value.split('-');
      if (parts[0] != 'Y')
         return false;
      let cursor = {
         column: 'Y',
         cursorYear: Number(parts[1])
      };
      if (parts.length == 4) {
         cursor.column = parts[2];
         if (cursor.column == 'M')
            cursor.cursorMonth = Number(parts[3]);
         else
            cursor.cursorQuarter = Number(parts[3]);
      }
      return cursor;
   }

   moveCursor(e, data, options = {}) {
      e.preventDefault();
      e.stopPropagation();

      if (data.cursorYear) {
         let {startYear, endYear} = this.props.instance.widget;
         data.cursorYear = Math.max(startYear, Math.min(endYear, data.cursorYear));
      }

      this.setState(data, () => {
         if (options.ensureVisible) {
            let index = this.state.cursorYear - this.state.start;
            let tbody = this.dom.table.children[index];
            if (tbody)
               scrollElementIntoView(tbody);
         }
      });
   }

   handleKeyPress(e) {
      let {widget} = this.props.instance;
      let {cursorMonth, cursorYear, cursorQuarter, column} = this.state;

      switch (e.keyCode) {
         case KeyCode.enter:
            // if (widget.range && e.shiftKey && !this.dragStartDates) {
            //    this.handleMouseDown(e, {}, false);
            // } else {
            //    this.handleMouseUp(e);
            // }
            this.handleMouseUp(e);
            e.preventDefault();
            e.stopPropagation();
            break;

         case KeyCode.left:
            if (column == 'Y')
               this.moveCursor(e, {cursorQuarter: 3, cursorYear: cursorYear - 1, column: 'Q'});
            else if (column == 'Q')
               this.moveCursor(e, {cursorMonth: cursorQuarter * 4, column: 'M'});
            else if (column == 'M' && (cursorMonth - 1) % 3 == 0)
               this.moveCursor(e, {column: 'Y'});
            else
               this.moveCursor(e, {cursorMonth: cursorMonth - 1});
            break;

         case KeyCode.right:
            if (column == 'Y')
               this.moveCursor(e, {cursorMonth: 1, column: 'M'});
            else if (column == 'Q')
               this.moveCursor(e, {column: 'Y', cursorYear: cursorQuarter == 3 ? cursorYear + 1 : cursorYear});
            else if (column == 'M' && (cursorMonth - 1 ) % 3 == 2)
               this.moveCursor(e, {column: 'Q', cursorQuarter: Math.floor((cursorMonth - 1) / 3)});
            else
               this.moveCursor(e, {cursorMonth: cursorMonth + 1});
            break;

         case KeyCode.up:
            if (column == 'Y')
               this.moveCursor(e, {cursorYear: cursorYear - 1}, { ensureVisible: true });
            else if (column == 'Q')
               this.moveCursor(e, {
                  cursorQuarter: (cursorQuarter + 3) % 4,
                  cursorYear: cursorQuarter == 0 ? cursorYear - 1 : cursorYear
               }, { ensureVisible: true });
            else if (column == 'M')
               if (cursorMonth > 3)
                  this.moveCursor(e, {cursorMonth: cursorMonth - 3}, { ensureVisible: true });
               else
                  this.moveCursor(e, {cursorMonth: cursorMonth + 9, cursorYear: cursorYear - 1}, { ensureVisible: true });
            break;

         case KeyCode.down:
            if (column == 'Y')
               this.moveCursor(e, {cursorYear: cursorYear + 1}, { ensureVisible: true });
            else if (column == 'Q')
               this.moveCursor(e, {
                  cursorQuarter: (cursorQuarter + 1) % 4,
                  cursorYear: cursorQuarter == 3 ? cursorYear + 1 : cursorYear
               }, { ensureVisible: true });
            else if (column == 'M')
               if (cursorMonth < 10)
                  this.moveCursor(e, {cursorMonth: cursorMonth + 3}, { ensureVisible: true });
               else
                  this.moveCursor(e, {cursorMonth: cursorMonth - 9, cursorYear: cursorYear + 1}, { ensureVisible: true });
            break;

         case KeyCode.pageUp:
            this.moveCursor(e, {cursorYear: this.state.cursorYear - 1});
            break;

         case KeyCode.pageDown:
            this.moveCursor(e, {cursorYear: this.state.cursorYear + 1});
            break;

         default:
            if (this.props.onKeyDown)
               this.props.onKeyDown(e, this.props.instance);
            break;
      }
   }

   handleBlur(e) {
      FocusManager.nudge();
      if (this.props.onBlur)
         this.props.onBlur();
      this.setState({
         focused: false
      });
   }

   handleFocus(e) {
      this.setState({
         focused: true
      });
      if (this.props.onFocusOut)
         oneFocusOut(this, this.dom.el, ::this.handleFocusOut);
   }

   handleFocusOut() {
      if (this.props.onFocusOut)
         this.props.onFocusOut();
   }

   getCursorDates() {
      let {cursorMonth, cursorYear, cursorQuarter, column} = this.state;
      switch (column) {
         case 'M':
            return [new Date(cursorYear, cursorMonth - 1, 1), new Date(cursorYear, cursorMonth, 1)];

         case 'Q':
            return [new Date(cursorYear, cursorQuarter * 3, 1), new Date(cursorYear, cursorQuarter * 3 + 3, 1)];

         case 'Y':
            return [new Date(cursorYear, 0, 1), new Date(cursorYear + 1, 0, 1)];
      }
   }

   handleMouseDown(e, cursor, drag = true) {
      let {instance} = this.props;
      let {widget} = instance;

      e.stopPropagation();
      preventFocusOnTouch(e);

      if (widget.range) {
         this.dragStartDates = this.getCursorDates();
         if (drag) {
            this.setState({
               state: 'drag',
               ...cursor
            });
         } else {
            widget.handleSelect(instance, ...this.dragStartDates);
            this.moveCursor(e, cursor);
         }
      }
   }

   handleMouseUp(e) {
      let {instance} = this.props;
      let {widget, data} = instance;

      e.stopPropagation();
      e.preventDefault();

      if (widget.range) {

         let [cursorFromDate, cursorToDate] = this.getCursorDates();
         let originFromDate = cursorFromDate, originToDate = cursorToDate;
         if (this.state.state == 'drag') {
            [originFromDate, originToDate] = this.dragStartDates;
            this.setState({state: 'normal'});
         } else if (e.shiftKey) {
            if (data.from)
               originFromDate = data.from;
            if (data.to)
               originToDate = data.to;
         }
         widget.handleSelect(instance, minDate(originFromDate, cursorFromDate), maxDate(originToDate, cursorToDate));
      } else {
         let date = this.getCursorDates()[0];
         widget.handleSelect(instance, date);
      }
   }

   render() {
      let {data, widget} = this.props.instance;
      let {CSS, baseClass, startYear, endYear} = widget;

      let years = [];

      let {start, end} = this.state;

      let from = 10000, to = 0, a, b;


      if (data.date && !widget.range) {
         from = dateNumber(data.date);
         to = from + 0.1;
      } else if (widget.range) {
         if (this.state.state == 'drag') {
            let [originFromDate, originToDate] = this.dragStartDates;
            let [cursorFromDate, cursorToDate] = this.getCursorDates();
            a = Math.min(dateNumber(originFromDate), dateNumber(cursorFromDate));
            b = Math.max(dateNumber(originToDate), dateNumber(cursorToDate));
            from = Math.min(a, b);
            to = Math.max(a, b);
         } else if (data.from && data.to) {
            a = dateNumber(data.from);
            b = dateNumber(data.to);
            from = Math.min(a, b);
            to = Math.max(a, b);
         }
      }

      let monthNames = Culture.getDateTimeCulture().getMonthNames('short');

      let onMouseEnter = e => {
         let cursor = this.extractCursorInfo(e.target);
         cursor.hover = true;
         this.moveCursor(e, cursor);
      };

      let onMouseDown = e => {
         let cursor = this.extractCursorInfo(e.target);
         this.handleMouseDown(e, cursor);
      };

      let onMouseUp = e => {
         this.handleMouseUp(e);
      };

      let showCursor = this.state.hover || this.state.focused;

      for (let y = start; y <= end; y++) {
         let rows = [];
         for (let q = 0; q < 4; q++) {
            let row = [];
            if (q == 0)
               row.push(<th key="year"
                  rowSpan={4}
                  data-point={`Y-${y}`}
                  className={CSS.element(baseClass, 'year', {
                     cursor: showCursor && this.state.column == 'Y' && y == this.state.cursorYear
                  })}
                  onMouseEnter={onMouseEnter}
                  onMouseDown={onMouseDown}
                  onMouseUp={onMouseUp}
               >
                  {y}
               </th>);

            for (let i = 0; i < 3; i++) {
               let m = q * 3 + i + 1;
               row.push(<td key={`M${m}`}
                  className={CSS.state({
                     cursor: showCursor && this.state.column == 'M' && y == this.state.cursorYear && m == this.state.cursorMonth,
                     selected: y * 100 + m >= from && y * 100 + m < to
                  })}
                  data-point={`Y-${y}-M-${m}`}
                  onMouseEnter={onMouseEnter}
                  onMouseDown={onMouseDown}
                  onMouseUp={onMouseUp}
               >
                  {monthNames[m - 1].substr(0, 3)}
               </td>)
            }
            row.push(<th key={`q${q}`}
               className={CSS.state({
                  cursor: showCursor && this.state.column == 'Q' && y == this.state.cursorYear && q == this.state.cursorQuarter
               })}
               data-point={`Y-${y}-Q-${q}`}
               onMouseEnter={onMouseEnter}
               onMouseDown={onMouseDown}
               onMouseUp={onMouseUp}
            >
               {`Q${q + 1}`}
            </th>);
            rows.push(row);
         }
         years.push(rows);
      }

      return <div
         ref={el => {
            this.dom.el = el
         }}
         className={data.classNames}
         style={data.style}
         tabIndex={data.disabled ? null : 0}
         onKeyDown={e => this.handleKeyPress(e)}
         onMouseDown={e => e.stopPropagation()}
         onMouseMove={e => tooltipMouseMove(e, ...getFieldTooltip(this.props.instance))}
         onMouseLeave={::this.onMouseLeave}
         onFocus={e => this.handleFocus(e)}
         onBlur={::this.handleBlur}
         onScroll={::this.onScroll}
      >
         {this.state.yearHeight && <div style={{height: `${(start - startYear) * this.state.yearHeight}px`}}/>}
         <table ref={el => {
            this.dom.table = el
         }}>
            {
               years.map((rows, y) =>
                  <tbody key={start + y}>
                  {rows.map((cells, i) => <tr key={i}>{cells}</tr>)}
                  </tbody>
               )
            }
         </table>
         {this.state.yearHeight &&
         <div style={{height: `${Math.max(0, endYear - end) * this.state.yearHeight}px`}}/>}
      </div>;
   }

   onScroll() {
      let {startYear, endYear, bufferSize} = this.props.instance.widget;
      let visibleItems = ceil5(Math.ceil(this.dom.el.offsetHeight / this.state.yearHeight));
      let start = Math.max(startYear, startYear + floor5(Math.floor(this.dom.el.scrollTop / this.state.yearHeight)) - visibleItems);
      if (start != this.state.start && start + bufferSize <= endYear) {
         this.setState({
            start,
            end: start + 15
         });
      }
   }

   onMouseLeave(e) {
      tooltipMouseLeave(e, ...getFieldTooltip(this.props.instance));
      this.moveCursor(e, {
         hover: false
      });
   }

   componentDidMount() {
      //non-input, ok to focus on mobile
      if (this.props.autoFocus)
         this.dom.el.focus();

      tooltipParentDidMount(this.dom.el, ...getFieldTooltip(this.props.instance));
      let yearHeight = this.dom.table.scrollHeight / (this.props.instance.widget.bufferSize + 1);
      this.setState({
         yearHeight: yearHeight
      }, () => {
         let {widget, data} = this.props.instance;
         let {startYear} = widget;
         let yearCount = 1;
         if (widget.range && data.from && data.to) {
            yearCount = data.to.getFullYear() - data.from.getFullYear() + 1;
            if (data.to.getMonth() == 0 && data.to.getDate() == 1)
               yearCount--;
         }
         this.dom.el.scrollTop = (this.state.cursorYear - startYear + yearCount / 2) * this.state.yearHeight - this.dom.el.offsetHeight / 2;
      });
   }

   componentWillReceiveProps(props) {
      this.setState({
         state: 'normal'
      });
      tooltipParentWillReceiveProps(this.dom.el, ...getFieldTooltip(props.instance));
   }

   componentWillUnmount() {
      offFocusOut(this);
      tooltipParentWillUnmount(this.props.instance);
   }
}

function ceil5(x) {
   return Math.ceil(x / 5) * 5;
}

function floor5(x) {
   return Math.floor(x / 5) * 5;
}
