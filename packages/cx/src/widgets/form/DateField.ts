import { Widget } from "../../ui/Widget";
import { Localization } from "../../ui/Localization";
import { DateTimeField, DateTimeFieldConfig } from "./DateTimeField";

export interface DateFieldConfig extends DateTimeFieldConfig {}

export class DateField extends DateTimeField {
   declare public picker: string;
   declare public segment: string;

   constructor(config?: DateFieldConfig) {
      super(config);
   }
}

DateField.prototype.picker = "calendar";
DateField.prototype.segment = "date";

Widget.alias("datefield", DateField);
Localization.registerPrototype("cx/widgets/DateField", DateField);

