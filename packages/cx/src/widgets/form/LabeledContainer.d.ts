import * as Cx from "../../core";
import { FieldGroupProps } from "./FieldGroup";

interface LabeledContainerProps extends FieldGroupProps {
   /** The label. */
   label?: Cx.StringProp | Cx.Config;
}

export class LabeledContainer extends Cx.Widget<LabeledContainerProps> {}
