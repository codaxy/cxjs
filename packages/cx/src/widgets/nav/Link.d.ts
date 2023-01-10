import * as React from "react";
import * as Cx from "../../core";
import { Instance } from "../../ui/Instance";
import { LinkButtonProps } from "./LinkButton";

interface LinkProps extends LinkButtonProps {
   /** Set to `true` to disable the link. */
   disabled?: Cx.BooleanProp;

   /** Url to the link's target location. Should start with `~/` or `#/` for pushState/hash based navigation. */
   href?: Cx.StringProp;

   url?: Cx.StringProp;

   /** Base CSS class to be applied to the element. No class is applied by default. */
   baseClass?: string;

   tag?: string;
   match?: "equal" | "prefix" | "subroute";

   activeClass?: Cx.ClassProp;
   activeStyle?: Cx.StyleProp;
   onClick?: string | ((e: React.SyntheticEvent<any>, instance: Instance) => void);
}

export class Link extends Cx.Widget<LinkProps> {}
