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
               this.store.set("$page.value3", new Date());
               this.store.set("$page.disabledValues", {
                  years: [2021, 2022, 2027],
                  months: {
                     2023: [4, 5, 6, 7],
                     2025: [12],
                     2026: [1, 4, 7],
                  },
                  quarters: {
                     2024: [1, 3],
                  },
               });
            },
         }}
      >
         <LabelsTopLayout vertical columns={3}>
            <LabeledContainer label="Month Field - with minValue and startYear">
               <MonthField
                  value-bind="$page.value"
                  monthPickerOptions={{ startYear: 2015 }}
                  minValue={new Date(2020, 1, 1)}
               />
            </LabeledContainer>

            <LabeledContainer label="Month Field - custom disabled periods">
               <MonthField
                  value-bind="$page.value2"
                  monthPickerOptions={{
                     startYear: 2015,
                  }}
                  onValidateDate={({ store }, date) => {
                     const values = store.get("$page.disabledValues");
                     const year = date.getFullYear();
                     const month = date.getMonth() + 1;
                     const quarter = Math.ceil(month / 3);

                     if (values.years.find((y) => y == year)) return false;
                     if (values.quarters[year] && values.quarters[year].find((q) => q == quarter)) return false;
                     if (values.months[year] && values.months[year].find((m) => m == month)) return false;

                     return true;
                  }}
               />
            </LabeledContainer>

            <LabeledContainer label="Month Field - disabled periods with hidden quarters">
               <MonthField
                  value-bind="$page.value3"
                  monthPickerOptions={{
                     startYear: 2015,
                     hideQuarters: true,
                  }}
                  onValidateDate={({ store }, date) => {
                     const values = store.get("$page.disabledValues");
                     const year = date.getFullYear();
                     const month = date.getMonth() + 1;
                     const quarter = Math.ceil(month / 3);

                     if (values.years.find((y) => y == year)) return false;
                     if (values.quarters[year] && values.quarters[year].find((q) => q == quarter)) return false;
                     if (values.months[year] && values.months[year].find((m) => m == month)) return false;

                     return true;
                  }}
               />
            </LabeledContainer>

            <LabeledContainer label="Normal Month Picker">
               <MonthPicker value-bind="$page.value" startYear={2015} minValue={new Date(2020, 1, 1)} />
            </LabeledContainer>
            <LabeledContainer label="Month Picker - custom disabled periods">
               <MonthPicker
                  value-bind="$page.value2"
                  startYear={2015}
                  onValidateDate={(_, date) => {
                     if (date.getMonth() == 3) return false;
                     if (date.getMonth() % 5 == 0) return false;
                     return true;
                  }}
               />
            </LabeledContainer>
            <LabeledContainer label="Month Picker - disabled periods with hidden quarters">
               <MonthPicker
                  value-bind="$page.value3"
                  hideQuarters={true}
                  startYear={2015}
                  onValidateDate={({ store }, date) => {
                     const values = store.get("$page.disabledValues");
                     const year = date.getFullYear();
                     const month = date.getMonth() + 1;
                     const quarter = Math.ceil(month / 3);

                     if (values.years.find((y) => y == year)) return false;
                     if (values.quarters[year] && values.quarters[year].find((q) => q == quarter)) return false;
                     if (values.months[year] && values.months[year].find((m) => m == month)) return false;

                     return true;
                  }}
               />
            </LabeledContainer>
         </LabelsTopLayout>
      </div>
   </cx>
);
