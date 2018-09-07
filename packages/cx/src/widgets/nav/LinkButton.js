import {Widget, VDOM} from '../../ui/Widget';
import {Button} from '../Button';
import {History} from '../../ui/app/History';
import {Url} from '../../ui/app/Url';
import {routeAppend} from "../../util/routeAppend";

export class LinkButton extends Button {

   declareData() {
      super.declareData({
         href: undefined,
         url: undefined
      }, ...arguments);
   }

   prepareData(context, instance) {
      let {data} = instance;

      data.unresolvedHref = data.href;

      if (typeof data.href === 'string') {
         if (data.unresolvedHref[0] === '+')
            data.unresolvedHref = routeAppend(context.lastRoute.reverse(), data.href.substring(1));

         data.href = Url.resolve(data.unresolvedHref);
      }

      data.stateMods = {
         disabled: data.disabled,
         active: this.isActive(data)
      };

      super.prepareData(context, instance);
   }

   isActive(data) {
      switch (this.match) {
         default:
         case 'equal':
            return data.url === data.unresolvedHref;

         case 'prefix':
            return data.url && data.unresolvedHref && data.url.indexOf(data.unresolvedHref) === 0;

         case 'subroute':
            return data.url 
               && data.unresolvedHref 
               && data.url.indexOf(data.unresolvedHref) === 0 
               && (data.url === data.unresolvedHref || data.url[data.unresolvedHref.length] === "/");
      }
   }

   attachProps(context, instance, props) {
      props.onClick = ev => {
         this.handleClick(ev, instance)
      };
      super.attachProps(context, instance, props);
      props.href = instance.data.href;
   }

   isValidHtmlAttribute(attr) {
      if (attr === 'url' || attr === 'match')
         return false;
      return super.isValidHtmlAttribute(attr);
   }

   handleClick(e, instance) {
      let {data} = instance;

      if (data.disabled) {
         e.preventDefault();
         return;
      }

      if (this.onClick && instance.invoke("onClick", e, instance) === false)
         return;

      if (data.href && Url.isLocal(data.href)) {
         e.preventDefault();
         History.pushState({}, null, data.href);
      }
   }
}

LinkButton.prototype.match = "equal";
LinkButton.prototype.tag = 'a';

Widget.alias('link-button', LinkButton);