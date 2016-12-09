import {Widget, VDOM, getContent} from '../../ui/Widget';
import {Field} from './Field';
import {tooltipComponentWillReceiveProps, tooltipComponentWillUnmount, tooltipMouseMove, tooltipMouseLeave, tooltipComponentDidMount} from '../overlay/Tooltip';
import {stopPropagation} from '../../util/eventCallbacks';
import {KeyCode} from '../../util/KeyCode';
import Check from '../../icons/check';

export class Checkbox extends Field {

   init() {
      if (this.checked)
         this.value = this.checked;

      super.init();
   }

   declareData() {
      super.declareData({
         value: false,
         text: undefined,
         readOnly: undefined,
         disabled: undefined,
         required: undefined
      }, ...arguments);
   }

   renderWrap(context, instance, key, content) {
      var {data} = instance;
      return <label key={key}
                    className={data.classNames}
                    onMouseDown={stopPropagation}
                    onMouseMove={e=>tooltipMouseMove(e, instance)}
                    onMouseLeave={e=>tooltipMouseLeave(e, instance)}
                    onClick={ e=> { this.handleClick(e, instance) }}
                    style={data.style}>
         {content}
      </label>
   }

   renderNativeCheck(context, instance) {
      var {CSS, baseClass} = this;
      var {data} = instance;
      return <input key="input"
                    className={CSS.element(baseClass, "checkbox")}
                    id={data.id}
                    type="checkbox"
                    checked={data.value || false}
                    disabled={data.disabled}
                    onClick={stopPropagation}
                    onChange={ e => { this.handleChange(e, instance) } }/>;
   }

   renderCheck(context, instance) {
      return <CheckboxCmp key="check" instance={instance}/>;
   }

   renderInput(context, instance, key) {
      var {data} = instance;
      var text = data.text || getContent(this.renderChildren(context, instance));
      var {CSS, baseClass} = this;
      return this.renderWrap(context, instance, key, [
         this.native
            ? this.renderNativeCheck(context, instance)
            : this.renderCheck(context, instance),
         text && <div key="text" className={CSS.element(this.baseClass, "text")}>
            {text}
         </div>
      ]);
   }

   formatValue(context, {data}) {
      return data.value && data.text;
   }

   handleClick(e, instance) {
      if (this.native)
         e.stopPropagation();
      else {
         var el = document.getElementById(instance.data.id);
         if (el)
            el.focus();
         this.handleChange(e, instance, !instance.data.value)
      }
   }

   handleChange(e, instance, checked) {
      e.preventDefault();
      e.stopPropagation();

      var {data} = instance;

      if (data.readOnly || data.disabled)
         return;

      instance.set('value', checked != null ? checked : e.target.checked);
   }
}

Checkbox.prototype.baseClass = "checkbox";
Checkbox.prototype.native = false;

Widget.alias('checkbox', Checkbox);

class CheckboxCmp extends VDOM.Component {
   constructor(props) {
      super(props);
      this.state = {
         value: props.instance.data.value
      }
   }

   componentWillReceiveProps(props) {
      this.setState({
         value: props.instance.data.value
      });
   }

   shouldComponentUpdate(props, state) {
      return props.instance.shouldUpdate || state != this.state;
   }

   render() {
      var {instance} = this.props;
      var {data, widget} = instance;
      var {baseClass, CSS} = widget;


      return <div key="check"
                  tabIndex={data.disabled || data.readOnly ? null : 0}
                  className={CSS.element(baseClass, "input", {
                     checked: this.state.value
                  })}
                  style={CSS.parseStyle(data.inputStyle)}
                  id={data.id}
                  onClick={::this.onClick}
                  onKeyDown={::this.onKeyDown}
      >
         <Check className={CSS.element(baseClass, "input-check")} />
      </div>
   }

   onClick(e) {
      var {instance} = this.props;
      var {data, widget} = instance;
      if (!data.disabled && !data.readOnly) {
         e.stopPropagation();
         e.preventDefault();
         this.setState({value: !this.state.value});
         widget.handleChange(e, instance, !this.state.value);
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