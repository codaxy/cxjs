import * as Cx from '../../core';
import {RenderingContext} from '../RenderingContext';

interface ContentPlaceholderProps extends Cx.PureContainerProps {

   name?: Cx.StringProp,

   scoped?: boolean
}

export class ContentPlaceholder extends Cx.Widget<ContentPlaceholderProps> {}


interface ContentPlaceholderScopeProps extends Cx.PureContainerProps {
   name?: string | string[]
}

export class ContentPlaceholderScope extends Cx.Widget<ContentPlaceholderScopeProps> {}