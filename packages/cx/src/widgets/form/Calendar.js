import { StringTemplate } from "../../data/StringTemplate";
import { Culture } from "../../ui/Culture";
import { FocusManager, offFocusOut, oneFocusOut } from "../../ui/FocusManager";
import "../../ui/Format";
import { Localization } from "../../ui/Localization";
import { VDOM, Widget } from "../../ui/Widget";
import { parseDateInvariant } from "../../util";
import { KeyCode } from "../../util/KeyCode";
import { dateDiff } from "../../util/date/dateDiff";
import { lowerBoundCheck } from "../../util/date/lowerBoundCheck";
import { monthStart } from "../../util/date/monthStart";
import { sameDate } from "../../util/date/sameDate";
import { upperBoundCheck } from "../../util/date/upperBoundCheck";
import { zeroTime } from "../../util/date/zeroTime";
import DropdownIcon from "../icons/drop-down";
import ForwardIcon from "../icons/forward";
import {
   tooltipMouseLeave,
   tooltipMouseMove,
   tooltipParentDidMount,
   tooltipParentWillReceiveProps,
   tooltipParentWillUnmount,
} from "../overlay/tooltip-ops";
import { Field, getFieldTooltip } from "./Field";

export class Calendar extends Field {
   declareData() {
      super.declareData(
         {
            value: undefined,
            refDate: undefined,
            disabled: undefined,
            enabled: undefined,
            minValue: undefined,
            minExclusive: undefined,
            maxValue: undefined,
            maxExclusive: undefined,
            focusable: undefined,
            dayData: undefined,
         },
         ...arguments,
      );
   }

   init() {
      if (this.unfocusable) this.focusable = false;

      super.init();
   }

   prepareData(context, { data }) {
      data.stateMods = {
         disabled: data.disabled,
      };

      if (data.value) {
         let d = parseDateInvariant(data.value);
         if (!isNaN(d.getTime())) {
            data.date = zeroTime(d);
         }
      }

      if (data.refDate) data.refDate = zeroTime(parseDateInvariant(data.refDate));

      if (data.maxValue) data.maxValue = zeroTime(parseDateInvariant(data.maxValue));

      if (data.minValue) data.minValue = zeroTime(parseDateInvariant(data.minValue));

      super.prepareData(...arguments);
   }

   validate(context, instance) {
      super.validate(context, instance);
      let { data, widget } = instance;
      if (!data.error && data.date) {
         let d;
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

         if (widget.disabledDaysOfWeek) {
            if (widget.disabledDaysOfWeek.includes(data.date.getDay())) data.error = this.disabledDaysOfWeekErrorText;
         }

         if (data.dayData) {
            let date = parseDateInvariant(data.value);
            let info = data.dayData[date.toDateString()];
            if (info && info.disabled) data.error = this.disabledDaysOfWeekErrorText;
         }
      }
   }

   renderInput(context, instance, key) {
      return (
         <CalendarCmp key={key} instance={instance} handleSelect={(e, date) => this.handleSelect(e, instance, date)} />
      );
   }

   handleSelect(e, instance, date) {
      let { store, data, widget } = instance;

      e.stopPropagation();

      if (data.disabled) return;

      if (!validationCheck(date, data)) return;

      if (this.onBeforeSelect && instance.invoke("onBeforeSelect", e, instance, date) === false) return;

      if (widget.partial) {
         let mixed = parseDateInvariant(data.value);
         if (data.value && !isNaN(mixed)) {
            mixed.setFullYear(date.getFullYear());
            mixed.setMonth(date.getMonth());
            mixed.setDate(date.getDate());
            date = mixed;
         }
      }

      let encode = widget.encoding || Culture.getDefaultDateEncoding();
      instance.set("value", encode(date));

      if (this.onSelect) instance.invoke("onSelect", e, instance, date);
   }
}

Calendar.prototype.baseClass = "calendar";
Calendar.prototype.highlightToday = true;
Calendar.prototype.maxValueErrorText = "Select a date not after {0:d}.";
Calendar.prototype.maxExclusiveErrorText = "Select a date before {0:d}.";
Calendar.prototype.minValueErrorText = "Select a date not before {0:d}.";
Calendar.prototype.minExclusiveErrorText = "Select a date after {0:d}.";
Calendar.prototype.disabledDaysOfWeekErrorText = "Selected day of week is not allowed.";
Calendar.prototype.suppressErrorsUntilVisited = false;
Calendar.prototype.showTodayButton = false;
Calendar.prototype.todayButtonText = "Today";
Calendar.prototype.startWithMonday = false;
Calendar.prototype.focusable = true;

