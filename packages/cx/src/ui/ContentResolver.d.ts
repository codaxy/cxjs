import * as Cx from '../core';

interface ContentResolverProps extends Cx.PureContainerProps {

   params?: Cx.StructuredProp,
   mode?: 'replace' | 'prepend' | 'append'

}

export class ContentResolver extends Cx.Widget<ContentResolverProps> {}
