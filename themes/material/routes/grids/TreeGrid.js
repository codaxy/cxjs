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
import {Controller, KeySelection, LabelsLeftLayout} from "cx/ui";

import {casual} from 'shared/data/casual';

class PageController extends Controller {
   init() {
      super.init();
      this.idSeq = 0;
      this.store.set("$page.data", this.generateRecords());
   }

   generateRecords(node) {
      if (!node || node.$level < 5)
         return Array
            .from({length: 5})
            .map(() => ({
               id: ++this.idSeq,
               fullName: casual.full_name,
               phone: casual.phone,
               city: casual.city,
               notified: casual.coin_flip,
               $leaf: casual.coin_flip
            }));
   }
}

export default <cx>
   <div controller={PageController}>
      <Grid
         records:bind="$page.data"
         mod="tree"
         dataAdapter={
            {
               type: TreeAdapter,
               load: (context, {controller}, node) =>
                  controller.generateRecords(node)
            }
         }
         selection={{type: KeySelection, bind: "$page.selection"}}
         columns={[
            {
               header: "Name",
               field: "fullName",
               sortable: true,
               items: (
                  <cx>
                     <TreeNode
                        expanded:bind="$record.$expanded"
                        leaf:bind="$record.$leaf"
                        level:bind="$record.$level"
                        loading:bind="$record.$loading"
                        text:bind="$record.fullName"
                     />
                  </cx>
               )
            },
            {header: "Phone", field: "phone"},
            {header: "City", field: "city", sortable: true},
            {
               header: "Notified",
               field: "notified",
               sortable: true,
               value: {expr: '{$record.notified} ? "Yes" : "No"'}
            }
         ]}
      />
   </div>
</cx>