import {FlexCol, FlexRow, HtmlElement} from "cx/widgets";
import {Widget, PureContainer, VDOM} from "cx/ui";

class Wheel extends PureContainer {

   declareData() {
      return super.declareData(...arguments, {
         value: undefined,
         options: undefined
      })
   }

   render(context, instance, key) {

      let {value, options} = instance.data;
      let index = options.findIndex(a=>a.id === value);
      if (index === -1)
         index = 0;

      return (
         <WheelComponent
            key={key}
            size={3}
            instance={instance}
            data={instance.data}
            index={index}
            onChange={(newIndex) => {
               let option = options[newIndex];
               instance.set('value', option.id);
            }}
         >
            {
               options.map((o, i) => <span key={0}>{o.text}</span>)
            }
         </WheelComponent>
      )
   }
}

Wheel.prototype.baseClass = "wheel";

class WheelComponent extends VDOM.Component {

   constructor(props) {
      super(props);
      this.state = {};
      this.index = props.index || 0;
      this.wheelRef = el => {
         this.wheelEl = el
      };
      this.onWheel = ::this.onWheel;
   }

   render() {
      let {instance, data, size, children} = this.props;
      let {widget} = instance;
      let {CSS, baseClass} = widget;
      let optionClass = CSS.element(baseClass, "option");
      let dummyClass = CSS.element(baseClass, "option", { dummy: true });

      let tpad = [],
         bpad = [],
         padSize = 0;

      for (let i = 0; i < (size - 1) / 2; i++) {
         tpad.push({key: -1 - i, child: children[0], cls: dummyClass});
         bpad.push({key: -100 - i, child: children[0], cls: dummyClass});
         padSize++;
      }

      let displayedOptions = [
         ...tpad,
         ...children.map((c, i) => ({
            key: i,
            child: c,
            cls: optionClass
         })),
         ...bpad];

      if (!this.state.wheelHeight)
         displayedOptions = displayedOptions.slice(0, size);

      return <div className={data.classNames}>
         <div
            className={CSS.element(baseClass, "wrap")}
            style={{
               width: this.state.wheelWidth
            }}
         >
            <div
               className={CSS.element(baseClass, "wheel")}
               style={{
                  height: this.state.wheelHeight
               }}
               ref={this.wheelRef}
               onWheel={this.onWheel}
            >
               {
                  displayedOptions.map(opt => <div
                     key={opt.key}
                     className={opt.cls}
                  >
                     {opt.child}
                  </div>)
               }
            </div>
            <div
               className={CSS.element(baseClass, "mask")}
               style={{
                  top: `0`,
                  bottom: `${(50 + 50 / size).toFixed(3)}%`
               }}
            />
            <div
               className={CSS.element(baseClass, "mask")}
               style={{
                  top: `${(50 + 50 / size).toFixed(3)}%`,
                  bottom: `0`
               }}
            />
            <div
               className={CSS.element(baseClass, "selection")}
               style={{
                  height: `${(100 / size).toFixed(3)}%`,
                  top: `${(50 - 50 / size).toFixed(3)}%`
               }}
            />
         </div>
      </div>
   }

   componentDidMount() {
      this.setState({
         wheelHeight: this.wheelEl.offsetHeight,
         wheelWidth: this.wheelEl.offsetWidth
      })
   }

   componentWillReceiveProps(props) {
      this.index = props.index || 0;
      this.scrollTo();
   }

   componentWillUnmount() {
      this.scrolling = false;
   }

   onWheel(e) {
      e.preventDefault();
      let index = this.index;
      if (e.deltaY > 0)
         index++;
      else
         index--;
      this.select(index);
   }

   select(newIndex) {
      let {children, index} = this.props;
      newIndex = Math.max(0, Math.min(children.length - 1, newIndex));
      if (index !== newIndex) {
         this.index = newIndex;
         this.scrollTo();
         this.props.onChange(newIndex);
      }
   }

