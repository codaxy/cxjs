import {Widget} from '../../ui/Widget';
import {Localization} from '../../ui/Localization';
import {DateTimeField} from './DateTimeField';

export class DateField extends DateTimeField {}

DateField.prototype.picker = "calendar";
DateField.prototype.segment = "date";

Widget.alias('datefield', DateField);
Localization.registerPrototype('cx/widgets/DateField', DateField);

