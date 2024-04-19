import { FlexCol, FlexRow, Grid, Icon, List, HtmlElement, TextField } from "cx/widgets";
import { Controller, KeySelection } from "cx/ui";

class Ctrl extends Controller {
   onInit() {
      this.store.set("$page.records", [
         { id: 1, g: "Employee", fullName: "Maegan Miller" },
         { id: 2, g: "Employee", fullName: "Lorenza Herzog" },
         { id: 3, g: "Client", fullName: "Carlie Hand" },
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
            keyField: "id",
         }}
         grouping={{
            key: {
               g: { bind: "$record.g" },
            },
            text: { bind: "$record.fullName" },
            header: (
               <div style="display: flex; gap: 20px">
                  <div text-tpl="key: {$group.g}" style="color: red;" />
                  <div text-tpl="desc: {$group.$name}" style="color: green" />
                  {/* From docs:
                     `text: A selector used to calculate text which can be used in totals as $group.text`
                  */}
                  <div text-tpl="text: {$group.text|n/a}" style="color: blue" />
               </div>
            ),
         }}
      >
         <span text-bind="$record.fullName" />
      </List>
   </cx>
);
