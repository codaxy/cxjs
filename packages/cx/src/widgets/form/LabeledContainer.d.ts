import * as Cx from "../../core";
import { FieldGroupProps } from "./FieldGroup";

interface LabeledContainerProps extends FieldGroupProps {
   /** The label. */
   label?: Cx.StringProp | Cx.Config;

   /** Apply asterisk to the label. */
   asterisk?: boolean;
}

export class LabeledContainer extends Cx.Widget<LabeledContainerProps> {}
