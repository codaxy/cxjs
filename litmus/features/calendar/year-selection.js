import { LabelsLeftLayout, createFunctionalComponent } from "cx/ui";
import { DateField } from "cx/widgets";

export default createFunctionalComponent(() => {
   return (
      <cx>
         <div>
            <LabelsLeftLayout>
               <DateField showTodayButton label="Full range" />
               <DateField showTodayButton label="Min date" minValue={new Date()} />
               <DateField showTodayButton label="Max range" maxValue={new Date()} />
            </LabelsLeftLayout>
         </div>
      </cx>
   );
});
