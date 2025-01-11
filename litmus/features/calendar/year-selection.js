import { LabelsLeftLayout, createFunctionalComponent } from "cx/ui";
import { DateField } from "cx/widgets";
import Calendar from ".";

export default createFunctionalComponent(() => {
   return (
      <cx>
         <div>
            <LabelsLeftLayout>
               <DateField showTodayButton label="Full range" />
               <DateField showTodayButton label="Min date" minValue={new Date()} />
               <DateField showTodayButton label="Max range" maxValue={new Date()} />
               <Calendar />
            </LabelsLeftLayout>
         </div>
      </cx>
   );
});
