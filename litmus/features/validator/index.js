import { LabelsTopLayout, bind } from "cx/ui";
import { Button, NumberField, ValidationError, ValidationGroup, Validator } from "cx/widgets";

export default (
   <cx>
      <div
         controller={{
            onSave() {
               if (!this.store.get("valid")) {
                  this.store.set("visited", true);
                  return;
               }
               alert("OK");
            },
         }}
         style="padding: 20px"
      >
         <ValidationGroup visited-bind="visited" valid-bind="valid">
            <LabelsTopLayout vertical>
               <NumberField label="X" value-bind="x" required />
               <NumberField label="Y" value-bind="y" required />
               <Validator
                  value={{
                     x: bind("x"),
                     y: bind("y"),
                  }}
                  onValidate={({ x, y }) => (x + y != 10 ? "X + Y should be equal to 10" : false)}
               >
                  <ValidationError />
               </Validator>
               <Validator
                  value={{
                     x: bind("x"),
                     y: bind("y"),
                  }}
                  onValidate={({ x, y }) => (x + y != 10 ? "X + Y should be equal to 10" : false)}
               >
                  <div>Custom error message with possibly different styling.</div>
               </Validator>
               <Button onClick="onSave">Save</Button>
            </LabelsTopLayout>
         </ValidationGroup>
      </div>
   </cx>
);
