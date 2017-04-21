import * as Cx from '../core';

interface DocumentTitleProps extends Cx.WidgetProps {

   value?: Cx.StringProp,
   pure?: boolean,
   append?: boolean
   
}

export class DocumentTitle extends Cx.Widget<DocumentTitleProps> {}
