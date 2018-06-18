import { HtmlElement, LookupField, TextField, NumberField, Checkbox } from "cx/widgets";
import { Controller } from "cx/ui";

class AppController extends Controller {
   onInit() {
      this.store.init("options", [
         { id: 0, text: "Option 1" },
         { id: 1, text: "Option 2" },
         { id: 2, text: "Option 6" }
      ]);
   }
}

export default (
   <cx>
      <main controller={AppController}>
         <LookupField
            label="Options"
            text:bind="optionText"
            value={{
               bind: "optionId",
               set: (v, { store }) => {
                  store.set("optionId", v);
                  store.set("optionSet", v);
               }
            }}
            options:bind="options"
         />
         <br />
         <br />
         <TextField label="Option Set" value:bind="optionSet" />
      </main>
   </cx>
);
