import {
   Button,
   Grid,
   HtmlElement,
   Pagination,
   Select,
   TextField
} from "cx/widgets";
import { Controller } from "cx/ui";
import { getComparer, updateArray } from "cx/data";
import { casual } from "../casual";

class PageController extends Controller {
   onInit() {
      var dataSet = Array.from({ length: 50 }).map((v, i) => ({
         id: i + 1,
         fullName: casual.full_name,
         phone: casual.phone,
         city: casual.city
      }));

      this.store.set("records", dataSet);
   }

   onChange() {
      this.store.update("records", updateArray, r => ({
         ...r,
         fullName: casual.full_name
      }));
   }
}

export default (
   <cx>
      <div controller={PageController}>
         <Button onClick="onChange">Change</Button>
         <Grid
            records:bind="records"
         style={{ width: "100%" }}
         mod="bordered"
         lockColumnWidths
         columns={[
            {
               field: "fullName",
               sortable: true,
               header1: "Name",
               caption: {
                  items: (
                     <cx>
                        <Button text-tpl="{$group.x} {$record.fullName}" />
                     </cx>
                  )
               }
            },
            {
               header1: "Phone",
               field: "phone"
            }
         ]}
         grouping={[
            {
               key: {
                  x: { expr: "{$record.fullName}[0]" }
               },
               showCaption: true
            }
         ]}
         sorters:bind="$page.sorters"
       />
     </div>
   </cx>
);
