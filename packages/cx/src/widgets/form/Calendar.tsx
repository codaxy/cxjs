/** @jsxImportSource react */

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
import type { Instance } from "../../ui/Instance";
import type { RenderingContext } from "../../ui/RenderingContext";

interface CalendarCmpProps {
   instance: Instance;
   handleSelect: (e: React.MouseEvent, date: Date) => void;
}

interface CalendarState {
   hover: boolean;
   focus: boolean;
   cursor: Date;
   activeView: string;
   refDate: Date;
   startDate: Date;
   endDate: Date;
   yearPickerHeight?: number;
}

export class Calendar extends Field {
   public unfocusable?: boolean;
   public focusable?: boolean;
   public baseClass?: string;
   public highlightToday?: boolean;
   public maxValueErrorText?: string;
   public maxExclusiveErrorText?: string;
   public minValueErrorText?: string;
   public minExclusiveErrorText?: string;
   public disabledDaysOfWeekErrorText?: string;
   public suppressErrorsUntilVisited?: boolean;
   public showTodayButton?: boolean;
   public todayButtonText?: string;
   public startWithMonday?: boolean;
   public onBeforeSelect?: string | ((e: React.MouseEvent, instance: Instance, date: Date) => boolean | void);
   public onSelect?: string | ((e: React.MouseEvent, instance: Instance, date: Date) => void);
   public onBlur?: string | ((e: React.FocusEvent, instance: Instance) => void);
   public onFocusOut?: string | ((instance: Instance) => void);
   public disabledDaysOfWeek?: number[];
   public partial?: boolean;
   public encoding?: (date: Date) => string;

