import * as Cx from '../../core';
import { FieldGroupProps } from './FieldGroup';

interface LabeledContainerProps extends FieldGroupProps {

   /** The label. */
   label?: Cx.StringProp | Cx.Config,
   
   /** Set to true to disable all fields inside the container. */
   disabled?: boolean,

   /** Apply asterisk to the label. */
   asterisk?: boolean
   
}

export class LabeledContainer extends Cx.Widget<LabeledContainerProps> {}
