import * as Cx from "../../core";
import { ButtonProps } from "../Button";

export interface LinkButtonProps extends ButtonProps {
   /** Url to the link's target location. Should start with `~/` or `#/` for pushState/hash based navigation. */
   href?: Cx.StringProp;

   /** Binding to the current url location in the store. If `href` matches `url`, additional CSS class `active` is applied. */
   url?: Cx.StringProp;

   /**
    * Accepted values are `equal`, `prefix` and `subroute`. Default is `equal` which means that `url` must exactly match `href` in order to consider the link active.
    * In `prefix` mode, if `href` is a prefix of `url`, the link is considered active. The `subroute` mode is similar to `prefix` mode, except that `href` must be followed by a forward slash `/`, indicating
    * a subroute.
    */
   match?: "equal" | "prefix" | "subroute";

   /** Additional CSS style to aplied when the link is active. */
   activeStyle?: Cx.StyleProp;

   /** Additional CSS style to aplied when the link is inactive. */
   inactiveStyle?: Cx.StyleProp;

   /** Additional CSS class to aplied when the link is active. */
   activeClass?: Cx.StyleProp;

   /** Additional CSS class to aplied when the link is inactive. */
   inactiveClass?: Cx.StyleProp;

   /** Where to display the linked URL, as the name for a browsing context (a tab, window, or <iframe>) */
   target?: Cx.Prop<"_self" | "_blank" | "_parent" | "_top" | (string & {})>;
}

export class LinkButton extends Cx.Widget<LinkButtonProps> {}
