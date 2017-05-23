import {Widget, VDOM} from "../../ui/Widget";
import {Culture} from "../../ui/Culture";
import {KeyCode} from '../../util/KeyCode';
import {WheelComponent} from "./Wheel";

export class DateTimePicker extends Widget {

   declareData() {
      return super.declareData(...arguments, {
         value: undefined
      })
   }

   render(context, instance, key) {
      return (
         <DateTimePickerComponent
            key={key}
            instance={instance}
            data={instance.data}
         />
      )
   }
}

DateTimePicker.prototype.baseClass = "datetimepicker";

class DateTimePickerComponent extends VDOM.Component {

   constructor(props) {
      super(props);
      let date = new Date(props.data.value);
      if (isNaN(date.getTime()))
         date = new Date();
      this.state = {
         date: date,
         activeWheel: null
      };

      this.handleChange = ::this.handleChange;
      this.onFocus = ::this.onFocus;
      this.onBlur = ::this.onBlur;
      this.onKeyDown = ::this.onKeyDown;

      this.wheels = {
         year: true,
         month: true,
         date: true,
         hours: true,
         minutes: true
      };

      this.keyDownPipes = {};
   }


   componentWillReceiveProps(props) {
      let date = new Date(props.data.value);
      if (isNaN(date.getTime()))
         date = new Date();
      this.setState({date});
   }

   setDateComponent(date, component, value) {
      let v = new Date(date);
      switch (component) {
         case 'year':
            v.setFullYear(value);
            break;

         case 'month':
            v.setMonth(value);
            break;

         case 'date':
            v.setDate(value);
            break;

         case 'hours':
            v.setHours(value);
            break;

         case 'minutes':
            v.setMinutes(value);
            break;
      }
      return v;
   }

   handleChange() {
      this.props.instance.set('value', this.state.date.toISOString());
   }

   render() {
      let {instance, data} = this.props;
      let {widget} = instance;
      let {CSS, baseClass} = widget;
      let date = this.state.date;

      let culture = Culture.getDateTimeCulture();
      let monthNames = culture.getMonthNames('short');

      let years = [];
      for (let y = 2000; y <= 2050; y++)
         years.push(<span key={y}>{y}</span>);

      let days = [];
      let start = new Date(date.getFullYear(), date.getMonth(), 1);
      while (start.getMonth() === date.getMonth()) {
         let day = start.getDate();
         days.push(<span key={day}>{day < 10 ? '0' + day : day}</span>)
         start.setDate(start.getDate() + 1);
      }

      let hours = [];
      for (let h = 0; h < 24; h++) {
         hours.push(<span key={h}>{h < 10 ? '0' + h : h}</span>)
      }

      let minutes = [];
      for (let m = 0; m < 60; m++) {
         minutes.push(<span key={m}>{m < 10 ? '0' + m : m}</span>)
      }


      return <div
         tabIndex={0}
         className={data.classNames}
         onFocus={this.onFocus}
         onBlur={this.onBlur}
         onKeyDown={this.onKeyDown}
      >
         <WheelComponent
            size={3}
            CSS={CSS}
            active={this.state.activeWheel === "year"}
            baseClass={baseClass + "-wheel"}
            index={date.getFullYear() - 2000}
            onChange={(newIndex) => {
               this.setState(state => ({
                  date: this.setDateComponent(this.state.date, 'year', newIndex + 2000)
               }), this.handleChange);
            }}
            onPipeKeyDown={kd => {
               this.keyDownPipes["year"] = kd;
            }}
         >
            {years}
         </WheelComponent>
         -
         <WheelComponent
            size={3}
            CSS={CSS}
            active={this.state.activeWheel === "month"}
            baseClass={baseClass + "-wheel"}
            index={date.getMonth()}
            onChange={(newIndex) => {
               this.setState(state => ({
                  date: this.setDateComponent(this.state.date, 'month', newIndex)
               }), this.handleChange);
            }}
            onPipeKeyDown={kd => {
               this.keyDownPipes["month"] = kd;
            }}
         >
            {monthNames.map((m, i) => <span key={i}>{m}</span>)}
         </WheelComponent>
         -
         <WheelComponent
            size={3}
            CSS={CSS}
            active={this.state.activeWheel === "date"}
            baseClass={baseClass + "-wheel"}
            index={date.getDate() - 1}
            onChange={(newIndex) => {
               this.setState(state => ({
                  date: this.setDateComponent(this.state.date, 'date', newIndex + 1)
               }), this.handleChange);
            }}
            onPipeKeyDown={kd => {
               this.keyDownPipes["date"] = kd;
            }}
         >
            {days}
         </WheelComponent>

         <span className={CSS.element(baseClass, "spacer")}/>

         <WheelComponent
            size={3}
            CSS={CSS}
            active={this.state.activeWheel === "hours"}
            baseClass={baseClass + "-wheel"}
            index={date.getHours()}
            onChange={(newIndex) => {
               this.setState(state => ({
                  date: this.setDateComponent(this.state.date, 'hours', newIndex)
               }), this.handleChange);
            }}
            onPipeKeyDown={kd => {
               this.keyDownPipes["hours"] = kd;
            }}
         >
            {hours}
         </WheelComponent>
         :
         <WheelComponent
            size={3}
            CSS={CSS}
            baseClass={baseClass + "-wheel"}
            active={this.state.activeWheel === "minutes"}
            index={date.getMinutes()}
            onChange={(newIndex) => {
               this.setState(state => ({
                  date: this.setDateComponent(this.state.date, 'minutes', newIndex)
               }), this.handleChange);
            }}
            onPipeKeyDown={kd => {
               this.keyDownPipes["minutes"] = kd;
            }}
         >
            {minutes}
         </WheelComponent>
      </div>
   }

   onFocus() {
      let firstWheel = null;
      for (let wheel in this.wheels) {
         if (this.wheels[wheel]) {
            firstWheel = wheel;
            break;
         }
      }

      this.setState({
         activeWheel: firstWheel
      })
   }

   onBlur() {
      this.setState({
         activeWheel: null
      })
   }

   onKeyDown(e) {
      let tmp = null;
      switch (e.keyCode) {

         case KeyCode.right:
            e.preventDefault();
            for (let wheel in this.wheels) {
               if (this.wheels[wheel]) {
                  if (tmp === this.state.activeWheel) {
                     this.setState({activeWheel: wheel});
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
                     this.setState({activeWheel: tmp});
                     break;
                  }
                  tmp = wheel;
               }
            }
            break;

         default:
            let kdp = this.keyDownPipes[this.state.activeWheel];
            if (kdp)
               kdp(e);
            break;
      }
   }
}

