import {Widget, VDOM, getContent} from '../../ui/Widget';
import {Field, getFieldTooltip} from './Field';
import {
   tooltipParentWillReceiveProps,
   tooltipParentWillUnmount,
   tooltipMouseMove,
   tooltipMouseLeave,
   tooltipParentDidMount
} from '../overlay/tooltip-ops';
import {captureMouseOrTouch, getCursorPos} from '../overlay/captureMouse';
import {isUndefined} from '../../util/isUndefined';
import {isDefined} from '../../util/isDefined';
import {isArray} from '../../util/isArray';
import {getTopLevelBoundingClientRect} from "../../util/getTopLevelBoundingClientRect";

export class Slider extends Field {

   declareData() {
      super.declareData({
         from: 0,
         to: 0,
         step: undefined,
         minValue: undefined,
         maxValue: undefined,
         increment: undefined,
         incrementPercentage: undefined,
         wheel: undefined,
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

      if (isDefined(this.min))
         this.minValue = this.min;

      if (isDefined(this.max))
         this.maxValue = this.max;

      if (this.value != null)
         this.to = this.value;

      if (isUndefined(this.from))
         this.from = this.minValue;
      else
         this.showFrom = true;

      if (isUndefined(this.to))
         this.to = this.maxValue;
      else
         this.showTo = true;

      if (this.valueTooltip)
         this.toTooltip = this.valueTooltip;

      super.init();
   }

   prepareData(context, instance) {
      let {data} = instance;
      data.stateMods = {
         ...data.stateMods,
         horizontal: !this.vertical,
         vertical: this.vertical,
         disabled: data.disabled
      };
      super.prepareData(context, instance);
   }

   renderInput(context, instance, key) {
      return (
         <SliderComponent
            key={key}
            instance={instance}
            data={instance.data}
            shouldUpdate={instance.shouldUpdate}
            label={this.labelPlacement && getContent(this.renderLabel(context, instance, "label"))}
         />
      )
   }
}

Slider.prototype.baseClass = "slider";
Slider.prototype.minValue = 0;
Slider.prototype.maxValue = 100;
Slider.prototype.vertical = false;
Slider.prototype.incrementPercentage = 0.01;
Slider.prototype.wheel = false;

Widget.alias('slider', Slider);

class SliderComponent extends VDOM.Component {

   constructor(props) {
      super(props);
      this.dom = {};
      let {data} = props;
      this.state = {
         from: data.from,
         to: data.to,
      }
   }

   shouldComponentUpdate(props, state) {
      return props.shouldUpdate || state !== this.state;
   }

   render() {
      let {instance, data, label} = this.props;
      let {widget} = instance;
      let {CSS, baseClass} = widget;
      let {minValue, maxValue} = data;
      let {from, to} = this.state;

      from = Math.min(maxValue, Math.max(minValue, from));
      to = Math.min(maxValue, Math.max(minValue, to));

      let handleStyle = CSS.parseStyle(data.handleStyle);

      let fromHandleStyle = {
         ...handleStyle,
         [widget.vertical ? 'top' : 'left']: `${100 * (from - minValue) / (maxValue - minValue)}%`
      };
      let toHandleStyle = {
         ...handleStyle,
         [widget.vertical ? 'top' : 'left']: `${100 * (to - minValue) / (maxValue - minValue)}%`
      };

      let rangeStart = (from - minValue) / (maxValue - minValue);
      let rangeSize = (to - from) / (maxValue - minValue);

      let rangeStyle = {
         ...CSS.parseStyle(data.rangeStyle),
         [widget.vertical ? 'top' : 'left']: `${100 * rangeStart}%`,
         [widget.vertical ? 'height' : 'width']: `${100 * rangeSize}%`
      };

      return <div className={data.classNames}
         style={data.style}
         id={data.id}
         onClick={::this.onClick}
         onWheel={::this.onWheel}
         onMouseMove={e => tooltipMouseMove(e, ...getFieldTooltip(instance))}
         onMouseLeave={e => tooltipMouseLeave(e, ...getFieldTooltip(instance))}
      >
         {label}
         &nbsp;
         <div className={CSS.element(baseClass, "axis")}>
            {
               rangeSize > 0 &&
               <div key="range" className={CSS.element(baseClass, "range")} style={rangeStyle}/>
            }
            <div key="space" className={CSS.element(baseClass, "space")} ref={c => this.dom.range = c}>
               {
                  widget.showFrom &&
                  <div
                     key="from"
                     className={CSS.element(baseClass, "handle")}
                     tabIndex={data.disabled ? null : 0}
                     style={fromHandleStyle}
                     onMouseDown={e => this.onHandleMouseDown(e, 'from')}
                     onMouseMove={e => tooltipMouseMove(e, instance, widget.fromTooltip, {tooltipName: 'fromTooltip'})}
                     onMouseLeave={e => this.onHandleMouseLeave(e, 'from')}
                     onTouchStart={e => this.onHandleMouseDown(e, 'from')}
                     ref={c => this.dom.from = c}/>
               }
               {
                  widget.showTo &&
                  <div
                     key="to"
                     className={CSS.element(baseClass, "handle")}
                     tabIndex={data.disabled ? null : 0}
                     style={toHandleStyle}
                     onMouseDown={e => this.onHandleMouseDown(e, 'to')}
                     onMouseMove={e => tooltipMouseMove(e, instance, widget.toTooltip, {tooltipName: 'toTooltip'})}
                     onMouseLeave={e => this.onHandleMouseLeave(e, 'to')}
                     onTouchStart={e => this.onHandleMouseDown(e, 'to')}
                     ref={c => this.dom.to = c}/>
               }
            </div>
         </div>
      </div>;
   }

   componentWillReceiveProps(props) {
      this.setState({
         from: props.data.from,
         to: props.data.to
      });

      let {instance} = props;
      let {widget} = instance;
      tooltipParentWillReceiveProps(this.dom.to, instance, widget.toTooltip, {tooltipName: 'toTooltip'});
      tooltipParentWillReceiveProps(this.dom.from, instance, widget.fromTooltip, {tooltipName: 'fromTooltip'});
   }

   componentWillUnmount() {
      tooltipParentWillUnmount(this.props.instance);
   }

   componentDidMount() {
      let {instance} = this.props;
      let {widget} = instance;
      tooltipParentDidMount(this.dom.to, instance, widget.toTooltip, { tooltipName: 'toTooltip' });
      tooltipParentDidMount(this.dom.from, instance, widget.fromTooltip, { tooltipName: 'fromTooltip' });
   }

   onHandleMouseLeave(e, handle) {
      if (!this.state.drag) {
         let tooltipName = handle + 'Tooltip';
         let {instance} = this.props;
         let tooltip = instance.widget[tooltipName];
         tooltipMouseLeave(e, instance, tooltip, {tooltipName});
      }
   }

   onHandleMouseDown(e, handle) {
      e.preventDefault();
      e.stopPropagation();

      let {instance} = this.props;
      let {data, widget} = instance;
      if (data.disabled || data.readOnly)
         return;

      let handleEl = this.dom[handle];
      let b = getTopLevelBoundingClientRect(handleEl);
      let pos = getCursorPos(e);
      let dx = pos.clientX - (b.left + b.right) / 2;
      let dy = pos.clientY - (b.top + b.bottom) / 2;

      let tooltipName = handle + 'Tooltip';
      let tooltip = widget[tooltipName];


      this.setState({
         drag: true
      });

      captureMouseOrTouch(e, (e) => {
         let {value} = this.getValues(e, widget.vertical ? dy : dx);
         if (handle === 'from') {
            if (instance.set('from', value))
               this.setState({from: value});
            if (value > this.state.to) {
               if (instance.set('to', value))
                  this.setState({to: value});
            }

         }
         else if (handle === 'to') {
            if (instance.set('to', value))
               this.setState({to: value});
            if (value < this.state.from) {
               if (instance.set('from', value))
                  this.setState({from: value});
            }
         }
         tooltipMouseMove(e, instance, tooltip, {tooltipName, target: handleEl});
      }, (e) => {
         this.setState({
            drag: false
         });
         let pos = getCursorPos(e);
         let el = document.elementFromPoint(pos.clientX, pos.clientY);
         if (el !== handleEl)
            tooltipMouseLeave(e, instance, tooltip, {tooltipName, target: handleEl});
      })
   }

   getValues(e, d = 0) {
      let {data, widget} = this.props.instance;
      let {minValue, maxValue} = data;
      let b = getTopLevelBoundingClientRect(this.dom.range);
      let pos = getCursorPos(e);
      let pct = widget.vertical
         ? Math.max(0, Math.min(1, (pos.clientY - b.top - d) / this.dom.range.offsetHeight))
         : Math.max(0, Math.min(1, (pos.clientX - b.left - d) / this.dom.range.offsetWidth));
      let delta = (maxValue - minValue) * pct;
      if (data.step)
         delta = Math.round(delta / data.step) * data.step;
      return {
         percent: delta / (maxValue - minValue),
         value: minValue + delta
      };
   }

   onClick(e) {
      let {instance} = this.props;
      let {data} = instance;
      if (!data.disabled && !data.readOnly) {
         let {value} = this.getValues(e);
         this.props.instance.set('value', value);
      }
   }

   onWheel(e) {
      let {instance} = this.props;
      let {data, widget} = instance;
      if(widget.showFrom && widget.showTo || !data.wheel)
         return;
 
      e.preventDefault();
      e.stopPropagation();

      let increment = e.deltaY > 0 ? this.getIncrement() : -this.getIncrement();

      if (!data.disabled && !data.readOnly) {
         if (widget.showFrom) {
            let value = this.checkBoundries(data.from + increment);
            if (instance.set('from', value))
               this.setState({from: value});      
         } else if (widget.showTo) {
            let value = this.checkBoundries(data.to + increment);
            if (instance.set('to', value))
               this.setState({to: value});
         }
      }
   }

   checkBoundries(value) {
      let { data } = this.props.instance;
      if (value > data.maxValue)
         value = data.maxValue;
      else if (value < data.minValue)
         value = data.minValue;
      return value;
   }

   getIncrement() {
      let {instance} = this.props;
      let {data} = instance;
      let increment = data.increment || ((data.maxValue - data.minValue) * data.incrementPercentage);
      return increment;
   }
}
