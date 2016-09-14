import {Widget, VDOM, getContent} from '../Widget';
import {Field} from './Field';
import {tooltipComponentWillReceiveProps, tooltipComponentWillUnmount, tooltipMouseMove, tooltipMouseLeave, tooltipComponentDidMount} from '../overlay/Tooltip';
import {stopPropagation} from '../eventCallbacks';

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
                    style={data.style}>
         {content}
      </label>
   }

   renderInput(context, instance, key) {
      var {data} = instance;
      var text = data.text || getContent(this.renderChildren(context, instance));
      var {CSS, baseClass} = this;
      return this.renderWrap(context, instance, key, [
         <input key="input"
                className={CSS.element(baseClass, "checkbox")}
                id={data.id}
                type="checkbox"
                checked={data.value || false}
                disabled={data.disabled}
                onClick={stopPropagation}
                onChange={ e => { this.handleChange(e, instance) } }/>,

         text && <div key="text" className={CSS.element(this.baseClass, "text")}>
            {text}
         </div>
      ]);
   }

   formatValue(context, {data}) {
      return data.value && data.text;
   }

   handleChange(e, instance) {
      e.preventDefault();
      e.stopPropagation();

      var {data} = instance;

      if (data.readOnly)
         return;

      instance.set('value', e.target.checked);
   }
}

Checkbox.prototype.baseClass = "checkbox";

Widget.alias('checkbox', Checkbox);
