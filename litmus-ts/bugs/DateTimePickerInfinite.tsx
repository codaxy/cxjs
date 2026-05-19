import { bind, createFunctionalComponent } from "cx/ui";
import {
  DateField,
  DateTimeField,
  DateTimePicker,
  TimeField,
} from "cx/widgets";

export default createFunctionalComponent(() => {
  return (
    <cx>
      <DateTimePicker></DateTimePicker>
      <DateTimeField value={bind("dateTimeData")}></DateTimeField>
      <DateField></DateField>
      <TimeField value={bind("timeData")}></TimeField>
    </cx>
  );
});
