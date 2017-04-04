import * as Cx from '../../core';
import { FieldGroupProps } from './FieldGroup';

interface LabeledContainerProps extends FieldGroupProps {

   /** Field label. For advanced use cases. */
   label?: Cx.StringProp | Cx.Config,
   
   /** Appearance modifier. For example, mod="big" will add the CSS class .cxm-big to the block element. */
   mod?: string | array,

   // TODO: check if these are just internal props or need to be documented?
   disabled?: boolean,
   asterisk?: boolean
}

export class LabeledContainer extends Cx.Widget<LabeledContainerProps> {}
