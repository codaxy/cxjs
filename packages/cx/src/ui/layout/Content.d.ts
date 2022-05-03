import * as Cx from '../../core';

interface ContentProps extends Cx.PureContainerProps {


   /** Placeholder name where the content is rendered. */
   name?: string,

   isContent?: boolean

}

export class Content extends Cx.Widget<ContentProps> {}
