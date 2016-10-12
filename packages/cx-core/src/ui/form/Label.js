import {Widget, VDOM} from '../Widget';
import {HtmlElement} from '../HtmlElement';
import {FocusManager} from '../FocusManager';

export class Label extends HtmlElement {

   declareData() {
      super.declareData(...arguments, {
         required: undefined,
         htmlFor: undefined
      })
   }

   explore(context, instance) {
      if (!instance.data.htmlFor)
         instance.data.htmlFor = context.lastFieldId;
      super.explore(context, instance);
   }

   attachProps(context, instance, props) {
      super.attachProps(context, instance, props);
      props.htmlFor = instance.data.htmlFor;

      if (!props.onClick && instance.data.htmlFor)
         props.onClick = () => {
            //additional focus for LookupFields which are not input based
            let el = document.getElementById(instance.data.htmlFor);
            if (el)
               FocusManager.focusFirst(el);
         };

      let {data} = instance;
      if (this.asterisk && data.required) {
         if (!Array.isArray(props.children))
            props.children = [props.children];
         props.children.push(' ');
         props.children.push(<span className={this.CSS.element(this.baseClass, 'asterisk')}>*</span>)
      }
   }
}

Label.prototype.baseClass = "label";
Label.prototype.tag = "label";
Label.prototype.asterisk = false;