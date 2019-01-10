import {Widget} from '../../ui/Widget';
import {Localization} from '../../ui/Localization';
import {DateTimeField} from './DateTimeField';

export class TimeField extends DateTimeField {}

TimeField.prototype.segment = "time";

Widget.alias('timefield', TimeField);
Localization.registerPrototype('cx/widgets/TimeField', TimeField);