   scrollTo() {
      let {size} = this.props;

      let callback = () => {
         if (!this.scrolling)
            return;

         let x = this.index * this.state.wheelHeight / size;
         let delta = Math.round(x - this.wheelEl.scrollTop);
         if (delta === 0) {
            this.scrolling = false;
            return;
         }
         let sign = delta > 0 ? 1 : -1;
         delta = Math.abs(delta) / 10;
         if (delta < 1)
            delta = 1;

         this.wheelEl.scrollTop += sign * delta;
         requestAnimationFrame(callback);
      };

      if (!this.scrolling) {
         this.scrolling = true;
         callback();
      }
   }
}


export default (
   <cx>
      <div style="padding: 50px;" ws>
         <div style="background: white; padding: 10px; display: inline-block" ws>
            <Wheel size={3}
               value:bind="month"
               options={[
                  {id: 1, text: "Jan"},
                  {id: 2, text: "Feb"},
                  {id: 3, text: "Mar"},
                  {id: 4, text: "Apr"},
                  {id: 5, text: "May"},
                  {id: 6, text: "Jun"},
                  {id: 7, text: "Jul"},
                  {id: 8, text: "Aug"},
                  {id: 9, text: "Sep"},
                  {id: 10, text: "Oct"},
                  {id: 11, text: "Nov"},
                  {id: 12, text: "Dec"},
               ]}/>

            &nbsp; &nbsp;

            <Wheel size={3}
               options={[
                  {id: 1, text: "01"},
                  {id: 2, text: "02"},
                  {id: 3, text: "03"},
                  {id: 4, text: "04"},
                  {id: 5, text: "05"},
                  {id: 6, text: "06"},
                  {id: 7, text: "07"},
                  {id: 8, text: "08"},
                  {id: 9, text: "09"},
                  {id: 10, text: "10"},
                  {id: 11, text: "11"},
                  {id: 12, text: "12"},
               ]}/>

            &nbsp; &nbsp;

            <Wheel size={3}
               options={[
                  {id: 1, text: "2000"},
                  {id: 2, text: "2001"},
                  {id: 3, text: "2002"},
                  {id: 4, text: "2003"},
                  {id: 5, text: "2004"},
                  {id: 6, text: "2005"},
                  {id: 7, text: "2006"},
                  {id: 8, text: "2007"},
                  {id: 9, text: "2008"},
                  {id: 10, text: "2009"},
                  {id: 11, text: "2010"},
                  {id: 12, text: "2011"},
               ]}/>

         </div>
         <div style="background: #eee; padding: 10px; display: inline-block" ws>

            <Wheel size={3}
               options={[
                  {id: 2, text: "01"},
                  {id: 3, text: "02"},
                  {id: 4, text: "03"},
                  {id: 5, text: "04"},
                  {id: 6, text: "05"},
                  {id: 7, text: "06"},
                  {id: 8, text: "07"},
                  {id: 9, text: "08"},
                  {id: 10, text: "09"},
                  {id: 11, text: "10"},
                  {id: 12, text: "11"},
                  {id: 13, text: "12"},
               ]}/>

            &nbsp; : &nbsp;

            <Wheel size={3}
               options={[
                  {id: 2, text: "00"},
                  {id: 3, text: "05"},
                  {id: 4, text: "10"},
                  {id: 5, text: "15"},
                  {id: 6, text: "20"},
                  {id: 7, text: "25"},
                  {id: 8, text: "30"},
                  {id: 9, text: "35"},
                  {id: 10, text: "40"},
                  {id: 11, text: "45"},
                  {id: 12, text: "50"},
                  {id: 12, text: "55"},
               ]}/>

            &nbsp; &nbsp;

            <Wheel size={3}
               options={[
                  {id: 2, text: "AM"},
                  {id: 3, text: "PM"}
               ]}/>
         </div>
      </div>
   </cx>
);
