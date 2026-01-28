import { FlexRow, HtmlElement, Radio, Repeater, Text } from "cx/widgets";
import { Controller, bind } from "cx/ui";
import { createAccessorModelProxy } from "cx/data";

class AppController extends Controller {
   onInit() {
      this.store.init("directions", [
         { id: 0, text: "ASC", option: 1 },
         { id: 1, text: "DESC", option: 2 },
      ]);

      this.store.init("fields", [
         { id: 2, text: "id" },
         { id: 1, text: "text" },
      ]);

      this.store.init("options", [
         { id: 1, text: "Z" },
         { id: 2, text: "Y" },
         { id: 3, text: "X" },
      ]);
   }
}

interface Model {
   sortField: string;
   sortDirection: string;
}

const m = createAccessorModelProxy<Model>();

export default (
   <cx>
      <main controller={AppController}>
         <Repeater records={bind("directions")}>
            <Radio text={bind("$record.text")} value={m.sortDirection} option={bind("$record.text")} />
         </Repeater>
         <hr />
         <Repeater records={bind("fields")}>
            <Radio text={bind("$record.text")} value={m.sortField} option={bind("$record.text")} />
         </Repeater>
         <FlexRow hspacing>
            <Repeater
               records={bind("options")}
               recordAlias="$option"
               sortField={m.sortField}
               sortDirection={m.sortDirection}
            >
               <Radio text={bind("$option.text")} value={bind("$record.option")} option={bind("$option.id")} />
            </Repeater>
         </FlexRow>
      </main>
   </cx>
);
