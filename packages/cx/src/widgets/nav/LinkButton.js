import { Widget, VDOM } from "../../ui/Widget";
import { Button } from "../Button";
import { History } from "../../ui/app/History";
import { Url } from "../../ui/app/Url";
import { routeAppend } from "../../util/routeAppend";
import { parseStyle } from "../../util/parseStyle";

export class LinkButton extends Button {
   init() {
      this.activeStyle = parseStyle(this.activeStyle);
      super.init();
   }

   declareData() {
      super.declareData(
         {
            href: undefined,
            url: undefined,
            active: undefined,
            activeClass: undefined,
            activeStyle: undefined,
         },
         ...arguments
      );
   }

   prepareData(context, instance) {
      let { data } = instance;

      data.unresolvedHref = data.href;

      if (typeof data.href === "string") {
         if (data.unresolvedHref[0] === "+")
            data.unresolvedHref = routeAppend(context.lastRoute.reverse(), data.href.substring(1));

         data.href = Url.resolve(data.unresolvedHref);
      }

      let active = this.isActive(data);

      data.stateMods = {
         disabled: data.disabled,
         active,
      };

      super.prepareData(context, instance);

      if (active) {
         if (data.activeClass) data.classNames += " " + data.activeClass;
         if (data.activeStyle)
            data.style = {
               ...data.style,
               ...parseStyle(data.activeStyle),
            };
      }
   }

   isActive(data) {
      if (data.active != null) return data.active;

      switch (this.match) {
         default:
         case "equal":
            return data.url === data.unresolvedHref;

         case "prefix":
            return data.url && data.unresolvedHref && data.url.indexOf(data.unresolvedHref) === 0;

         case "subroute":
            return (
               data.url &&
               data.unresolvedHref &&
               data.url.indexOf(data.unresolvedHref) === 0 &&
               (data.url === data.unresolvedHref || data.url[data.unresolvedHref.length] === "/")
            );
      }
   }

   attachProps(context, instance, props) {
      props.onClick = (ev) => {
         this.handleClick(ev, instance);
      };
      super.attachProps(context, instance, props);
      props.href = instance.data.href;
      delete props.active;
      delete props.activeClass;
      delete props.activeStyle;
   }

   isValidHtmlAttribute(attr) {
      if (attr === "url" || attr === "match") return false;
      return super.isValidHtmlAttribute(attr);
   }

   handleClick(e, instance) {
      let { data } = instance;

      if (data.disabled) {
         e.preventDefault();
         return;
      }

      if (this.onClick && instance.invoke("onClick", e, instance) === false) return;

      if (data.href && Url.isLocal(data.href) && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
         e.preventDefault();
         History.pushState({}, null, data.href);
      }
   }
}

LinkButton.prototype.match = "equal";
LinkButton.prototype.tag = "a";

Widget.alias("link-button", LinkButton);
