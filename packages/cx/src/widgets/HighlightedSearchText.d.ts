import * as Cx from "../core";

interface HighlightedSearchTextProps extends Cx.WidgetProps {
   query?: Cx.StringProp;
   text?: Cx.StringProp;
   chunks?: Cx.Prop<string[]>;
}

export class HighlightedSearchText extends Cx.Widget<HighlightedSearchTextProps> {}
