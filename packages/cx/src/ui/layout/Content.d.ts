import * as Cx from "../../core";

interface ContentProps extends Cx.PureContainerProps {
   /** Placeholder name where the content is rendered. */
   name?: string;

   /** Placeholder name where the content is rendered. */
   for?: string;

   /** Placeholder name where the content is rendered. */
   putInto?: string;
}

export class Content extends Cx.Widget<ContentProps> {}
