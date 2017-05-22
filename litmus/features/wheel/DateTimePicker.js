import {Widget, PureContainer, VDOM, Culture} from "cx/ui";
import {KeyCode} from 'cx/util';
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

DateTimePicker.prototype.baseClass = "wheel";

class DateTimePickerComponent extends WheelComponent {

   constructor(props) {
      super(props);
      let date = new Date(props.data.value);
      if (isNaN(date.getTime()))
         date = new Date();
      this.state = {
         date: date
      }

      this.handleChange = ::this.handleChange;
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
      this.props.instance.set('value', this.state.date);
   }

   render() {
      let {instance} = this.props;
      let date = this.state.date;

      let culture = Culture.getDateTimeCulture();
      let monthNames = culture.getMonthNames('short');

      let years = [];
      for (let y = 2000; y<=2050; y++)
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
         style={{
            background: "white",
            border: '1px solid lightgray',
            display: 'inline-block',
            padding: '10px'
         }}>
         <WheelComponent
            size={3}
            instance={instance}
            data={instance.data}
            index={date.getFullYear() - 2000}
            onChange={(newIndex) => {
               this.setState(state => ({
                  date: this.setDateComponent(this.state.date, 'year', newIndex + 2000)
               }), this.handleChange);
            }}
         >
            {years}
         </WheelComponent>

         <span style={{padding: "5px"}}>-</span>

         <WheelComponent
            size={3}
            instance={instance}
            data={instance.data}
            index={date.getMonth()}
            onChange={(newIndex) => {
               this.setState(state => ({
                  date: this.setDateComponent(this.state.date, 'month', newIndex)
               }), this.handleChange);
            }}
         >
            {monthNames.map((m, i) => <span key={i}>{m}</span>)}
         </WheelComponent>

         <span style={{padding: "5px"}}>-</span>

         <WheelComponent
            size={3}
            instance={instance}
            data={instance.data}
            index={date.getDate()-1}
            onChange={(newIndex) => {
               this.setState(state => ({
                  date: this.setDateComponent(this.state.date, 'date', newIndex + 1)
               }), this.handleChange);
            }}
         >
            {days}
         </WheelComponent>

         <span style={{padding: "5px"}}> &nbsp; </span>

         <WheelComponent
            size={3}
            instance={instance}
            data={instance.data}
            index={date.getHours()}
            onChange={(newIndex) => {
               this.setState(state => ({
                  date: this.setDateComponent(this.state.date, 'hours', newIndex)
               }), this.handleChange);
            }}
         >
            {hours}
         </WheelComponent>

         <span style={{padding: "5px"}}>:</span>

         <WheelComponent
            size={3}
            instance={instance}
            data={instance.data}
            index={date.getMinutes()}
            onChange={(newIndex) => {
               this.setState(state => ({
                  date: this.setDateComponent(this.state.date, 'minutes', newIndex)
               }), this.handleChange);
            }}
         >
            {minutes}
         </WheelComponent>
      </div>
   }
}

