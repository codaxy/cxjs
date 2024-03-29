import * as Cx from "../../core";
import { FieldProps } from "./Field";

interface UploadButtonProps extends FieldProps {
   /** Text description. */
   text?: Cx.StringProp;

   url?: Cx.StringProp;

   /** Base CSS class to be applied to the element. Default is 'uploadbutton'. */
   baseClass?: string;

   /** Defaults to `false`. Set to `true` to enable multiple selection. */
   multiple?: boolean;

   method?: string;
   uploadInProgressText?: string;

   /** Defaults to `false`. Set to `true` to abort uploads if the button is destroyed (unmounted). */
   abortOnDestroy?: boolean;

   /** Defines file types that are accepted for upload. */
   accept?: Cx.StringProp;

   /** Name of the icon to be put on the left side of the button. */
   icon?: Cx.StringProp;

   onUploadStarting?: ((xhr: XMLHttpRequest, instance: any, file: File, formData: FormData) => boolean) | string;
   onUploadComplete?: ((xhr: XMLHttpRequest, instance: any, file: File, formData: FormData) => void) | string;
   onUploadProgress?: ((event: ProgressEvent, instance: any, file: File, formData: FormData) => void) | string;
   onUploadError?: ((event: ProgressEvent, instance: any, file: File, formData: FormData) => void) | string;
}

export class UploadButton extends Cx.Widget<UploadButtonProps> {}