   declareData(...args: Record<string, unknown>[]) {
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
         ...args,
      );
   }

   init() {
      if (this.unfocusable) this.focusable = false;

      super.init();
   }

   prepareData(context: RenderingContext, instance: Instance, ...args: any[]) {
      const { data } = instance;
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

      super.prepareData(context, instance, ...args);
   }

   validate(context: RenderingContext, instance: Instance) {
      super.validate(context, instance);
      let { data, widget } = instance;
      let calendarWidget = widget as Calendar;

      if (!data.error && data.date) {
         let d;
         if (data.maxValue) {
            d = dateDiff(data.date, data.maxValue);
            if (d > 0) data.error = StringTemplate.format(this.maxValueErrorText!, data.maxValue);
            else if (d == 0 && data.maxExclusive)
               data.error = StringTemplate.format(this.maxExclusiveErrorText!, data.maxValue);
         }

         if (data.minValue) {
            d = dateDiff(data.date, data.minValue);
            if (d < 0) data.error = StringTemplate.format(this.minValueErrorText!, data.minValue);
            else if (d == 0 && data.minExclusive)
               data.error = StringTemplate.format(this.minExclusiveErrorText!, data.minValue);
         }

         if (calendarWidget.disabledDaysOfWeek) {
            if (calendarWidget.disabledDaysOfWeek.includes(data.date.getDay())) data.error = this.disabledDaysOfWeekErrorText;
         }

         if (data.dayData) {
            let date = parseDateInvariant(data.value);
            let info = data.dayData[date.toDateString()];
            if (info && info.disabled) data.error = this.disabledDaysOfWeekErrorText;
         }
      }
   }

   renderInput(context: RenderingContext, instance: any, key: string | number): React.ReactElement {
      return (
         <CalendarCmp key={key} instance={instance} handleSelect={(e: React.MouseEvent, date: Date) => this.handleSelect(e, instance, date)} />
      );
   }

   handleSelect(e: React.MouseEvent, instance: any, date: Date): void {
      let { store, data, widget } = instance;
      let calendarWidget = widget as Calendar;

      e.stopPropagation();

      if (data.disabled) return;

      if (!validationCheck(date, data, calendarWidget.disabledDaysOfWeek)) return;

      if (this.onBeforeSelect && instance.invoke("onBeforeSelect", e, instance, date) === false) return;

      if (calendarWidget.partial) {
         let mixed = parseDateInvariant(data.value);
         if (data.value && !isNaN(mixed.getTime())) {
            mixed.setFullYear(date.getFullYear());
            mixed.setMonth(date.getMonth());
            mixed.setDate(date.getDate());
            date = mixed;
         }
      }

      let encode = calendarWidget.encoding || Culture.getDefaultDateEncoding()!;
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

interface DayInfo {
   className?: string;
   style?: string;
   mod?: string;
   disabled?: boolean;
   unselectable?: boolean;
}

interface CalendarData {
   maxValue?: Date;
   maxExclusive?: boolean;
   minValue?: Date;
   minExclusive?: boolean;
   dayData?: Record<string, DayInfo>;
}

const validationCheck = (date: Date, data: CalendarData, disabledDaysOfWeek?: number[]): boolean => {
   if (data.maxValue && !upperBoundCheck(date, data.maxValue, data.maxExclusive)) return false;

   if (data.minValue && !lowerBoundCheck(date, data.minValue, data.minExclusive)) return false;

   if (disabledDaysOfWeek && disabledDaysOfWeek.includes(date.getDay())) return false;

   if (data.dayData) {
      let day = data.dayData[date.toDateString()];
      if (day && (day.disabled || day.unselectable)) return false;
   }

   return true;
};

export class CalendarCmp extends VDOM.Component<CalendarCmpProps, CalendarState> {
   el: HTMLElement | null = null;

   constructor(props: CalendarCmpProps) {
      super(props);
      let { data } = props.instance;

      let refDate = data.refDate ? data.refDate : data.date || zeroTime(new Date());

      this.state = {
         hover: false,
         focus: false,
         cursor: zeroTime(data.date || refDate),
         activeView: "calendar",
         ...this.getPage(refDate),
      };

      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseDown = this.handleMouseDown.bind(this);
   }

   getPage(refDate: Date): { refDate: Date; startDate: Date; endDate: Date } {
      refDate = monthStart(refDate); //make a copy

      let calendarWidget = this.props.instance.widget as Calendar;
      let startWithMonday = calendarWidget.startWithMonday;

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

   moveCursor(e: React.SyntheticEvent | React.KeyboardEvent, date: Date, options: { movePage?: boolean } = {}): void {
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

   move(e: React.MouseEvent, period: string, delta: number): void {
      e.preventDefault();
      e.stopPropagation();

      let refDate = new Date(this.state.refDate);

      switch (period) {
         case "y":
            refDate.setFullYear(refDate.getFullYear() + delta);
            break;

         case "m":
            refDate.setMonth(refDate.getMonth() + delta);
            break;
      }

      let page = this.getPage(refDate);
      let cursor = this.state.cursor;
      if (cursor < page.startDate) cursor = page.startDate;
      else if (cursor > page.endDate) cursor = page.endDate;

      this.setState({ ...page, cursor });
   }

   handleKeyPress(e: React.KeyboardEvent): void {
      let cursor = new Date(this.state.cursor);

      switch (e.keyCode) {
         case KeyCode.enter:
            this.props.handleSelect(e as unknown as React.MouseEvent, this.state.cursor);
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
            let calendarWidget = instance.widget as Calendar;
            if (calendarWidget.onKeyDown) instance.invoke("onKeyDown", e, instance);
            break;
      }
   }

   handleWheel(e: WheelEvent): void {
      e.preventDefault();
      e.stopPropagation();

      let cursor = new Date(this.state.cursor);

      if (e.deltaY < 0) {
         cursor.setMonth(cursor.getMonth() - 1);
         this.moveCursor(e as unknown as React.SyntheticEvent, cursor, { movePage: true });
      } else if (e.deltaY > 0) {
         cursor.setMonth(cursor.getMonth() + 1);
         this.moveCursor(e as unknown as React.SyntheticEvent, cursor, { movePage: true });
      }
   }

   handleBlur(e: React.FocusEvent): void {
      FocusManager.nudge();
      let { instance } = this.props;
      let calendarWidget = instance.widget as Calendar;
      if (calendarWidget.onBlur) instance.invoke("onBlur", e, instance);
      this.setState({
         focus: false,
      });
   }

   handleFocus(e: React.FocusEvent): void {
      oneFocusOut(this, this.el!, this.handleFocusOut.bind(this));
      this.setState({
         focus: true,
      });
   }

   handleFocusOut(): void {
      let { instance } = this.props;
      let calendarWidget = instance.widget as Calendar;
      if (calendarWidget.onFocusOut) instance.invoke("onFocusOut", null, instance);
   }

   handleMouseLeave(e: React.MouseEvent): void {
      tooltipMouseLeave(e, ...getFieldTooltip(this.props.instance));
      this.setState({
         hover: false,
      });
   }

   handleMouseEnter(e: React.MouseEvent): void {
      this.setState({
         hover: true,
      });
   }

   handleMouseMove(e: React.MouseEvent): void {
      this.moveCursor(e, readDate((e.target as HTMLElement).dataset));
   }

   handleMouseDown(e: React.MouseEvent): void {
      this.props.handleSelect(e, readDate((e.target as HTMLElement).dataset));
   }

   componentDidMount(): void {
      //calendar doesn't bring up keyboard so it's ok to focus it even on mobile
      let calendarWidget = this.props.instance.widget as Calendar;
      if (calendarWidget.autoFocus && this.el) this.el.focus();

      if (this.el) {
         tooltipParentDidMount(this.el, ...getFieldTooltip(this.props.instance));
         this.el.addEventListener("wheel", (e) => this.handleWheel(e));
      }
   }

   UNSAFE_componentWillReceiveProps(props: CalendarCmpProps): void {
      let { data } = props.instance;
      if (data.date)
         this.setState({
            ...this.getPage(data.date),
         });

      if (this.el) {
         tooltipParentWillReceiveProps(this.el, ...getFieldTooltip(props.instance));
      }
   }

   componentWillUnmount(): void {
      offFocusOut(this);
      tooltipParentWillUnmount(this.props.instance);
   }

   showYearDropdown(): void {
      if (this.el && this.el.firstChild) {
         this.setState({
            activeView: "year-picker",
            yearPickerHeight: (this.el.firstChild as HTMLElement).offsetHeight,
         });
      }
   }

   handleYearSelect(e: React.MouseEvent, year: number): void {
      e.preventDefault();
      e.stopPropagation();
      let refDate = new Date(this.state.refDate);
      refDate.setFullYear(year);
      this.setState({
         ...this.getPage(refDate),
         activeView: "calendar",
      });
   }

   renderYearPicker(): React.ReactElement {
      let { data, widget } = this.props.instance;
      let calendarWidget = widget as Calendar;
      let minYear: number | undefined = data.minValue?.getFullYear();
      let maxYear: number | undefined = data.maxValue?.getFullYear();
      let { CSS } = widget;

      let years: number[] = [];
      let currentYear = new Date().getFullYear();
      let midYear = currentYear - (currentYear % 5);
      let refYear = new Date(this.state.refDate).getFullYear();
      for (let i = midYear - 100; i <= midYear + 100; i++) {
         years.push(i);
      }

      let rows: number[][] = [];
      for (let i = 0; i < years.length; i += 5) {
         rows.push(years.slice(i, i + 5));
      }
      return (
         <div
            className={CSS.element(calendarWidget.baseClass, "year-picker")}
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
                  {rows.map((row: number[], rowIndex: number) => (
                     <tr key={rowIndex}>
                        {row.map((year: number) => (
                           <td
                              key={year}
                              className={CSS.element(calendarWidget.baseClass, "year-option", {
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

   render(): React.ReactElement {
      let { data, widget } = this.props.instance;
      let calendarWidget = widget as Calendar;
      let { CSS, baseClass, disabledDaysOfWeek, startWithMonday } = calendarWidget;

      let { refDate, startDate, endDate } = this.getPage(this.state.refDate);

      let month = refDate.getMonth();
      let year = refDate.getFullYear();
      let weeks: React.ReactNode[] = [];
      let date = startDate;

      let empty: Record<string, any> = {};

      let today = zeroTime(new Date());
      while (date >= startDate && date <= endDate) {
         let days: React.ReactNode[] = [];
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
                  today: calendarWidget.highlightToday && sameDate(date, today),
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
                  onMouseMove={unselectable ? undefined : this.handleMouseMove}
                  onMouseDown={unselectable ? undefined : this.handleMouseDown}
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
      let dayNames = culture.getWeekdayNames("short").map((x: string) => x.substr(0, 2));
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
                        <th className={CSS.element(baseClass, "display")} colSpan={3}>
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
                        {dayNames.map((name: string, i: number) => (
                           <th key={i}>{name}</th>
                        ))}
                        <td />
                     </tr>
                  </thead>
                  <tbody>{weeks}</tbody>
               </table>
            )}
            {this.state.activeView == "calendar" && calendarWidget.showTodayButton && (
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
                     {calendarWidget.todayButtonText}
                  </button>
               </div>
            )}

            {this.state.activeView == "year-picker" && this.renderYearPicker()}
         </div>
      );
   }
}

const readDate = (ds: DOMStringMap): Date => new Date(Number(ds.year), Number(ds.month) - 1, Number(ds.date));

Widget.alias("calendar", Calendar);