Localization.registerPrototype("cx/widgets/Calendar", Calendar);

const validationCheck = (date, data, disabledDaysOfWeek) => {
   if (data.maxValue && !upperBoundCheck(date, data.maxValue, data.maxExclusive)) return false;

   if (data.minValue && !lowerBoundCheck(date, data.minValue, data.minExclusive)) return false;

   if (disabledDaysOfWeek && disabledDaysOfWeek.includes(date.getDay())) return false;

   if (data.dayData) {
      let day = data.dayData[date.toDateString()];
      if (day && (day.disabled || day.unselectable)) return false;
   }

   return true;
};

export class CalendarCmp extends VDOM.Component {
   constructor(props) {
      super(props);
      let { data } = props.instance;

      let refDate = data.refDate ? data.refDate : data.date || zeroTime(new Date());

      this.state = Object.assign(
         {
            hover: false,
            focus: false,
            cursor: zeroTime(data.date || refDate),
            activeView: "calendar",
         },
         this.getPage(refDate),
      );

      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseDown = this.handleMouseDown.bind(this);
   }

   getPage(refDate) {
      refDate = monthStart(refDate); //make a copy

      let startWithMonday = this.props.instance.widget.startWithMonday;

      let startDay = startWithMonday ? 1 : 0;
      let startDate = new Date(refDate);
      while (startDate.getDay() != startDay) startDate.setDate(startDate.getDate() - 1);

      let endDate = new Date(refDate);
      endDate.setMonth(refDate.getMonth() + 1);
      endDate.setDate(endDate.getDate() - 1);

      let endDay = startWithMonday ? 0 : 6;
      while (endDate.getDay() != endDay) endDate.setDate(endDate.getDate() + 1);

      return {
         refDate,
         startDate,
         endDate,
      };
   }

   moveCursor(e, date, options = {}) {
      e.preventDefault();
      e.stopPropagation();

      date = zeroTime(date);
      if (date.getTime() == this.state.cursor.getTime()) return;

      let refDate = this.state.refDate;

      if (options.movePage || date < this.state.startDate || date > this.state.endDate) refDate = date;

      this.setState({
         ...this.getPage(refDate),
         cursor: date,
      });
   }

   move(e, period, delta) {
      e.preventDefault();
      e.stopPropagation();

      let refDate = this.state.refDate;

      switch (period) {
         case "y":
            refDate.setFullYear(refDate.getFullYear() + delta);
            break;

         case "m":
            refDate.setMonth(refDate.getMonth() + delta);
            break;
      }

      let page = this.getPage(refDate);
      if (this.state.cursor < page.startDate) page.cursor = page.startDate;
      else if (this.state.cursor > page.endDate) page.cursor = page.endDate;

      this.setState(page);
   }

