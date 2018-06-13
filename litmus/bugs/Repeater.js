import { FlexRow, HtmlElement, Radio, Repeater, Text } from "cx/widgets";
import { Controller } from "cx/ui";

class AppController extends Controller {
   onInit() {
      this.store.init("records", [
         { id: 0, text: "Record 1", option: 1 },
         { id: 1, text: "Record 2", option: 2 }
      ]);

      this.store.init("options", [
         { id: 0, text: "Option 1" },
         { id: 1, text: "Option 2" },
         { id: 2, text: "Option 3" }
      ]);
   }
}

export default (
   <cx>
      <main controller={AppController}>
         <Repeater records:bind="records">
            <Text value:bind="$record.text" />
            <hr />
            <FlexRow hspacing>
               <Repeater records:bind="options" recordAlias="$option">
                  <Radio
                     text:bind="$option.text"
                     value:bind="$record.option"
                     option:bind="$option.id"
                  />
               </Repeater>
            </FlexRow>
         </Repeater>
      </main>
   </cx>
);
