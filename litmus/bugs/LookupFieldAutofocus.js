import { Store } from "cx/data";
import { startHotAppLoop, Controller } from "cx/ui";
import {
   Grid,
   Button,
   LookupField,
   NumberField,
   Section,
   enableTooltips
} from "cx/widgets";


class PageController extends Controller {
   onInit() {
      this.store.set("products", [
         {
            id: "cpu1",
            name: "Processor i3 - 3GHz",
            unitPrice: 200,
            category: "CPU"
         },
         {
            id: "cpu2",
            name: "Processor i5 - 3.5GHz",
            unitPrice: 300,
            category: "CPU"
         },
         {
            id: "cpu3",
            name: "Processor i7 - 4GHz",
            unitPrice: 400,
            category: "CPU"
         },
         {
            id: "ram1",
            name: "Memory 4GB",
            unitPrice: 80,
            category: "RAM"
         },
         {
            id: "ram2",
            name: "Memory 8GB",
            unitPrice: 120,
            category: "RAM"
         },
         {
            id: "ram3",
            name: "Memory 16GB",
            unitPrice: 160,
            category: "RAM"
         },
         {
            id: "ssd1",
            name: "SSD 128 GB",
            unitPrice: 128,
            category: "HD"
         },
         {
            id: "ssd2",
            name: "SSD 256 GB",
            unitPrice: 256,
            category: "HD"
         },
         {
            id: "ssd3",
            name: "SSD 512 GB",
            unitPrice: 512,
            category: "HD"
         },
         {
            id: "gpu1",
            name: "Graphics Card 2GB",
            unitPrice: 100,
            category: "GPU"
         },
         {
            id: "gpu2",
            name: "Graphics Card 3GB",
            unitPrice: 200,
            category: "GPU"
         },
         {
            id: "gpu3",
            name: "Graphics Card 4GB",
            unitPrice: 300,
            category: "GPU"
         }
      ]);

      this.store.init("items", [{
         id: 1,
         itemId: 'cpu1',
         qty: 2
      }, {
         id: 2,
         itemId: 'cpu1',
         qty: 2
      }]);
   }
}

//start the app with hot module replacement
export default (
   <cx>
      <div
         controller={PageController}
         style="padding: 20px; height: 100%; min-height: 300px; position: relative; box-sizing: border-box;"
      >
         <Section
            mod="card"
            style="height: 100%"
            bodyStyle="display: flex; flex-direction: column"
         >
            <h3 style="margin:10px 0">Invoice #333</h3>
            <Grid
               records-bind="items"
               keyField="id"
               style="border-bottom: 1px solid #e1e4e3; flex: 1 1 0;"
               headerMode="plain"
               border={false}
               scrollable
               columns={[
                  {
                     value: { expr: "{$index}+1" },
                     style: "font-weight: bold",
                     header: "#"
                  },
                  {
                     header: "Product",
                     field: "productName",
                     style: "min-width: 200px",
                     items: (
                        <cx>
                           <LookupField
                              value-bind="$record.itemId"
                              style="width:100%;"
                              options-bind="products"
                              required
                              optionTextField="name"
                              autoFocus-expr="true"
                              bindings={[
                                 {
                                    local: "$record.itemId",
                                    remote: "$option.id",
                                    key: true
                                 },
                                 {
                                    local: "$record.unitPrice",
                                    remote: "$option.unitPrice"
                                 },
                                 { local: "$record.taxPct", remote: "$option.taxPct" }
                              ]}
                              listOptions={{
                                 grouping: [
                                    {
                                       key: {
                                          category: { bind: "$option.category" }
                                       },
                                       header: (
                                          <cx>
                                             <h6
                                                text-bind="$group.category"
                                                style="margin: 5px 0 0; padding: 5px; color: lightgray"
                                             />
                                          </cx>
                                       )
                                    }
                                 ]
                              }}
                           />
                        </cx>
                     ),
                     footer: "Total"
                  },
                  {
                     header: "Qty",
                     field: "qty",
                     align: "right",
                     style: "width: 80px",
                     items: (
                        <cx>
                           <NumberField
                              value-bind="$record.qty"
                              style="width:100%;"
                              inputStyle="text-align: right"
                              required
                              reactOn="change"
                           />
                        </cx>
                     )
                  },
                  {
                     header: "Discount (%)",
                     field: "discountPct",
                     align: "right",
                     style: "width: 80px",
                     items: (
                        <cx>
                           <NumberField
                              value-bind="$record.discountPct"
                              style="width:100%;"
                              inputStyle="text-align: right"
                              format="ps"
                              maxValue={100}
                              reactOn="change"
                           />
                        </cx>
                     )
                  },
                  {
                     header: "Unit Price",
                     field: "unitPrice",
                     align: "right",
                     format: "currency;;2"
                  },
                  {
                     header: "Regular",
                     field: "regularAmount",
                     align: "right",
                     format: "currency;;2"
                  },
                  {
                     header: "Discount",
                     field: "discountAmount",
                     align: "right",
                     format: "currency;;2"
                  },
                  {
                     header: "Total",
                     field: "totalAmount",
                     align: "right",
                     format: "currency;;2",
                     class: "highlight"
                  },
                  {
                     align: "right",
                     style: "width: 10px",
                     items: (
                        <cx>
                           <Button
                              onClick={(e, { store }) => {
                                 let id = store.get("$record.id");
                                 store.update("items", items =>
                                    items.filter(item => item.id != id)
                                 );
                              }}
                              mod="hollow"
                              icon="close"
                           />
                        </cx>
                     )
                  }
               ]}
            />

            <div style="display: flex;">
               <Button
                  style="margin: 6px 0 12px 4px;"
                  text="Add Item"
                  mod="hollow"
                  onClick={(e, { store }) => {
                     store.update("items", items => [
                        ...items,
                        {
                           id: Math.random()
                        }
                     ]);
                  }}
               />
               <div style="margin: 20px 50px 0 auto">
                  <h6>Summary</h6>
                  <table class="summary">
                     <tbody>
                     <tr>
                        <td>Regular Price</td>
                        <td text-tpl="{total.regularAmount:currency;;2}" />
                     </tr>
                     <tr>
                        <td>Discount</td>
                        <td text-tpl="{total.discountAmount:currency;;2}" />
                     </tr>

                     <tr class="summary-total">
                        <td>Total</td>
                        <td text-tpl="{total.totalAmount:currency;;2}" />
                     </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </Section>
      </div>
   </cx>
);
