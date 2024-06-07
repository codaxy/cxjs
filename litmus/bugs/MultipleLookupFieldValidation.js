import { Controller, expr } from "cx/ui";
import { LookupField, Section } from "cx/widgets";

class PageController extends Controller {
   onInit() {
      this.store.set("products", [
         {
            id: "cpu1",
            name: "Processor i3 - 3GHz",
            unitPrice: 200,
            category: "CPU",
         },
         {
            id: "cpu2",
            name: "Processor i5 - 3.5GHz",
            unitPrice: 300,
            category: "CPU",
         },
         {
            id: "cpu3",
            name: "Processor i7 - 4GHz",
            unitPrice: 400,
            category: "CPU",
         },
         {
            id: "ram1",
            name: "Memory 4GB",
            unitPrice: 80,
            category: "RAM",
         },
         {
            id: "ram2",
            name: "Memory 8GB",
            unitPrice: 120,
            category: "RAM",
         },
         {
            id: "ram3",
            name: "Memory 16GB",
            unitPrice: 160,
            category: "RAM",
         },
         {
            id: "ssd1",
            name: "SSD 128 GB",
            unitPrice: 128,
            category: "HD",
         },
         {
            id: "ssd2",
            name: "SSD 256 GB",
            unitPrice: 256,
            category: "HD",
         },
         {
            id: "ssd3",
            name: "SSD 512 GB",
            unitPrice: 512,
            category: "HD",
         },
         {
            id: "gpu1",
            name: "Graphics Card 2GB",
            unitPrice: 100,
            category: "GPU",
         },
         {
            id: "gpu2",
            name: "Graphics Card 3GB",
            unitPrice: 200,
            category: "GPU",
         },
         {
            id: "gpu3",
            name: "Graphics Card 4GB",
            unitPrice: 300,
            category: "GPU",
         },
      ]);
   }
}

//start the app with hot module replacement
export default (
   <cx>
      <div
         controller={PageController}
         style="padding: 20px; height: 100%; min-height: 300px; position: relative; box-sizing: border-box;"
      >
         <Section mod="card" style="height: 100%" bodyStyle="display: flex; flex-direction: column">
            <h3 style="margin:10px 0">Products</h3>
            <LookupField
               label="Lookup 1"
               records-bind="products1"
               style="width:100%;"
               options-bind="products"
               required
               optionTextField="name"
               multiple
            />
            <LookupField
               label="Lookup 2"
               records-bind="products2"
               style="width:100%;"
               options-bind="products"
               required
               optionTextField="name"
               multiple
               validationParams-bind="products1"
               onValidate={(records, instance, products1) => {
                  if (products1.some((p) => records.map((r) => r.id).includes(p.id))) {
                     return "Lookup 2 must not contain items from lookup 1";
                  }
               }}
            />
         </Section>
      </div>
   </cx>
);
