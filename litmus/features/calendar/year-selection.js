import { LabelsLeftLayout, LabelsTopLayout, createFunctionalComponent } from "cx/ui";
import { DateField, DateTimeField } from "cx/widgets";

export default createFunctionalComponent(() => {
   return (
      <cx>
         <div>
            <LabelsLeftLayout>
               <DateField showTodayButton label="Test" />
            </LabelsLeftLayout>
         </div>
      </cx>
   );
});
