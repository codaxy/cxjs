import * as Cx from '../../core';
import { FieldGroups } from './FieldGroup';

interface LabeledContainerProps extends FieldGroups {

   /** Field label. For advanced use cases. */
   label?: Cx.Prop< string | config>,
   
   /** 
    * Appearance modifier.
    *  For example, mod="big" will add the CSS class .cxm-big to the block element.
    */
   mod?: string | array,

   disabled?:
   asterisk?:
}

export class LabeledContainer extends Cx.Widget<LabeledContainerProps> {}
