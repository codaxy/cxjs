import {Widget, VDOM} from '../../ui/Widget';
import {Button} from '../Button';
import {History} from '../../ui/app/History';
import {Url} from '../../ui/app/Url';

export class LinkButton extends Button {

   declareData() {
      super.declareData({
         href: undefined,
         url: undefined
      }, ...arguments);
   }

   prepareData(context, instance) {
      let {data} = instance;
      data.stateMods = {
         disabled: data.disabled,
         active: this.isActive(data)
      };
      if (typeof data.href == 'string')
         data.href = Url.resolve(data.href);
      super.prepareData(context, instance);
   }

   isActive(data) {
      switch (this.match) {
         default:
         case 'equal':
            return data.url == data.href;

         case 'prefix':
            return data.url && data.href && data.url.indexOf(data.href) == 0;
      }
   }

   attachProps(context, instance, props) {
      props.onClick = ev => {
         this.handleClick(ev, instance)
      };
      super.attachProps(context, instance, props);
   }

   isValidHtmlAttribute(attr) {
      if (attr == 'url' || attr == 'match')
         return false;
      return super.isValidHtmlAttribute(attr);
   }

   handleClick(e, instance) {
      let {data} = instance;


      if (data.disabled) {
         e.preventDefault();
         return;
      }

      if (this.onClick && this.onClick(e, instance) === false)
         return;

      if (Url.isLocal(data.href)) {
         e.preventDefault();
         History.pushState({}, null, data.href);
      }
   }
}

LinkButton.prototype.match = "equal";
LinkButton.prototype.tag = 'a';

Widget.alias('link-button', LinkButton);