import * as Cx from "../core";

interface HoverSyncProps extends Cx.PureContainerProps {}

export class HoverSync extends Cx.Widget<HoverSyncProps> {}

interface HoverSyncElementProps extends Cx.HtmlElementProps {
   hoverStyle?: Cx.StyleProp;
   hoverClass?: Cx.ClassProp;
   hoverId?: Cx.Prop<any>;
}

export class HoverSyncElement extends Cx.Widget<HoverSyncElementProps> {}
