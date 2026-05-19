/** @jsxImportSource react */
import { Culture } from "../../ui/Culture";
import { offFocusOut, oneFocusOut } from "../../ui/FocusManager";
import { enableCultureSensitiveFormatting } from "../../ui/Format";
import type { Instance } from "../../ui/Instance";
import type { RenderingContext } from "../../ui/RenderingContext";
import { VDOM, Widget } from "../../ui/Widget";
import { parseDateInvariant } from "../../util";
import { KeyCode } from "../../util/KeyCode";
import { WheelComponent } from "./Wheel";

enableCultureSensitiveFormatting();

export class DateTimePicker extends Widget {
  declare public size: number;
  declare public segment: string;
  declare public autoFocus?: boolean;
  declare public showSeconds?: boolean;
  declare public encoding?: (date: Date) => string;
  declare public onFocusOut?: string | ((instance: Instance) => void);
  declare public onSelect?:
    | string
    | ((e: React.KeyboardEvent, instance: Instance, date: Date) => void);
  declare baseClass: string;

  declareData(...args: Record<string, unknown>[]): void {
    return super.declareData(...args, {
      value: undefined,
    });
  }

  render(
    context: RenderingContext,
    instance: Instance,
    key: string,
  ): React.ReactNode {
    return (
      <DateTimePickerComponent
        key={key}
        instance={instance}
        data={instance.data}
        size={this.size}
        segment={this.segment}
      />
    );
  }
}

DateTimePicker.prototype.baseClass = "datetimepicker";
DateTimePicker.prototype.styled = true;
DateTimePicker.prototype.size = 3;
DateTimePicker.prototype.autoFocus = false;
DateTimePicker.prototype.segment = "datetime";
DateTimePicker.prototype.showSeconds = false;

// Builds the option spans for a numeric wheel — one zero-padded span per value.
// Pass the result to a WheelComponent with `cycle` set to make it scroll
// endlessly; centre the current value by passing `index = value + range`.
function buildNumberWheel(range: number, startAt: number): React.ReactNode[] {
  return Array.from({ length: range }, (_, j) => (
    <span key={j}>{String(j + startAt).padStart(2, "0")}</span>
  ));
}

interface DateTimePickerComponentProps {
  instance: Instance;
  data: Record<string, unknown>;
  size: number;
  segment: string;
}

interface DateTimePickerComponentState {
  date: Date;
  activeWheel: string | null;
}

class DateTimePickerComponent extends VDOM.Component<
  DateTimePickerComponentProps,
  DateTimePickerComponentState
