import * as Cx from "../../core";
import { FieldProps } from "./Field";

interface ValidatorProps extends FieldProps {
   value: Cx.StructuredProp;
}

export class Validator extends Cx.Widget<ValidatorProps> {}
