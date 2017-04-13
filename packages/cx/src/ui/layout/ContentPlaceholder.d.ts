import * as Cx from '../../core';

interface ContentPlaceholderProps extends Cx.PureContainerProps {

   name?: Cx.StringProp

}

export class ContentPlaceholder extends Cx.Widget<ContentPlaceholderProps> {}
