import {
   FlexCol,
   FlexRow,
   Grid,
   Icon,
   List,
   HtmlElement,
   TextField
} from "cx/widgets";
import { Controller, KeySelection } from "cx/ui";

class Ctrl extends Controller {
   onInit() {
      this.store.set("$page.records", [
         { id: 1, g: "Test", name: "Test A2" },
         { id: 2, g: "Test", name: "Test B" },
         { id: 3, g: "Test2", name: "Test C" }
      ]);
   }
}

export default (
   <cx>
      <List
         controller={Ctrl}
         records-bind="$page.records"
         scrollSelectionIntoView
         cached
         keyField="id"
         selection={{
            type: KeySelection,
            bind: "$page.selectedId",
            keyField: "id"
         }}
         // grouping={{
         //    key: {
         //       name: { bind: "$record.g" }
         //    },
         //    header: <h2 text-tpl="{$group.name}" />
         // }}
      >
         <span text-bind="$record.name" />
      </List>
   </cx>
);
