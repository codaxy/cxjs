import {Widget, VDOM} from '../Widget';
import {Field} from './Field';
import {Culture} from '../Culture';
import {FocusManager, oneFocusOut, offFocusOut} from '../FocusManager';
import {isFocused} from '../../util/DOM';
import {StringTemplate} from '../../data/StringTemplate';
import {monthStart} from '../../util/date/monthStart';
import {dateDiff} from '../../util/date/dateDiff';
import {minDate} from '../../util/date/minDate';
import {maxDate} from '../../util/date/maxDate';
import {lowerBoundCheck} from '../../util/date/lowerBoundCheck';
import {upperBoundCheck} from '../../util/date/upperBoundCheck';
import {Console} from '../../util/Console';
import {KeyCode} from '../../util/KeyCode';
import {tooltipComponentWillReceiveProps, tooltipComponentWillUnmount, tooltipMouseMove, tooltipMouseLeave, tooltipComponentDidMount} from '../overlay/Tooltip';

export class MonthPicker extends Field {

   declareData() {

      var values = {};

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

      var {data} = instance;

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
MonthPicker.prototype.maxValueErrorText = 'Selected date is after the latest allowed date of {0:d}.';
MonthPicker.prototype.maxExclusiveErrorText = 'Selected date should be before {0:d}.';
MonthPicker.prototype.minValueErrorText = 'Selected date is after the latest allowed date of {0:d}.';
MonthPicker.prototype.minExclusiveErrorText = 'Selected date should be before {0:d}.';
MonthPicker.prototype.range = false;
MonthPicker.prototype.startYear = 1980;
MonthPicker.prototype.endYear = 2030;

Widget.alias('month-picker', MonthPicker)

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
      var {data} = props.instance;

      var cursor = monthStart(data.refDate ? data.refDate : data.date || data.from || new Date());
      
      this.dom = {};

      this.state = {
         cursorYear: cursor.getFullYear(),
         cursorMonth: cursor.getMonth() + 1,
         cursorQuarter: cursor.getMonth() / 3,
         column: 'M'
      };
   }

   moveCursor(e, data) {
      e.preventDefault();
      e.stopPropagation();
      this.setState(data);
   }

