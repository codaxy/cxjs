import { Widget } from "../../ui/Widget";
import { ValidationGroup, ValidationGroupConfig } from "./ValidationGroup";

export interface FieldGroupConfig extends ValidationGroupConfig {}

export class FieldGroup<
   TConfig extends FieldGroupConfig = FieldGroupConfig
> extends ValidationGroup<TConfig> {}

Widget.alias("field-group", FieldGroup);
