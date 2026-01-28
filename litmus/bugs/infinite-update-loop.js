import { Checkbox, DateField, HtmlElement, TextField, Window } from "cx/widgets";
import { LabelsTopLayout } from "cx/ui";

export default (
   <cx>
      <div>
         <Checkbox value-bind="show" text="Show" />
         <Window
            title="test"
            autoFocus
            visible-bind="show"
            controller={{
               onInit() {
                  this.store.delete("value");

                  setTimeout(() => {
                     this.store.set("value", new Date().toISOString());
                  }, 1000);
               },
            }}
         >
            <LabelsTopLayout vertical>
               <TextField visible-expr="!!{value}" value-bind="text" label="Text" />
               <DateField value-bind="value" autoFocus label="Date" />
            </LabelsTopLayout>
         </Window>
      </div>
   </cx>
);
