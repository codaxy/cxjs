import { Widget, VDOM } from "../../ui/Widget";
import { Button } from "../Button";
import { History } from "../../ui/app/History";
import { Url } from "../../ui/app/Url";
import { routeAppend } from "../../util/routeAppend";
import { parseStyle } from "../../util/parseStyle";
import { StringProp, StyleProp, ClassProp, Prop } from "../../ui/Prop";
import { Instance } from "../../ui/Instance";
import { RenderingContext } from "../../ui/RenderingContext";
import { ButtonConfig } from "../Button";
import { HtmlElementInstance } from "../HtmlElement";

export interface LinkButtonConfig extends ButtonConfig {
   /** Url to the link's target location. Should start with `~/` or `#/` for pushState/hash based navigation. */
   href?: StringProp;

   /** Binding to the current url location in the store. If `href` matches `url`, additional CSS class `active` is applied. */
   url?: StringProp;

   /**
    * Accepted values are `equal`, `prefix` and `subroute`. Default is `equal` which means that `url` must exactly match `href` in order to consider the link active.
    * In `prefix` mode, if `href` is a prefix of `url`, the link is considered active. The `subroute` mode is similar to `prefix` mode, except that `href` must be followed by a forward slash `/`, indicating
    * a subroute.
    */
   match?: "equal" | "prefix" | "subroute";

   /** Explicitly set the active state of the link. If not set, the active state is determined by comparing `href` and `url`. */
   active?: Prop<boolean>;

   /** Additional CSS style to applied when the link is active. */
   activeStyle?: StyleProp;

   /** Additional CSS style to applied when the link is inactive. */
   inactiveStyle?: StyleProp;

   /** Additional CSS class to applied when the link is active. */
   activeClass?: ClassProp;

   /** Additional CSS class to applied when the link is inactive. */
   inactiveClass?: ClassProp;

   /** Where to display the linked URL, as the name for a browsing context (a tab, window, or <iframe>) */
   target?: Prop<"_self" | "_blank" | "_parent" | "_top" | (string & {})>;
}

export class LinkButton extends Button {
   constructor(config?: LinkButtonConfig) {
      super(config);
   }

   declare match: "equal" | "prefix" | "subroute";
   declare activeStyle: any;
   declare inactiveStyle: any;
   declare onClick?: string | ((e: MouseEvent, instance: Instance) => void);
   declare tag: string;

   init() {
      this.activeStyle = parseStyle(this.activeStyle);
      this.inactiveStyle = parseStyle(this.inactiveStyle);
      super.init();
   }

   declareData() {
      super.declareData(
         {
            href: undefined,
            url: undefined,
            target: undefined,
            active: undefined,
            activeClass: undefined,
            activeStyle: undefined,
            inactiveClass: undefined,
            inactiveStyle: undefined,
         },
         ...arguments,
      );
   }

   prepareData(context: RenderingContext, instance: HtmlElementInstance) {
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
      } else {
         if (data.inactiveClass) data.classNames += " " + data.inactiveClass;
         if (data.inactiveStyle)
            data.style = {
               ...data.style,
               ...parseStyle(data.inactiveStyle),
            };
      }
   }

   isActive(data: any) {
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

   attachProps(context: RenderingContext, instance: HtmlElementInstance, props: any) {
      props.onClick = (ev: any) => {
         this.handleClick(ev, instance);
      };
      super.attachProps(context, instance, props);
      props.href = instance.data.href;
      delete props.active;
      delete props.activeClass;
      delete props.activeStyle;
      delete props.inactiveClass;
      delete props.inactiveStyle;
   }

   isValidHtmlAttribute(attr: string) {
      if (attr === "url" || attr === "match") return false;
      return super.isValidHtmlAttribute(attr);
   }

   handleClick(e: React.MouseEvent, instance: Instance) {
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
