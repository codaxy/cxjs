import * as Cx from "../core";

interface CultureScopeProps extends Cx.PureContainerProps {
   culture: Cx.StringProp;
   numberCulture: Cx.StringProp;
   dateTimeCulture: Cx.StringProp;
   defaultCurrency: Cx.StringProp;
}

export class CultureScope extends Cx.Widget<CultureScopeProps> {}
