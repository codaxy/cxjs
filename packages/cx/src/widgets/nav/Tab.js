import {Widget, VDOM} from '../../ui/Widget';
import {HtmlElement} from '../HtmlElement';
import {preventFocusOnTouch} from '../../ui/FocusManager';
import {isUndefined} from '../../util/isUndefined';

export class Tab extends HtmlElement {

   declareData() {
      super.declareData({
         tab: undefined,
         value: undefined,
         disabled: undefined,
         text: undefined
      }, ...arguments);
   }

   prepareData(context, instance) {
      let {data} = instance;
      data.stateMods = {
         active: data.tab == data.value,
         disabled: data.disabled,
         shape: this.shape
      };
      if (this.default && isUndefined(data.value))
         instance.set('value', data.tab);
      super.prepareData(context, instance);
   }

   isValidHtmlAttribute(attrName) {
      switch (attrName) {
         case 'value':
         case 'tab':
         case 'text':
         case 'disabled':
         case 'default':
            return false;

         default:
            return super.isValidHtmlAttribute(attrName);
      }
   }

   attachProps(context, instance, props) {
      super.attachProps(context, instance, props);

      let {data} = instance;
      if (!data.disabled) {
         props.href = '#';
         delete props.value;

         props.onMouseDown = e => {
            if (this.onMouseDown)
               instance.invoke('onMouseDown', e, instance);
            preventFocusOnTouch(e);
         };

         props.onClick = e => this.handleClick(e, instance);
      }
   }

   handleClick(e, instance) {

      if (this.onClick)
         instance.invoke('onClick', e, instance);

      e.preventDefault();
      e.stopPropagation();

      let {data} = instance;

      if (data.disabled)
         return;

      instance.set('value', data.tab);
   }
}

Tab.prototype.baseClass = "tab";
Tab.prototype.tag = 'a';
Tab.prototype.focusOnMouseDown = false;
Tab.prototype.default = false;

Widget.alias('tab', Tab);