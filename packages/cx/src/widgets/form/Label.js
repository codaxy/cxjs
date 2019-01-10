import {Widget, VDOM} from '../../ui/Widget';
import {HtmlElement} from '../HtmlElement';
import {FocusManager} from '../../ui/FocusManager';
import {isArray} from '../../util/isArray';

export class Label extends HtmlElement {

   declareData() {
      super.declareData(...arguments, {
         required: undefined,
         disabled: undefined,
         htmlFor: undefined
      })
   }

   prepareData(context, instance) {
      let {data} = instance;
      data.stateMods = {
         ...data.stateMods,
         disabled: data.disabled
      };
      super.prepareData(context, instance);
   }

   explore(context, instance) {
      if (!instance.data.htmlFor)
         instance.data.htmlFor = context.lastFieldId;
      super.explore(context, instance);
   }

   isValidHtmlAttribute(attrName) {
      switch (attrName) {
         case "asterisk":
         case "required":
            return false;
      }
      return super.isValidHtmlAttribute(attrName);
   }

   attachProps(context, instance, props) {
      super.attachProps(context, instance, props);
      if (instance.data.htmlFor) {
         props.htmlFor = instance.data.htmlFor;

         if (!props.onClick)
            props.onClick = () => {
               //additional focus for LookupFields which are not input based
               let el = document.getElementById(instance.data.htmlFor);
               if (el)
                  FocusManager.focusFirst(el);
            };
      }

      let {data} = instance;
      if (this.asterisk && data.required) {
         if (!isArray(props.children))
            props.children = [props.children];
         props.children.push(' ');
         props.children.push(<span key="asterisk" className={this.CSS.element(this.baseClass, 'asterisk')}>*</span>)
      }
   }
}

Label.prototype.baseClass = "label";
Label.prototype.tag = "label";
Label.prototype.asterisk = false;