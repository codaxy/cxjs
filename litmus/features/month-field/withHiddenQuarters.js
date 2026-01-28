import { LabelsLeftLayout } from "cx/ui";
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
         <LabelsLeftLayout vertical>
            <LabeledContainer label="MonthField - Without hidden quarters section">
               <MonthField value-bind="$page.value" />
            </LabeledContainer>
            <LabeledContainer label="MonthField - With hidden quarters">
               <MonthField value-bind="$page.value2" monthPickerOptions={{ hideQuarters: true }} />
            </LabeledContainer>

            <LabeledContainer label="MonthPicker - Without hidden quarters section">
               <MonthPicker value-bind="$page.value" />
            </LabeledContainer>
            <LabeledContainer label="MonthPicker - With hidden quarters">
               <MonthPicker value-bind="$page.value2" hideQuarters={true} />
            </LabeledContainer>
         </LabelsLeftLayout>
      </div>
   </cx>
);
