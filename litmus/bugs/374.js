import {
   Button,
   DateField,
   DateTimeField,
   HtmlElement,
   Radio,
   TextField,
   ValidationGroup,
   Validator
} from "cx/widgets";
import { Controller, Repeater } from "cx/ui";

export default (
   <cx>
      <div
         controller={
            class extends Controller {
               init() {
                  super.init();
                  this.store.set("records", [
                     { text: "uno", value: 1 },
                     { text: "dos", value: 2 },
                     { text: "tres", value: 3 }
                  ]);
               }
            }
         }
      >
         <ValidationGroup valid:bind="$page.valid" errors:bind="$page.errors">
            <Repeater records:bind="records">
               <Radio value:bind="value" option:bind="$record.value">
                  <span text:bind="$record.text" />
               </Radio>
            </Repeater>
            <Validator
               value:bind="value"
               onValidate={value => {
                  if (!value) return "Error";
               }}
            />

            <ul>
               <Repeater records:bind="$page.errors">
                  <li text:bind="$record.message" />
               </Repeater>
            </ul>
         </ValidationGroup>
         <Button
            onClick={(e, { store }) => {
               store.delete("value");
            }}
         >
            Clear
         </Button>
      </div>
   </cx>
);
