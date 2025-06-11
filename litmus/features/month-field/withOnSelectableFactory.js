import { LabelsTopLayout } from "cx/ui";
import { LabeledContainer, MonthField, MonthPicker } from "cx/widgets";

export default () => (
   <cx>
      <div
         style="margin: 20px;"
         controller={{
            onInit() {
               this.store.set("$page.value", new Date());
               this.store.set("$page.value2", new Date());
            },
         }}
      >
         <LabelsTopLayout vertical columns={2}>
            <LabeledContainer label="Month Field - with minValue and startYear">
               <MonthField
                  value-bind="$page.value"
                  monthPickerOptions={{
                     startYear: 2015,
                  }}
                  minValue={new Date(2020, 1, 1)}
               />
            </LabeledContainer>

            <LabeledContainer label="Month Field - on selectable factory">
               <MonthField
                  value-bind="$page.value2"
                  minValue={new Date(2020, 1, 1)}
                  monthPickerOptions={{
                     startYear: 2015,
                     onCreateIsMonthDateSelectable: (params, { store }) => {
                        return (monthDate) => {
                           return isValidDate(monthDate);
                        };
                     },
                  }}
                  onValidate={(dateStr) => {
                     const monthDate = new Date(dateStr);
                     return !isValidDate(monthDate);
                  }}
               />
            </LabeledContainer>

            <LabeledContainer label="Normal Month Picker">
               <MonthPicker value-bind="$page.value" startYear={2015} minValue={new Date(2020, 1, 1)} />
            </LabeledContainer>
            <LabeledContainer label="Month Picker - on selectable factory">
               <MonthPicker
                  value-bind="$page.value2"
                  startYear={2015}
                  minValue={new Date(2020, 1, 1)}
                  onCreateIsMonthDateSelectable={({ store }) => {
                     return (monthDate) => {
                        return isValidDate(monthDate);
                     };
                  }}
               />
            </LabeledContainer>
         </LabelsTopLayout>
      </div>
   </cx>
);

const isValidDate = (monthDate) => {
   if (monthDate.getMonth() == 3) return false;
   if (monthDate.getMonth() % 5 == 0) return false;
   if (monthDate.getFullYear() == 2022) return false;
   if (
      monthDate.getFullYear() == 2023 &&
      (monthDate.getMonth() == 0 || monthDate.getMonth() == 1 || monthDate.getMonth() == 2)
   )
      return false;
   return true;
};
