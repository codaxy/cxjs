import {Widget, VDOM, getContent} from '../Widget';
import {Field} from './Field';
import {tooltipComponentWillReceiveProps, tooltipComponentWillUnmount, tooltipMouseMove, tooltipMouseLeave, tooltipComponentDidMount} from '../overlay/Tooltip';
import {stopPropagation} from '../eventCallbacks';

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
                    onMouseMove={e=>tooltipMouseMove(e, instance)}
                    onMouseLeave={e=>tooltipMouseLeave(e, instance)}
                    htmlFor={data.id}>
         {content}
      </label>
   }

   renderInput(context, instance, key) {
      var {data} = instance;
      var text = data.text || getContent(this.renderChildren(context, instance));
      var {CSS} = this;
      return this.renderWrap(context, instance, key, [
         <input key="input"
                className={CSS.element(this.baseClass, "radio")}
                id={data.id}
                type="radio"
                checked={data.checked}
                disabled={data.disabled}
                onClick={stopPropagation}
                onChange={ e => { this.handleChange(e, instance) } }/>,

         text && <div key="text" className={CSS.element(this.baseClass, "text")}>
            {text}
         </div>
      ]);
   }

   handleChange(e, instance) {
      e.preventDefault();
      var {data} = instance;
      if (data.readOnly)
         return;
      instance.set('value', data.option);
   }
}

Radio.prototype.baseClass = "radio";

Widget.alias('radio', Radio);