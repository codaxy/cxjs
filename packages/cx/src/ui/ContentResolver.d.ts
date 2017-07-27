import * as Cx from '../core';

interface ContentResolverProps extends Cx.PureContainerProps {

   params?: Cx.StructuredProp,
   mode?: 'replace' | 'prepend' | 'append',

   onResolve?: (params, Instance) => any,

   loading?: Cx.BooleanProp
}

export class ContentResolver extends Cx.Widget<ContentResolverProps> {}
