import {Widget, VDOM, getContent} from '../../ui/Widget';
import {Field, getFieldTooltip} from './Field';
import {
   tooltipParentWillReceiveProps,
   tooltipParentWillUnmount,
   tooltipMouseMove,
   tooltipMouseLeave,
   tooltipParentDidMount
} from '../overlay/Tooltip';
import {stopPropagation} from '../../util/eventCallbacks';
import {KeyCode} from '../../util/KeyCode';

export class Radio extends Field {

   declareData() {
      super.declareData({
         value: undefined,
         selection: undefined,
         option: undefined,
         disabled: undefined,
         readOnly: undefined,
         required: undefined,
         text: undefined
      }, ...arguments);
   }

   init() {
      if (this.selection)
         this.value = this.selection;

      super.init();
   }

   formatValue(context, {data}) {
      return data.text;
   }

   prepareData(context, {data}) {
      super.prepareData(...arguments);
      data.checked = data.value === data.option;
   }

   renderValue(context, {data}) {
      if (data.value === data.option)
         return super.renderValue(...arguments);
      return null;
   }

   renderWrap(context, instance, key, content) {
      var {data} = instance;
      return <label key={key}
         className={data.classNames}
         style={data.style}
         onMouseDown={stopPropagation}
         onTouchStart={stopPropagation}
         onMouseMove={e => tooltipMouseMove(e, ...getFieldTooltip(instance))}
         onMouseLeave={e => tooltipMouseLeave(e, ...getFieldTooltip(instance))}
         onClick={e => {
            this.handleClick(e, instance)
         }}
         htmlFor={data.id}>
         {content}
         {this.labelPlacement && getContent(this.renderLabel(context, instance, "label"))}
      </label>
   }

   renderNativeCheck(context, instance) {
      var {CSS, baseClass} = this;
      var {data} = instance;
      return <input
         key="input"
         className={CSS.element(baseClass, "radio")}
         id={data.id}
         type="radio"
         checked={data.checked}
         disabled={data.disabled}
         {...data.inputAttrs}
         onClick={stopPropagation}
         onChange={ e => {
            this.handleChange(e, instance)
         } }
      />;
   }

   renderCheck(context, instance) {
      return (
         <RadioCmp
            key="check"
            instance={instance}
            data={instance.data}
            shouldUpdate={instance.shouldUpdate}
         />
      );
   }

   renderInput(context, instance, key) {
      var {data} = instance;
      var text = data.text || getContent(this.renderChildren(context, instance));
      var {CSS, baseClass} = this;
      return this.renderWrap(context, instance, key, [
         this.native
            ? this.renderNativeCheck(context, instance)
            : this.renderCheck(context, instance),
         text
            ? <div key="text" className={CSS.element(baseClass, "text")}>
            {text}
         </div>
            : <span className={CSS.element(baseClass, "baseline")}>&nbsp;</span>
      ]);
   }

   handleClick(e, instance) {
      if (this.native)
         e.stopPropagation();
      else {
         var el = document.getElementById(instance.data.id);
         if (el)
            el.focus();
         e.preventDefault();
         this.handleChange(e, instance)
      }
   }

   handleChange(e, instance) {
      var {data} = instance;
      if (data.disabled || data.readOnly || data.mode !== "edit")
         return;
      instance.set('value', data.option);
   }
}

Radio.prototype.baseClass = "radio";
Radio.prototype.native = false;
Radio.prototype.mode = "edit";

Widget.alias('radio', Radio);

class RadioCmp extends VDOM.Component {
   constructor(props) {
      super(props);
      this.state = {
         value: props.data.checked
      }
   }

   componentWillReceiveProps(props) {
      this.setState({
         value: props.data.checked
      });
   }

   shouldComponentUpdate(props, state) {
      return props.shouldUpdate || state != this.state;
   }

   render() {
      var {instance, data} = this.props;
      var {widget} = instance;
      var {baseClass, CSS} = widget;


      return (
         <span
            key="check"
            tabIndex={data.disabled || data.readOnly ? null : 0}
            className={CSS.element(baseClass, "input", {
               checked: this.state.value
            })}
            style={CSS.parseStyle(data.inputStyle)}
            id={data.id}
            onClick={::this.onClick}
            onKeyDown={::this.onKeyDown}
         />
      )
   }

   onClick(e) {
      var {instance, data} = this.props;
      var {widget} = instance;
      if (!data.disabled && !data.readOnly) {
         e.stopPropagation();
         e.preventDefault();
         widget.handleChange(e, instance);
      }
   }

   onKeyDown(e) {
      switch (e.keyCode) {
         case KeyCode.space:
            this.onClick(e);
            break;
      }
   }
}