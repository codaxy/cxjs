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
interface DateTimePickerComponentProps {
  instance: Instance;
  data: Record<string, unknown>;
  size: number;
  segment: string;
}

interface DateTimePickerComponentState {
  date: Date;
  activeWheel: string | null;
  daysResetKey: number;
  hoursResetKey: number;
  minutesResetKey: number;
  secondsResetKey: number;
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
      daysResetKey: 0,
      hoursResetKey: 0,
      minutesResetKey: 0,
      secondsResetKey: 0,
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

    let years = [];
    if (!this.years || this.century !== ((date.getFullYear() / 100) | 0)) {
      this.century = (date.getFullYear() / 100) | 0;

      for (
        let y = this.century * 100 - 3;
        y <= (this.century + 1) * 100 + 5;
        y++
      )
        years.push(<span key={y}>{y}</span>);
      this.years = years;
    } else {
      years = this.years;
    }

    let days = [];
    const daysInThisMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
    ).getDate();
    this.numberOfDaysInMonth ??= daysInThisMonth;

    if (!this.days || this.numberOfDaysInMonth !== daysInThisMonth) {
      days = Array.from({ length: 5 }, (_, d) => (
        <span key={d}>
          {daysInThisMonth - 4 + d < 10
            ? "0" + (daysInThisMonth - 4 + d)
            : daysInThisMonth - 4 + d}
        </span>
      ));
      days.push(
        ...Array.from({ length: 36 }, (_, d) => (
          <span key={d + 5}>
            {(d % daysInThisMonth) + 1 < 10
              ? "0" + ((d % daysInThisMonth) + 1)
              : (d % daysInThisMonth) + 1}
          </span>
        )),
      );

      this.days = days;
      this.numberOfDaysInMonth = daysInThisMonth;
    } else {
      days = this.days;
    }

    let hours = [];
    if (!this.hours) {
      hours = Array.from({ length: 52 }, (_, h) => (
        <span key={h}>{h % 24 < 10 ? "0" + (h % 24) : h % 24}</span>
      ));
      this.hours = hours;
    } else {
      hours = this.hours;
    }

    let minutes = [];
    if (!this.minutes) {
      minutes = Array.from({ length: 130 }, (_, h) => (
        <span key={h}>{h % 60 < 10 ? "0" + (h % 60) : h % 60}</span>
      ));
      this.minutes = minutes;
    } else {
      minutes = this.minutes;
    }

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
            index={date.getFullYear() - Number(this.years[0].key)}
            onChange={(newIndex) => {
              this.setState(
                (state) => ({
                  date: this.setDateComponent(
                    this.state.date,
                    "year",
                    newIndex + Number(this.years[0].key),
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
                  date: this.setDateComponent(
                    this.state.date,
                    "month",
                    newIndex,
                  ),
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
            key={`days-${this.state.daysResetKey}`}
            size={size}
            CSS={CSS}
            active={this.state.activeWheel === "date"}
            baseClass={baseClass + "-wheel"}
            index={date.getDate() + 4}
            onChange={(newDate) => {
              newDate -= 5;
              if (newDate < 0) {
                newDate += this.numberOfDaysInMonth;
              } else {
                newDate = newDate % this.numberOfDaysInMonth;
              }

              this.setState(
                (state) => ({
                  date: this.setDateComponent(state.date, "date", newDate + 1),
                  daysResetKey:
                    ((state.date.getDate() - 1) ^ newDate) ===
                    this.numberOfDaysInMonth - 1
                      ? state.daysResetKey + 1
                      : state.daysResetKey,
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
            key={`hours-${this.state.hoursResetKey}`}
            size={size}
            CSS={CSS}
            active={this.state.activeWheel === "hours"}
            baseClass={baseClass + "-wheel"}
            index={date.getHours() + 24}
            onChange={(newIndex) => {
              const newHour = newIndex % 24;

              this.setState(
                (s) => ({
                  date: this.setDateComponent(s.date, "hours", newHour),
                  hoursResetKey:
                    (s.date.getHours() ^ newHour) == 23
                      ? s.hoursResetKey + 1
                      : s.hoursResetKey,
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
            key={`minutes-${this.state.minutesResetKey}`}
            size={size}
            CSS={CSS}
            baseClass={baseClass + "-wheel"}
            active={this.state.activeWheel === "minutes"}
            index={date.getMinutes() + 60}
            onChange={(newIndex) => {
              const newMinutes = newIndex % 60;
              this.setState(
                (state) => ({
                  date: this.setDateComponent(
                    state.date,
                    "minutes",
                    newMinutes,
                  ),
                  minutesResetKey:
                    (state.date.getMinutes() ^ newMinutes) == 59
                      ? state.minutesResetKey + 1
                      : state.minutesResetKey,
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
            key={`seconds-${this.state.secondsResetKey}`}
            size={size}
            CSS={CSS}
            baseClass={baseClass + "-wheel"}
            active={this.state.activeWheel === "seconds"}
            index={date.getSeconds() + 60}
            onChange={(newIndex) => {
              const newSeconds = newIndex % 60;
              this.setState(
                (state) => ({
                  date: this.setDateComponent(
                    state.date,
                    "seconds",
                    newSeconds,
                  ),
                  secondsResetKey:
                    (state.date.getSeconds() ^ newSeconds) == 59
                      ? state.secondsResetKey + 1
                      : state.secondsResetKey,
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
