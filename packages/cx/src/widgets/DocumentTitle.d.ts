import * as Cx from '../core';

interface DocumentTitleProps extends Cx.WidgetProps {

   value?: Cx.StringProp,
   append?: boolean,
   action?: 'append' | 'replace' | 'prepend'
}

export class DocumentTitle extends Cx.Widget<DocumentTitleProps> {}
