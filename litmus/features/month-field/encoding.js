import { LabelsLeftLayout, LabelsTopLayout } from "cx/ui";
import { encodeDateWithTimezoneOffset } from "cx/util";
import { DateTimeField, LabeledContainer, MonthField } from "cx/widgets";

export default () => (
   <cx>
      <div style="margin: 20px;">
         <LabelsLeftLayout vertical>
            <LabeledContainer label="Without encoding">
               <MonthField range from-bind="$page.noEncoding.from" to-bind="$page.noEncoding.to" />
               <LabelsLeftLayout vertical>
                  <LabeledContainer label="Date1:">
                     <div text-bind="$page.noEncoding.from" />
                  </LabeledContainer>
                  <LabeledContainer label="Date2:">
                     <div text-bind="$page.noEncoding.to" />
                  </LabeledContainer>
               </LabelsLeftLayout>
            </LabeledContainer>

            <LabeledContainer label="With encoding">
               <MonthField
                  range
                  from-bind="$page.withEncoding.from"
                  to-bind="$page.withEncoding.to"
                  encoding={encodeDateWithTimezoneOffset}
               />
               <LabelsLeftLayout vertical>
                  <LabeledContainer label="Date1:">
                     <div text-bind="$page.withEncoding.from" />
                  </LabeledContainer>
                  <LabeledContainer label="Date2:">
                     <div text-bind="$page.withEncoding.to" />
                  </LabeledContainer>
               </LabelsLeftLayout>
            </LabeledContainer>
         </LabelsLeftLayout>
      </div>
   </cx>
);
