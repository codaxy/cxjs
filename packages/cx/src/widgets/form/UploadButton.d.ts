import * as Cx from '../../core';
import { FieldProps } from './Field';

interface UploadButtonProps extends FieldProps {
 
   /** Text description. */
   text?: Cx.StringProp,

   url?: Cx.StringProp, 

   /** Base CSS class to be applied to the element. Default is 'uploadbutton'. */
   baseClass?: string,
   
   /** Defaults to `false`. Set to `true` to enable multiple selection. */
   multiple?: boolean,
   
   method?: string,
   uploadInProgressText?: string,

   /** Defaults to `false`. Set to `true` to abort uploads if the button is destroyed (unmounted). */
   abortOnDestroy: boolean
}

export class UploadButton extends Cx.Widget<UploadButtonProps> {}
