import {
   Button,
   Checkbox,
   Grid,
   HtmlElement,
   Select,
   TreeAdapter,
   TreeNode,
   ValidationGroup
} from "cx/widgets";
import { Controller, KeySelection, LabelsLeftLayout } from "cx/ui";

class PageController extends Controller {
   init() {
      super.init();
      this.idSeq = 0;
      this.store.set("resourcelist", [
         {
            parent: "Z",
            id: "520-1",
            name: "Dep 1",
            cost: 30,
            type: 10,
            $level: 0,
            $expanded: false,
            $loading: false,
            $children: [
               {
                  parent: "520-1",
                  id: "520-1-01",
                  name: "Res 1",
                  cost: 30,
                  type: 20,
                  $level: 1,
                  $expanded: false,
                  $loading: false,
                  $children: [],
                  $loaded: true
               }
            ],
            $loaded: true
         },
         {
            parent: "Z",
            id: "520-2",
            name: "Dep 2",
            cost: 3500,
            type: 10,
            $level: 0,
            $expanded: false,
            $loading: false,
            $children: [
               {
                  parent: "520-2",
                  id: "520-2-01",
                  name: "Res 2",
                  cost: 3500,
                  type: 20,
                  $level: 1,
                  $expanded: false,
                  $loading: false,
                  $children: [],
                  $loaded: true
               }
            ],
            $loaded: true
         }
      ]);

      this.store.set(
         "data",
         this.store.get("resourcelist").filter(element => element.parent === "Z")
      );
   }

   loadRecords(id) {
      return this.store
                 .get("resourcelist")
                 .filter(element => element.parent === id);
   }
}

export default (
   <cx>
      <div controller={PageController}>
         <Grid
            records:bind="data"
            mod="tree"
            style={{ width: "100%" }}
            dataAdapter={{
               type: TreeAdapter,
               load: (context, { controller }, node) =>
                  controller.loadRecords(node.id)
            }}
            selection={{ type: KeySelection, bind: "$page.selection" }}
            columns={[
               {
                  header: "Name",
                  field: "name",
                  sortable: true,
                  items: (
                     <cx>
                        <TreeNode
                           expanded:bind="$record.$expanded"
                           level:bind="$record.$level"
                           loading:bind="$record.$loading"
                           text:bind="$record.name"
                           leaf={false}
                        />
                     </cx>
                  )
               },
               { header: "ID", field: "id" },
               {
                  header: "Cost",
                  field: "cost",
                  format: "number;2;2",
                  sortable: true,
                  align: "right"
               }
            ]}
         />
      </div>
   </cx>
);