> {
  el!: HTMLDivElement;
  declare wheels: Record<string, boolean>;
  keyDownPipes: Record<string, (e: React.KeyboardEvent) => void>;
  declare years: any[];
  declare days: any[];
  declare hours: any[];
  declare minutes: any[];
  declare century: number;
  declare firstYear: number;
  declare numberOfDaysInMonth: number;

  constructor(props: DateTimePickerComponentProps) {
    super(props);
    let date = props.data.value
      ? parseDateInvariant(props.data.value as string | number | Date)
      : new Date();
    if (isNaN(date.getTime())) date = new Date();
    this.state = {
      date: date,
      activeWheel: null,
    };
    this.century = (date.getFullYear() / 100) | 0;

    let { widget } = props.instance;
    let pickerWidget = widget as DateTimePicker;

    this.handleChange = this.handleChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    let showDate = props.segment.indexOf("date") !== -1;
    let showTime = props.segment.indexOf("time") !== -1;

    this.wheels = {
      year: showDate,
      month: showDate,
      date: showDate,
      hours: showTime,
      minutes: showTime,
      seconds: showTime && !!pickerWidget.showSeconds,
    };

    this.keyDownPipes = {};
  }

  UNSAFE_componentWillReceiveProps(props: DateTimePickerComponentProps): void {
    let date = props.data.value
      ? parseDateInvariant(props.data.value as string | number | Date)
      : new Date();
    if (isNaN(date.getTime())) date = new Date();
    this.setState({ date });
  }

  setDateComponent(date: Date, component: string, value: number): Date {
    let v = new Date(date);
    switch (component) {
      case "year":
        v.setFullYear(value);
        break;

      case "month":
        v.setMonth(value);
        break;

      case "date":
        v.setDate(value);
        break;

      case "hours":
        v.setHours(value);
        break;

      case "minutes":
        v.setMinutes(value);
        break;

      case "seconds":
        v.setSeconds(value);
        break;
    }
    return v;
  }

  handleChange(): void {
    let { widget } = this.props.instance;
    let pickerWidget = widget as DateTimePicker;
    let encode = pickerWidget.encoding || Culture.getDefaultDateEncoding();
    this.props.instance.set("value", encode!(this.state.date));
  }

  render(): React.ReactNode {
    let { instance, data, size } = this.props;
    let { widget } = instance;
    let { CSS, baseClass } = widget;
    let pickerWidget = widget as DateTimePicker;
    let date = this.state.date;

    let culture = Culture.getDateTimeCulture();
    let monthNames = culture.getMonthNames("short");

    // Years: a window spanning the current century, rebuilt when it changes.
    let currentCentury = (date.getFullYear() / 100) | 0;
    if (!this.years || this.century !== currentCentury) {
      this.century = currentCentury;
      this.firstYear = currentCentury * 100 - 3;
      let lastYear = (currentCentury + 1) * 100 + 5;
      this.years = [];
      for (let y = this.firstYear; y <= lastYear; y++)
        this.years.push(<span key={y}>{y}</span>);
    }
    let years = this.years;

    // Day/hour/minute wheels use a 3x buffer (see buildNumberWheel). The day
    // buffer depends on the month length, so it is rebuilt when that changes.
    const numberOfDaysInMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
    ).getDate();
    if (!this.days || this.numberOfDaysInMonth !== numberOfDaysInMonth) {
      this.numberOfDaysInMonth = numberOfDaysInMonth;
      this.days = buildNumberWheel(numberOfDaysInMonth, 1);
    }
    let days = this.days;

    if (!this.hours) this.hours = buildNumberWheel(24, 0);
    let hours = this.hours;

    if (!this.minutes) this.minutes = buildNumberWheel(60, 0);
    let minutes = this.minutes;

    return (
      <div
        tabIndex={0}
        ref={(el) => {
          this.el = el!;
        }}
        className={data.classNames as string}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
      >
        {this.wheels.year && (
          <WheelComponent
            key={`years-${this.century}`}
            size={size}
            CSS={CSS}
            active={this.state.activeWheel === "year"}
            baseClass={baseClass + "-wheel"}
            index={date.getFullYear() - this.firstYear}
            onChange={(newIndex) => {
              this.setState(
                (state) => ({
                  date: this.setDateComponent(
                    state.date,
                    "year",
                    newIndex + this.firstYear,
                  ),
                }),
                this.handleChange,
              );
            }}
            onPipeKeyDown={(kd) => {
              this.keyDownPipes["year"] = kd;
            }}
            onMouseDown={() => {
              this.setState({ activeWheel: "year" });
            }}
          >
            {years}
          </WheelComponent>
        )}
        {this.wheels.year && this.wheels.month && <span>-</span>}
        {this.wheels.month && (
          <WheelComponent
            size={size}
            CSS={CSS}
            active={this.state.activeWheel === "month"}
            baseClass={baseClass + "-wheel"}
            index={date.getMonth()}
            onChange={(newIndex) => {
              this.setState(
                (state) => ({
                  date: this.setDateComponent(state.date, "month", newIndex),
                }),
                this.handleChange,
              );
            }}
            onPipeKeyDown={(kd) => {
              this.keyDownPipes["month"] = kd;
            }}
            onMouseDown={() => {
              this.setState({ activeWheel: "month" });
            }}
          >
            {monthNames.map((m: string, i: number) => (
              <span key={i}>{m}</span>
            ))}
          </WheelComponent>
        )}
        {this.wheels.month && this.wheels.date && <span>-</span>}
        {this.wheels.date && (
          <WheelComponent
            key="date"
            size={size}
            CSS={CSS}
            cycle
            active={this.state.activeWheel === "date"}
            baseClass={baseClass + "-wheel"}
            index={date.getDate() - 1 + this.numberOfDaysInMonth}
            onChange={(rawIndex) => {
              let day = rawIndex % this.numberOfDaysInMonth;
              this.setState(
                (state) => ({
                  date: this.setDateComponent(state.date, "date", day + 1),
                }),
                this.handleChange,
              );
            }}
            onPipeKeyDown={(kd) => {
              this.keyDownPipes["date"] = kd;
            }}
            onMouseDown={() => {
              this.setState({ activeWheel: "date" });
            }}
          >
            {days}
          </WheelComponent>
        )}
        {this.wheels.hours && this.wheels.year && (
          <span className={CSS.element(baseClass!, "spacer")} />
        )}
        {this.wheels.hours && (
          <WheelComponent
            key="hours"
            size={size}
            CSS={CSS}
            cycle
            active={this.state.activeWheel === "hours"}
            baseClass={baseClass + "-wheel"}
            index={date.getHours() + 24}
            onChange={(rawIndex) => {
              let hour = rawIndex % 24;
              this.setState(
                (state) => ({
                  date: this.setDateComponent(state.date, "hours", hour),
                }),
                this.handleChange,
              );
            }}
            onPipeKeyDown={(kd) => {
              this.keyDownPipes["hours"] = kd;
            }}
            onMouseDown={() => {
              this.setState({ activeWheel: "hours" });
            }}
          >
            {hours}
          </WheelComponent>
        )}
        {this.wheels.hours && this.wheels.minutes && <span>:</span>}
        {this.wheels.minutes && (
          <WheelComponent
            key="minutes"
            size={size}
            CSS={CSS}
            cycle
            baseClass={baseClass + "-wheel"}
            active={this.state.activeWheel === "minutes"}
            index={date.getMinutes() + 60}
            onChange={(rawIndex) => {
              let minute = rawIndex % 60;
              this.setState(
                (state) => ({
                  date: this.setDateComponent(state.date, "minutes", minute),
                }),
                this.handleChange,
              );
            }}
            onPipeKeyDown={(kd) => {
              this.keyDownPipes["minutes"] = kd;
            }}
            onMouseDown={() => {
              this.setState({ activeWheel: "minutes" });
            }}
          >
            {minutes}
          </WheelComponent>
        )}
        {this.wheels.minutes && this.wheels.seconds && <span>:</span>}
        {this.wheels.seconds && (
          <WheelComponent
            key="seconds"
            size={size}
            CSS={CSS}
            cycle
            baseClass={baseClass + "-wheel"}
            active={this.state.activeWheel === "seconds"}
            index={date.getSeconds() + 60}
            onChange={(rawIndex) => {
              let second = rawIndex % 60;
              this.setState(
                (state) => ({
                  date: this.setDateComponent(state.date, "seconds", second),
                }),
                this.handleChange,
              );
            }}
            onPipeKeyDown={(kd) => {
              this.keyDownPipes["seconds"] = kd;
            }}
            onMouseDown={() => {
              this.setState({ activeWheel: "seconds" });
            }}
          >
            {minutes}
          </WheelComponent>
        )}
      </div>
    );
  }

  componentDidMount(): void {
    let { widget } = this.props.instance;
    let pickerWidget = widget as DateTimePicker;
    if (pickerWidget.autoFocus) this.el.focus();
  }

  componentWillUnmount(): void {
    offFocusOut(this);
  }

  onFocus(): void {
    oneFocusOut(this, this.el, this.onFocusOut.bind(this));

    if (!this.state.activeWheel) {
      let firstWheel: string | null = null;
      for (let wheel in this.wheels) {
        if (this.wheels[wheel]) {
          firstWheel = wheel;
          break;
        }
      }

      this.setState({
        activeWheel: firstWheel,
      });
    }
  }

  onFocusOut(): void {
    let { instance } = this.props;
    let { widget } = instance;
    let pickerWidget = widget as DateTimePicker;
    if (pickerWidget.onFocusOut) instance.invoke("onFocusOut", null, instance);
  }

  onBlur(): void {
    this.setState({
      activeWheel: null,
    });
  }

  onKeyDown(e: React.KeyboardEvent): void {
    let tmp: string | null = null;
    let { instance } = this.props;
    let { widget } = instance;
    let pickerWidget = widget as DateTimePicker;

    switch (e.keyCode) {
      case KeyCode.right:
        e.preventDefault();
        for (let wheel in this.wheels) {
          if (this.wheels[wheel]) {
            if (tmp === this.state.activeWheel) {
              this.setState({ activeWheel: wheel });
              break;
            }
            tmp = wheel;
          }
        }
        break;

      case KeyCode.left:
        e.preventDefault();
        for (let wheel in this.wheels) {
          if (this.wheels[wheel]) {
            if (wheel === this.state.activeWheel && tmp) {
              this.setState({ activeWheel: tmp });
              break;
            }
            tmp = wheel;
          }
        }
        break;

      case KeyCode.enter:
        e.preventDefault();
        if (pickerWidget.onSelect)
          instance.invoke("onSelect", e, instance, this.state.date);
        break;

      default:
        let kdp = this.keyDownPipes[this.state.activeWheel!];
        if (kdp) kdp(e);
        break;
    }
  }
}
