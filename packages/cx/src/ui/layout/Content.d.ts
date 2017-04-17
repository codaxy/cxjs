import * as Cx from '../../core';

interface ContentProps extends Cx.PureContainerProps {

   name?: string,
   putInto?: string,
   isContent?: boolean

}

export class Content extends Cx.Widget<ContentProps> {}
