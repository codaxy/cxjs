import {Widget, VDOM, getContent} from '../../ui/Widget';
import {Field} from './Field';
import {tooltipComponentWillReceiveProps, tooltipComponentWillUnmount, tooltipMouseMove, tooltipMouseLeave, tooltipComponentDidMount} from '../overlay/Tooltip';
import {stopPropagation} from '../../util/eventCallbacks';
import {captureMouseOrTouch, getCursorPos} from '../overlay/captureMouse';

export class Slider extends Field {

   declareData() {
      super.declareData({
         from: 0,
         to: 0,
         step: undefined,
         minValue: undefined,
         maxValue: undefined,
         disabled: undefined,
         readOnly: undefined,
         rangeStyle: {
            structured: true
         },
         handleStyle: {
            structured: true
         }
      }, ...arguments);
   }

   init() {
      if (typeof this.min != 'undefined')
         this.minValue = this.min;

      if (typeof this.max != 'undefined')
         this.maxValue = this.max;

      if (this.value != null)
         this.to = this.value;

      if (typeof this.from == 'undefined')
         this.from = this.minValue;
      else
         this.showFrom = true;

      if (typeof this.to == 'undefined')
         this.to = this.maxValue;
      else
         this.showTo = true;

      super.init();
   }

   prepareData(context, instance) {
      var {data} = instance;
      data.stateMods = {
         ...data.stateMods,
         horizontal: !this.vertical,
         vertical: this.vertical
      };
      super.prepareData(context, instance);
   }

   renderInput(context, instance, key) {
      return <SliderComponent key={key} instance={instance} />
   }
}

Slider.prototype.baseClass = "slider";
Slider.prototype.minValue = 0;
Slider.prototype.maxValue = 100;
Slider.prototype.vertical = false;

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

   shouldComponentUpdate(props, state) {
      return props.instance.shouldUpdate || state != this.state;
   }

   render() {
      var {instance} = this.props;
      var {data, widget} = instance;
      var {CSS, baseClass} = widget;
      var {minValue, maxValue, from, to} = data;
      var {from, to} = this.state;

      from = Math.min(maxValue, Math.max(minValue, from));
      to = Math.min(maxValue, Math.max(minValue, to));

      var handleStyle = CSS.parseStyle(data.handleStyle);

      var fromHandleStyle = {
         ...handleStyle,
         [widget.vertical ? 'top' : 'left']: `${100 * (from - minValue) / (maxValue - minValue)}%`
      };
      var toHandleStyle = {
         ...handleStyle,
         [widget.vertical ? 'top' : 'left']: `${100 * (to - minValue) / (maxValue - minValue)}%`
      };

      var rangeStart = (from - minValue) / (maxValue - minValue);
      var rangeSize = (to - from) / (maxValue - minValue);

      var rangeStyle = {
         ...CSS.parseStyle(data.rangeStyle),
         [widget.vertical ? 'top' : 'left']: `${100 * rangeStart}%`,
         [widget.vertical ? 'height' : 'width']: `${100 * rangeSize}%`
      };

      return <div className={data.classNames}
                  style={data.style}
                  id={data.id}
                  onClick={::this.onClick}>
         &nbsp;
         <div className={CSS.element(baseClass, "axis")}>
            {
               rangeSize > 0 &&
               <div className={CSS.element(baseClass, "range")} style={rangeStyle} />
            }
            <div className={CSS.element(baseClass, "space")} ref={c=>this.dom.range = c}>
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
               <button type="button" className={CSS.element(baseClass, "handle")}
                       tabIndex={-1}
                    style={toHandleStyle}
                    onMouseDown={e=>this.onHandleMouseDown(e, 'to')}
                    onMouseMove={e=>tooltipMouseMove(e, instance, this.state)}
                    onMouseLeave={e=>this.onHandleMouseLeave(e, 'to')}
                    onTouchStart={e=>this.onHandleMouseDown(e, 'to')}
                    ref={c=>this.dom.to = c}>
               </button>
            }
            </div>
         </div>
      </div>;
   }

   componentWillReceiveProps(props) {
      this.setState({
         from: props.instance.data.from,
         to: props.instance.data.to
      });

      tooltipComponentWillReceiveProps(this.dom.to, props.instance, this.state);
   }

   componentWillUnmount() {
      tooltipComponentWillUnmount(this.dom.to, this.props.instance);
   }

   componentDidMount() {
      tooltipComponentDidMount(this.dom.to, this.props.instance);
   }

   onHandleMouseLeave(e, handle) {
      if (!this.state.drag)
         tooltipMouseLeave(e, this.props.instance, this.state);
   }

   onHandleMouseDown(e, handle) {
      e.preventDefault();
      e.stopPropagation();

      var b = this.dom[handle].getBoundingClientRect();
      var pos = getCursorPos(e);
      var dx = pos.clientX - (b.left + b.right) / 2;
      var dy = pos.clientY - (b.top + b.bottom) / 2;

      this.setState({
         drag: true
      });

      captureMouseOrTouch(e, (e) => {
         var {instance} = this.props;
         var {widget} = instance;
         var {value} = this.getValues(e, widget.vertical ? dy : dx);

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
         this.setState({
            drag: false
         });
      })
   }

   getValues(e, d=0) {
      var {data, widget} = this.props.instance;
      var {minValue, maxValue} = data;
      var b = this.dom.range.getBoundingClientRect();
      var pos = getCursorPos(e);
      var pct = widget.vertical
         ? Math.max(0, Math.min(1, (pos.clientY - b.top - d) / this.dom.range.offsetHeight))
         : Math.max(0, Math.min(1, (pos.clientX - b.left - d) / this.dom.range.offsetWidth));
      var delta = (maxValue - minValue) * pct;
      if (data.step)
         delta = Math.round(delta / data.step) * data.step;
      return {
         percent: delta / (maxValue - minValue),
         value: minValue + delta
      };
   }

   onClick(e) {
      var {value} = this.getValues(e);
      this.props.instance.set('value', value);
   }
}