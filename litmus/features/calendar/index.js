import { computable } from "cx/ui";
import { Calendar } from "cx/widgets";

export default (
   <cx>
      <div
         style="padding: 32px"
         controller={{
            onInit() {
               this.store.set("days", [
                  {
                     date: new Date().toDateString(),
                     weekend: true,
                  },
               ]);
            },
         }}
      >
         <Calendar
            value-bind="value"
            dayData={computable("days", (days) => {
               if (!days) return null;
               let result = {};
               for (let day of days) {
                  if (day.weekend)
                     result[day.date] = {
                        mod: "weekend",
                        className: "test-class",
                        style: {
                           color: "blue",
                        },
                        unselectable: true,
                        disabled: true,
                     };
               }
               return result;
            })}
         />
      </div>
   </cx>
);