   handleKeyPress(e) {
      var {widget} = this.props.instance;
      var {cursorMonth, cursorYear, cursorQuarter, column} = this.state;

      switch (e.keyCode) {
         case KeyCode.enter:
            if (!widget.range || !e.shiftKey || !this.dragStartDates) {
               this.handleMouseDown(e, {}, false);
            } else {
               this.handleMouseUp(e);
            }
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
               this.moveCursor(e, {cursorYear: cursorYear - 1});
            else if (column == 'Q')
               this.moveCursor(e, {
                  cursorQuarter: (cursorQuarter + 3) % 4,
                  cursorYear: cursorQuarter == 0 ? cursorYear - 1 : cursorYear
               });
            else if (column == 'M')
               if (cursorMonth > 3)
                  this.moveCursor(e, {cursorMonth: cursorMonth - 3});
               else
                  this.moveCursor(e, {cursorMonth: cursorMonth + 9, cursorYear: cursorYear - 1});
            break;

         case KeyCode.down:
            if (column == 'Y')
               this.moveCursor(e, {cursorYear: cursorYear + 1});
            else if (column == 'Q')
               this.moveCursor(e, {
                  cursorQuarter: (cursorQuarter + 1) % 4,
                  cursorYear: cursorQuarter == 3 ? cursorYear + 1 : cursorYear
               });
            else if (column == 'M')
               if (cursorMonth < 10)
                  this.moveCursor(e, {cursorMonth: cursorMonth + 3});
               else
                  this.moveCursor(e, {cursorMonth: cursorMonth - 9, cursorYear: cursorYear + 1});
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
      this.moveCursor(e, {
         cursorYear: -1
      });
   }

   handleFocus(e) {
      if (this.props.onFocusOut)
         oneFocusOut(this, this.dom.el, ::this.handleFocusOut);
   }

   handleFocusOut() {
      if (this.props.onFocusOut)
         this.props.onFocusOut();
   }

   getCursorDates() {
      var {cursorMonth, cursorYear, cursorQuarter, column} = this.state;
      switch (column) {
         case 'M':
            return [new Date(cursorYear, cursorMonth-1, 1), new Date(cursorYear, cursorMonth, 1)];

         case 'Q':
            return [new Date(cursorYear, cursorQuarter * 3, 1), new Date(cursorYear, cursorQuarter * 3 + 3, 1)];

         case 'Y':
            return [new Date(cursorYear, 0, 1), new Date(cursorYear + 1, 0, 1)];
      }
   }

   handleMouseDown(e, cursor, drag = true) {
      var {instance} = this.props;
      var {widget} = instance;

      e.stopPropagation();

      if (widget.range) {
         this.dragStartDates = this.getCursorDates();
         if (drag) {
            this.setState({
               state: 'drag',
               ...cursor
            });
         } else {
            widget.handleSelect(instance, ...this.dragStartDates);
         }
      }
   }

   handleMouseUp(e) {
      var {instance} = this.props;
      var {widget} = instance;

      e.stopPropagation();

      if (widget.range) {
         if (this.dragStartDates) {
            let [originFromDate, originToDate] = this.dragStartDates;
            let [cursorFromDate, cursorToDate] = this.getCursorDates();
            widget.handleSelect(instance, minDate(originFromDate, cursorFromDate), maxDate(originToDate, cursorToDate));
            this.dragStartDates = this.getCursorDates();
         }
      } else {
         var date = this.getCursorDates()[0];
         widget.handleSelect(instance, date);
      }
   }

   render() {
      var {data, widget} = this.props.instance;
      var {CSS, baseClass, startYear, endYear} = widget;

      var years = [];

      var start = this.state.cursorYear;
      var end = this.state.cursorYear + 20;

      if (this.state.yearHeight) {
         var visibleItems = ceil5(Math.ceil(this.dom.el.offsetHeight / this.state.yearHeight));
         start = Math.max(startYear, startYear + floor5(Math.floor(this.dom.el.scrollTop / this.state.yearHeight)) - visibleItems);
         end = Math.min(endYear, start + 3 * visibleItems);
         this.start = start;
      } else {
         this.years = end - start + 1;
      }

      var from = 10000, to = 0, a, b;



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

      var monthNames = Culture.getDateTimeCulture().getMonthNames('short');


      for (let y = start; y <= end; y++) {
         let rows = [];
         for (let q = 0; q < 4; q++) {
            let row = [];
            if (q == 0)
               row.push(<th key="year"
                            rowSpan={4}
                            className={CSS.element(baseClass, 'year', {
                               cursor: this.state.column == 'Y' && y == this.state.cursorYear
                            })}
                            onMouseEnter={e=> {
                               this.moveCursor(e, {cursorYear: y, column: 'Y'})
                            }}
                            onMouseDown={e=> {
                               this.handleMouseDown(e, {cursorYear: y, column: 'Y'})
                            }}
                            onMouseUp={e=> {
                               this.handleMouseUp(e)
                            }}>
                  {y}
               </th>);

            for (let i = 0; i < 3; i++) {
               let m = q * 3 + i + 1;
               row.push(<td key={`M${m}`}
                            className={CSS.state({
                               cursor: this.state.column == 'M' && y == this.state.cursorYear && m == this.state.cursorMonth,
                               selected: y * 100 + m >= from && y * 100 + m < to
                            })}
                            onMouseEnter={e=> {
                               this.moveCursor(e, {cursorYear: y, cursorMonth: m, column: 'M'})
                            }}
                            onMouseDown={e=> {
                               this.handleMouseDown(e, {cursorYear: y, cursorMonth: m, column: 'M'})
                            }}
                            onMouseUp={e=> {
                               this.handleMouseUp(e)
                            }}>
                  {monthNames[m - 1].substr(0, 3)}
               </td>)
            }
            row.push(<th key={`q${q}`}
                         className={CSS.state({
                            cursor: this.state.column == 'Q' && y == this.state.cursorYear && q == this.state.cursorQuarter
                         })}
                         onMouseEnter={e=> {
                            this.moveCursor(e, {cursorYear: y, cursorQuarter: q, column: 'Q'})
                         }}
                         onMouseDown={e=> {
                            this.handleMouseDown(e, {cursorYear: y, cursorQuarter: q, column: 'Q'})
                         }}
                         onMouseUp={e=> {
                            this.handleMouseUp(e)
                         }}>
               {`Q${q + 1}`}
            </th>);
            rows.push(row);
         }
         years.push(rows);
      }

      return <div ref={el=>{this.dom.el = el}}
                  className={data.classNames}
                  tabIndex={data.disabled ? null : 0}
                  onKeyDown={e=>this.handleKeyPress(e)}
                  onMouseDown={e=>e.stopPropagation()}
                  onMouseMove={e=>tooltipMouseMove(e, this.props.instance)}
                  onMouseLeave={::this.onMouseLeave}
                  onFocus={e=>this.handleFocus(e)}
                  onBlur={::this.handleBlur}
                  onScroll={::this.onScroll}>
         {this.state.yearHeight && <div style={{height:`${(start-startYear)*this.state.yearHeight}px`}}></div>}
         <table ref={el=>{this.dom.table = el}}>
            {
               years.map((rows, y) =>
                  <tbody key={y}>
                     {rows.map((cells, i)=><tr key={i}>{cells}</tr>)}
                  </tbody>
               )
            }
         </table>
         {this.state.yearHeight && <div style={{height:`${Math.max(0, endYear-end)*this.state.yearHeight}px`}}></div>}
      </div>;
   }

   onScroll() {
      var {startYear} = this.props.instance.widget;
      var visibleItems = ceil5(Math.ceil(this.dom.el.offsetHeight / this.state.yearHeight));
      var start = Math.max(startYear, startYear + floor5(Math.floor(this.dom.el.scrollTop / this.state.yearHeight)) - visibleItems);
      if (Math.abs(this.start - start) > visibleItems / 2)
         this.forceUpdate();
   }

   onMouseLeave(e) {
      tooltipMouseLeave(e, this.props.instance);
      if (!isFocused(this.dom.el))
         this.moveCursor(e, {
            cursorYear: -1
         });
   }

   componentDidMount() {
      if (this.props.autoFocus)
         this.dom.el.focus();

      tooltipComponentDidMount(this.dom.el, this.props.instance);
      var yearHeight = this.dom.table.scrollHeight / this.years;
      this.setState({
         yearHeight: yearHeight
      }, () => {
         var {widget, data} = this.props.instance;
         var {startYear} = widget;
         var yearCount = 1;
         if (widget.range && data.from && data.to) {
            yearCount = data.to.getFullYear() - data.from.getFullYear() + 1;
            if (data.to.getMonth() == 0 && data.to.getDate() == 1)
               yearCount--;
         }
         this.dom.el.scrollTop = (this.state.cursorYear - startYear + yearCount/2) * this.state.yearHeight - this.dom.el.offsetHeight / 2;
      });
   }

   componentWillReceiveProps(props) {
      var {data} = props.instance;
      this.setState({
         state: 'normal'
      });
      tooltipComponentWillReceiveProps(this.dom.el, props.instance);
   }

   componentWillUnmount() {
      offFocusOut(this);
      tooltipComponentWillUnmount(this.dom.el);
   }
}

function ceil5(x) {
   return Math.ceil(x / 5) * 5;
}

function floor5(x) {
   return Math.floor(x / 5) * 5;
}
