import { DateField, DateTimeField, HtmlElement } from "cx/widgets";
import { Controller } from "cx/ui";

export default (
   <cx>
      <div
         controller={
            class extends Controller {
               init() {
                  this.addTrigger(
                     "fewrgb",
                     ["date"],
                     date => {
                        this.store.set("span", new Date(date).getTime());
                     },
                     true
                  );
               }
            }
         }
      >
         <DateField partial segment="date" value:bind="date" />
         <DateTimeField partial segment="time" value:bind="date" />
         <span text:expr="{span}" />
      </div>
   </cx>
);
