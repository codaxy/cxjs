import * as Cx from "../../core";
import { RenderingContext } from "../RenderingContext";

interface ContentPlaceholderProps extends Cx.PureContainerProps {
   name?: Cx.StringProp;

   scoped?: boolean;

   /* Set to true to allow all registered content elements to render inside the placeholder. Otherwise only one element is rendered. */
   allowMultiple?: boolean;
}

export class ContentPlaceholder extends Cx.Widget<ContentPlaceholderProps> {}

interface ContentPlaceholderScopeProps extends Cx.PureContainerProps {
   name?: string | string[];
}

export class ContentPlaceholderScope extends Cx.Widget<ContentPlaceholderScopeProps> {}
