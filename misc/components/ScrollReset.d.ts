import { HtmlElement, HtmlElementConfig } from 'cx/widgets';
import { StructuredProp } from 'cx/ui';

export interface ScrollResetProps extends HtmlElementConfig {
   trigger?: StructuredProp
}

export class ScrollReset extends HtmlElement<ScrollResetProps> {}
