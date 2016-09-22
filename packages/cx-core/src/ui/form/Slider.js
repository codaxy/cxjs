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

   prepareData(context, instance) {
      var {data} = instance;
      data.stateMods = {
         ...data.stateMods,
         horizontal: !this.vertical,
         vertical: this.vertical
      }
      super.prepareData(context, instance);
   }

   renderInput(context, instance, key) {
      return <SliderComponent key={key} instance={instance} />
   }
}

Slider.prototype.baseClass = "slider";
Slider.prototype.min = 0;
Slider.prototype.max = 100;
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
      var {min, max, from, to} = data;
      var {from, to} = this.state;

      from = Math.min(max, Math.max(min, from));
      to = Math.min(max, Math.max(min, to));

      var handleStyle = CSS.parseStyle(data.handleStyle);

      var fromHandleStyle = {
         ...handleStyle,
         [widget.vertical ? 'top' : 'left']: `${100 * (from - min) / (max - min)}%`
      };
      var toHandleStyle = {
         ...handleStyle,
         [widget.vertical ? 'top' : 'left']: `${100 * (to - min) / (max - min)}%`
      };
      var rangeStyle = {
         ...CSS.parseStyle(data.rangeStyle),
         [widget.vertical ? 'top' : 'left']: `${100 * (from - min) / (max - min)}%`,
         [widget.vertical ? 'height' : 'width']: `${100 * (to - from) / (max - min)}%`
      };

      return <div className={data.classNames}
                  style={data.style}
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
            &nbsp;
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

         //tooltipMouseMove(this.dom[handle], instance, this.state);

      }, () => {
         this.setState({
            drag: false
         });
      })
   }

   getValues(e, d=0) {
      var {data, widget} = this.props.instance;
      var {min, max} = data;
      var b = this.dom.range.getBoundingClientRect();
      var pos = getCursorPos(e);
      var pct = widget.vertical
         ? Math.max(0, Math.min(1, (pos.clientY - b.top - d) / this.dom.range.offsetHeight))
         : Math.max(0, Math.min(1, (pos.clientX - b.left - d) / this.dom.range.offsetWidth));
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