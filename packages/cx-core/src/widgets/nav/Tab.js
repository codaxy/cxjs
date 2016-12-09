import {Widget, VDOM} from '../../ui/Widget';
import {HtmlElement} from '../HtmlElement';

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
      var {data} = instance;
      data.stateMods = {
         active: data.tab == data.value,
         disabled: data.disabled,
         shape: this.shape
      };
      super.prepareData(context, instance);
   }

   isValidHtmlAttribute(attrName) {
      switch (attrName) {
         case 'value':
         case 'tab':
         case 'text':
         case 'disabled':
            return false;

         default:
            return super.isValidHtmlAttribute(attrName);
      }
   }

   attachProps(context, instance, props) {
      var {data} = instance;

      if (!data.disabled) {
         props.href = '#';
         delete props.value;

         props.onClick = e => {
            this.handleClick(e, instance)
         };
      }
   }

   handleClick(e, instance) {
      e.preventDefault();
      e.stopPropagation();

      var {data} = instance;

      if (data.disabled)
         return;

      instance.set('value', data.tab);
   }
}

Tab.prototype.baseClass = "tab";
Tab.prototype.tag = 'a';

Widget.alias('tab', Tab);