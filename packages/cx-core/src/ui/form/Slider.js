import {Widget, VDOM, getContent} from '../Widget';
import {Field} from './Field';
import {tooltipComponentWillReceiveProps, tooltipComponentWillUnmount, tooltipMouseMove, tooltipMouseLeave, tooltipComponentDidMount} from '../overlay/Tooltip';
import {stopPropagation} from '../eventCallbacks';
import {captureMouseOrTouch, getCursorPos} from '../overlay/captureMouse';

export class Slider extends Field {

   declareData() {
      super.declareData({
         from: 0,
         to: 0,
         step: undefined,
         min: undefined,
         max: undefined,
         disabled: undefined,
         readOnly: undefined
      }, ...arguments);
   }

   init() {
      if (this.value != null)
         this.to = this.value;

      if (typeof this.from == 'undefined')
         this.from = this.min;
      else
         this.showFrom = true;

      if (typeof this.to == 'undefined')
         this.to = this.max;
      else
         this.showTo = true;

      super.init();
   }

   renderInput(context, instance, key) {
      return <SliderComponent key={key} instance={instance} />
   }
}

Slider.prototype.baseClass = "slider";
Slider.prototype.min = 0;
Slider.prototype.max = 100;

Widget.alias('slider', Slider);

class SliderComponent extends VDOM.Component {

   constructor(props) {
      super(props);
      this.dom = {};
      var {data} = props.instance;
      this.state = {
         from: data.from,
         to: data.to,
      }
   }

   render() {
      var {data, widget} = this.props.instance;
      var {CSS, baseClass} = widget;
      var {min, max, from, to} = data;
      var {from, to} = this.state;
      var fromHandleStyle = {
        left: `${100 * (from - min) / (max - min)}%`
      };
      var toHandleStyle = {
         left: `${100 * (to - min) / (max - min)}%`
      };
      var rangeStyle = {
         left: `${100 * (from - min) / (max - min)}%`,
         width: `${100 * (to - from) / (max - min)}%`
      };
      return <div className={data.classNames}
                  id={data.id}
                  onClick={::this.onClick}>
         <div className={CSS.element(baseClass, "axis")} ref={c=>this.dom.range = c}>
            <div className={CSS.element(baseClass, "range")} style={rangeStyle}></div>
            {
               widget.showFrom &&
               <div className={CSS.element(baseClass, "handle")}
                    style={fromHandleStyle}
                    onMouseDown={e=>this.onHandleMouseDown(e, 'from')}
                    onTouchStart={e=>this.onHandleMouseDown(e, 'from')}
                    ref={c=>this.dom.from = c} />
            }
            {
               widget.showTo &&
               <div className={CSS.element(baseClass, "handle")}
                    style={toHandleStyle}
                    onMouseDown={e=>this.onHandleMouseDown(e, 'to')}
                    onTouchStart={e=>this.onHandleMouseDown(e, 'to')}
                    ref={c=>this.dom.to = c}>
               </div>
            }
         </div>
      </div>;
   }

   shouldComponentUpdate(props, state) {
      return props.instance.shouldUpdate || state != this.state;
   }

   componentWillReceiveProps(props) {
      this.setState({
         from: props.instance.data.from,
         to: props.instance.data.to
      })
   }

   onHandleMouseDown(e, handle) {
      var b = this.dom[handle].getBoundingClientRect();
      var pos = getCursorPos(e);
      var dx = pos.clientX - (b.left + b.right) / 2;
      var dy = pos.clientY - (b.top + b.bottom) / 2;
      captureMouseOrTouch(e, (e) => {
         var {instance} = this.props;
         var {value} = this.getValues(e, dx);

         if (handle == 'from') {
            if (instance.set('from', value))
               this.setState({from: value});
            if (value > this.state.to) {
               if (instance.set('to', value))
                  this.setState({to: value});
            }
         }

         if (handle == 'to') {
            if (instance.set('to', value))
               this.setState({to: value});
            if (value < this.state.from) {
               if (instance.set('from', value))
                  this.setState({from: value});
            }
         }
      }, () => {

      })
   }

   getValues(e, d=0) {
      var {data} = this.props.instance;
      var {min, max} = data;
      var b = this.dom.range.getBoundingClientRect();
      var pct = Math.max(0, Math.min(1, (e.clientX - b.left - d) / this.dom.range.offsetWidth));
      var delta = (max - min) * pct;
      if (data.step)
         delta = Math.round(delta / data.step) * data.step;
      return {
         percent: delta / (max - min),
         value: min + delta
      };
   }

   onClick(e) {
      var {value} = this.getValues(e);
      this.props.instance.set('value', value);
   }
}