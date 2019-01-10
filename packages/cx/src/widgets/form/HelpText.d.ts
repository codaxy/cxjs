import * as Cx from '../../core';
import { ValidationGroupProps } from './ValidationGroup';

export interface HelpTextProps extends Cx.HtmlElementProps {

   /** Base CSS class to be applied to the field. Defaults to `helptext`. */
   baseClass?: string
}

export class HelpText extends Cx.Widget<HelpTextProps> {}
