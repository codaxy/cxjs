import * as Cx from '../../core';
import { FieldProps } from './Field';

interface UploadButtonProps extends FieldProps {

   /** Set to `true` to disable the button. */
   disabled?: Cx.BooleanProp,
   
   /** Text description. */
   text?: Cx.StringProp,

   url?: Cx.StringProp, 

   /** Base CSS class to be applied to the element. Default is 'uploadbutton'. */
   baseClass?: string,

   multiple?: boolean,
   method?: string,
   uploadInProgressText?: string

}

export class UploadButton extends Cx.Widget<UploadButtonProps> {}