   handleKeyPress(e) {
      let cursor = new Date(this.state.cursor);

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
            this.moveCursor(e, cursor, { movePage: true });
            break;

         case KeyCode.pageDown:
            cursor.setMonth(cursor.getMonth() + 1);
            this.moveCursor(e, cursor, { movePage: true });
            break;

         case KeyCode.home:
            cursor.setDate(1);
            this.moveCursor(e, cursor, { movePage: true });
            break;

         case KeyCode.end:
            cursor.setMonth(cursor.getMonth() + 1);
            cursor.setDate(0);
            this.moveCursor(e, cursor, { movePage: true });
            break;

         default:
            let { instance } = this.props;
            let { widget } = instance;
            if (widget.onKeyDown) instance.invoke("onKeyDown", e, instance);
            break;
      }
   }

   handleWheel(e) {
      e.preventDefault();
      e.stopPropagation();

      let cursor = new Date(this.state.cursor);

      if (e.deltaY < 0) {
         cursor.setMonth(cursor.getMonth() - 1);
         this.moveCursor(e, cursor, { movePage: true });
      } else if (e.deltaY > 0) {
         cursor.setMonth(cursor.getMonth() + 1);
         this.moveCursor(e, cursor, { movePage: true });
      }
   }

   handleBlur(e) {
      FocusManager.nudge();
      let { instance } = this.props;
      let { widget } = instance;
      if (widget.onBlur) instance.invoke("onBlur", e, instance);
      this.setState({
         focus: false,
      });
   }

   handleFocus(e) {
      oneFocusOut(this, this.el, this.handleFocusOut.bind(this));
      this.setState({
         focus: true,
      });
   }

   handleFocusOut() {
      let { instance } = this.props;
      let { widget } = instance;
      if (widget.onFocusOut) instance.invoke("onFocusOut", null, instance);
   }

   handleMouseLeave(e) {
      tooltipMouseLeave(e, ...getFieldTooltip(this.props.instance));
      this.setState({
         hover: false,
      });
   }

   handleMouseEnter(e) {
      this.setState({
         hover: true,
      });
   }

   handleMouseMove(e) {
      this.moveCursor(e, readDate(e.target.dataset));
   }

   handleMouseDown(e) {
      this.props.handleSelect(e, readDate(e.target.dataset));
   }

   componentDidMount() {
      //calendar doesn't bring up keyboard so it's ok to focus it even on mobile
      if (this.props.instance.widget.autoFocus) this.el.focus();

      tooltipParentDidMount(this.el, ...getFieldTooltip(this.props.instance));
      this.el.addEventListener("wheel", (e) => this.handleWheel(e));
   }

   UNSAFE_componentWillReceiveProps(props) {
      let { data } = props.instance;
      if (data.date)
         this.setState({
            ...this.getPage(data.date),
            value: data.date,
         });

      tooltipParentWillReceiveProps(this.el, ...getFieldTooltip(props.instance));
   }

   componentWillUnmount() {
      offFocusOut(this);
      tooltipParentWillUnmount(this.props.instance);
   }

   showYearDropdown() {
      this.setState({
         activeView: "year-picker",
         yearPickerHeight: this.el.firstChild.offsetHeight,
      });
   }

   handleYearSelect(e, year) {
      e.preventDefault();
      e.stopPropagation();
      let refDate = new Date(this.state.refDate);
      refDate.setFullYear(year);
      this.setState({
         ...this.getPage(refDate),
         refDate,
         activeView: "calendar",
      });
   }

   renderYearPicker() {
      let { data, widget } = this.props.instance;
      let minYear = data.minValue?.getFullYear();
      let maxYear = data.maxValue?.getFullYear();
      let { CSS } = this.props.instance.widget;

      let years = [];
      let currentYear = new Date().getFullYear();
      let midYear = currentYear - (currentYear % 5);
      let refYear = new Date(this.state.refDate).getFullYear();
      for (let i = midYear - 100; i <= midYear + 100; i++) {
         years.push(i);
      }

      let rows = [];
      for (let i = 0; i < years.length; i += 5) {
         rows.push(years.slice(i, i + 5));
      }
      return (
         <div
            className={CSS.element(widget.baseClass, "year-picker")}
            style={{
               height: this.state.yearPickerHeight,
            }}
            ref={(el) => {
               if (el) {
                  el.addEventListener("wheel", (e) => {
                     e.stopPropagation();
                  });

                  let activeYear = el.querySelector("." + CSS.state("selected"));
                  if (activeYear) activeYear.scrollIntoView({ block: "center", behavior: "instant" });
               }
            }}
         >
            <table>
               <tbody>
                  {rows.map((row, rowIndex) => (
                     <tr key={rowIndex}>
                        {row.map((year) => (
                           <td
                              key={year}
                              className={CSS.element(this.props.instance.widget.baseClass, "year-option", {
                                 unselectable: (minYear && year < minYear) || (maxYear && year > maxYear),
                                 selected: year === refYear,
                                 active: year === currentYear,
                              })}
                              onClick={(e) => this.handleYearSelect(e, year)}
                           >
                              {year}
                           </td>
                        ))}
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      );
   }

   render() {
      let { data, widget } = this.props.instance;
      let { CSS, baseClass, disabledDaysOfWeek, startWithMonday } = widget;

      let { refDate, startDate, endDate } = this.getPage(this.state.refDate);

      let month = refDate.getMonth();
      let year = refDate.getFullYear();
      let weeks = [];
      let date = startDate;

      let empty = {};

      let today = zeroTime(new Date());
      while (date >= startDate && date <= endDate) {
         let days = [];
         for (let i = 0; i < 7; i++) {
            let dayInfo = (data.dayData && data.dayData[date.toDateString()]) || empty;
            let unselectable = !validationCheck(date, data, disabledDaysOfWeek);
            let classNames = CSS.expand(
               CSS.element(baseClass, "day", {
                  outside: month != date.getMonth(),
                  unselectable: unselectable,
                  selected: data.date && sameDate(data.date, date),
                  cursor:
                     (this.state.hover || this.state.focus) && this.state.cursor && sameDate(this.state.cursor, date),
                  today: widget.highlightToday && sameDate(date, today),
               }),
               dayInfo.className,
               CSS.mod(dayInfo.mod),
            );
            let dateInst = new Date(date);
            days.push(
               <td
                  key={i}
                  className={classNames}
                  style={CSS.parseStyle(dayInfo.style)}
                  data-year={dateInst.getFullYear()}
                  data-month={dateInst.getMonth() + 1}
                  data-date={dateInst.getDate()}
                  onMouseMove={unselectable ? null : this.handleMouseMove}
                  onMouseDown={unselectable ? null : this.handleMouseDown}
               >
                  {date.getDate()}
               </td>,
            );
            date.setDate(date.getDate() + 1);
         }
         weeks.push(
            <tr key={weeks.length} className={CSS.element(baseClass, "week")}>
               <td />
               {days}
               <td />
            </tr>,
         );
      }

      let culture = Culture.getDateTimeCulture();
      let monthNames = culture.getMonthNames("long");
      let dayNames = culture.getWeekdayNames("short").map((x) => x.substr(0, 2));
      if (startWithMonday) dayNames = [...dayNames.slice(1), dayNames[0]];

      return (
         <div
            className={data.classNames}
            tabIndex={data.disabled || !data.focusable ? null : data.tabIndex || 0}
            onKeyDown={(e) => this.handleKeyPress(e)}
            onMouseDown={(e) => {
               // prevent losing focus from the input field
               if (!data.focusable) {
                  e.preventDefault();
               }
               e.stopPropagation();
            }}
            ref={(el) => {
               this.el = el;
            }}
            onMouseMove={(e) => tooltipMouseMove(e, ...getFieldTooltip(this.props.instance))}
            onMouseLeave={(e) => this.handleMouseLeave(e)}
            onMouseEnter={(e) => this.handleMouseEnter(e)}
            // onWheel={(e) => this.handleWheel(e)}
            onFocus={(e) => this.handleFocus(e)}
            onBlur={(e) => this.handleBlur(e)}
         >
            {this.state.activeView == "calendar" && (
               <table>
                  <thead>
                     <tr key="h" className={CSS.element(baseClass, "header")}>
                        <td />
                        <td onClick={(e) => this.move(e, "y", -1)}>
                           <ForwardIcon className={CSS.element(baseClass, "icon-prev-year")} />
                        </td>
                        <td onClick={(e) => this.move(e, "m", -1)}>
                           <DropdownIcon className={CSS.element(baseClass, "icon-prev-month")} />
                        </td>
                        <th className={CSS.element(baseClass, "display")} colSpan="3">
                           {monthNames[month]}
                           <br />
                           <span
                              onClick={() => this.showYearDropdown()}
                              className={CSS.element(baseClass, "year-name")}
                           >
                              {year}
                           </span>
                        </th>
                        <td onClick={(e) => this.move(e, "m", +1)}>
                           <DropdownIcon className={CSS.element(baseClass, "icon-next-month")} />
                        </td>
                        <td onClick={(e) => this.move(e, "y", +1)}>
                           <ForwardIcon className={CSS.element(baseClass, "icon-next-year")} />
                        </td>
                        <td />
                     </tr>
                     <tr key="d" className={CSS.element(baseClass, "day-names")}>
                        <td />
                        {dayNames.map((name, i) => (
                           <th key={i}>{name}</th>
                        ))}
                        <td />
                     </tr>
                  </thead>
                  <tbody>{weeks}</tbody>
               </table>
            )}
            {this.state.activeView == "calendar" && widget.showTodayButton && (
               <div className={CSS.element(baseClass, "toolbar")}>
                  <button
                     className={CSS.expand(CSS.element(baseClass, "today-button"), CSS.block("button", "hollow"))}
                     data-year={today.getFullYear()}
                     data-month={today.getMonth() + 1}
                     data-date={today.getDate()}
                     onClick={(e) => {
                        this.handleMouseDown(e);
                     }}
                  >
                     {widget.todayButtonText}
                  </button>
               </div>
            )}

            {this.state.activeView == "year-picker" && this.renderYearPicker()}
         </div>
      );
   }
}

const readDate = (ds) => new Date(Number(ds.year), Number(ds.month) - 1, Number(ds.date));

Widget.alias("calendar", Calendar);
