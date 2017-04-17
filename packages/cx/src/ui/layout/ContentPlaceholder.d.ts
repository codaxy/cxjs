import * as Cx from '../../core';
import {RenderingContext} from '../RenderingContext';

interface ContentPlaceholderProps extends Cx.PureContainerProps {

   name?: Cx.StringProp

}

export class ContentPlaceholder extends Cx.Widget<ContentPlaceholderProps> {}

export function contentSandbox(context: RenderingContext, name: string, exploreFunction: () => void);
