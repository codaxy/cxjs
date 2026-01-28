import { LabelsLeftLayout } from "cx/ui";
import { LabeledContainer, MonthField, MonthPicker, NumberField } from "cx/widgets";

export default () => (
   <cx>
      <div
         style="margin: 20px;"
         controller={{
            onInit() {
               this.store.set("$page.value", new Date());
               this.store.set("$page.value2", new Date());
               this.store.set("$page.value3", new Date());
               this.store.set("$page.value4", new Date());
            },
         }}
      >
         <LabelsLeftLayout vertical>
            <LabeledContainer label="Normal Month Field">
               <MonthField value-bind="$page.value" />
               <span text-tpl="{$page.value:d}" style="font-size: 14px; margin: 10px" />
            </LabeledContainer>
            <LabeledContainer label="With month picker options">
               <MonthField value-bind="$page.value2" monthPickerOptions={{ startYear: 2024, endYear: 2029 }} />
               <span text-tpl="{$page.value2:d}" style="font-size: 14px; margin: 10px" />
            </LabeledContainer>
         </LabelsLeftLayout>
      </div>
   </cx>
);
