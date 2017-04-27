import * as Cx from '../core';

interface IsolatedScopeProps extends Cx.PureContainerProps {
   /**
    * A single binding path or a list of paths to be monitored for changes.
    * Use `bind` as a shorthand for defining the `data` object.
    */
   bind?: string | string[],


   /** Data object selector. The children will update only if `data` change. */
   data?: Cx.StructuredProp
}

export class IsolatedScope extends Cx.Widget<IsolatedScopeProps> {
}
