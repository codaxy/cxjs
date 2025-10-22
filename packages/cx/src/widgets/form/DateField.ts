import { Widget } from "../../ui/Widget";
import { Localization } from "../../ui/Localization";
import { DateTimeField } from "./DateTimeField";

export class DateField extends DateTimeField {
   public picker: string = "calendar";
   public segment: string = "date";
}

Widget.alias("datefield", DateField);
Localization.registerPrototype("cx/widgets/DateField", DateField);

