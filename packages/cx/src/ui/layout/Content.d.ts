import * as Cx from '../../core';

interface ContentProps extends Cx.PureContainerProps {


   /** Placeholder name where the content is rendered. Interchangeable with `for` property, but has a lower priority. */
   name?: string,

     /** Placeholder name where the content is rendered. Interchangeable with `name` property, but has a higher priority. */
   for?: string,

   isContent?: boolean

}

export class Content extends Cx.Widget<ContentProps> {}
