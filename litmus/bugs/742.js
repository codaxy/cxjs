import { Controller, KeySelection } from "cx/ui";
import { DragHandle, FlexRow, Grid, HtmlElement } from "cx/widgets";

function insertElement(array, index, ...args) {
   return [...array.slice(0, index), ...args, ...array.slice(index)];
}

function move(store, target, e) {
   let selection = e.source.records.map(r => r.data);

   store.update(e.source.data.source, array =>
      array.filter((a, i) => selection.indexOf(a) == -1)
   );

   if (e.source.data.source == target)
      e.source.records.forEach(record => {
         if (record.index < e.target.insertionIndex) e.target.insertionIndex--;
      });

   store.update(target, insertElement, e.target.insertionIndex, ...selection);
}

class AppController extends Controller {
   init() {
      this.store.delete("grid1");
      this.store.delete("grid2");
      this.store.delete("grid3");

      this.store.set(
         "grid1",
         Array.from({ length: 15 }, (_, c) => ({
            id: c + 1,
            name: "Item " + (c + 1),
            type1: "bug",
            number: Math.random() * 100
         }))
      );

      this.store.set(
         "grid2",
         Array.from({ length: 15 }, (_, c) => ({
            id: 10000 + c + 1,
            name: "Item " + (c + 1),
            type2: "bug",
            number: Math.random() * 100
         }))
      );

      this.store.set(
         "grid3",
         Array.from({ length: 15 }, (_, c) => ({
            id: 10000 + c + 1,
            name: "Item " + (10001 + c),
            type3: "bug",
            number: Math.random() * 100
         }))
      );
   }
}

export default (
   <cx>
      <div style="padding:30px" controller={AppController}>
         <h3>Grid to Grid Drag & Drop (Test Grid 1, particularly lines 89-101</h3>
         <FlexRow>
            <Grid
               records:bind="grid1"
          columns={[
               {
                  field: "name",
                  header: "Name",
                  sortable: true,
                  style: "width: 150px"
               },
               {
                  field: "type1",
                  header: "Bug or not",
                  style: "width: 300px"
               },
               {
                  field: "number",
                  header: "Number",
                  format: "n;2",
                  sortable: true,
                  align: "right"
               }
            ]}
          dragSource={{ data: { type: "record", source: "grid1" } }}
          onDropTest={e => {
               console.log("rec", e.source.record);
               console.log("rec data", e.source.record.data);
               console.log("rec data type1:", e.source.record.data.type1);
               console.log(
                  "rec data type1 tolowercase:",
                  e.source.record.data.type1
               );
               return (
                  e.source.data.type == "record" &&
                  e.source.record.data.type1 !== "bug"
               );
            }}
          onDrop={(e, { store }) => move(store, "grid1", e)}
          selection={{ type: KeySelection, multiple: true, bind: "s1" }}
        />
        <div style="width:100px" />
            <Grid
               records:bind="grid2"
          columns={[
               {
                  items: (
                     <cx>
                        <DragHandle style="cursor:move">☰</DragHandle>
                     </cx>
                  )
               },
               {
                  style: "width: 300px",
                  field: "name",
                  header: "Name",
                  sortable: true
               },
               {
                  field: "type2",
                  header: "Bug or not",
                  style: "width: 300px"
               },
               {
                  field: "number",
                  header: "Number",
                  format: "n;2",
                  sortable: true,
                  align: "right"
               }
            ]}
          dragSource={{
               mode: "copy",
               data: { type: "record", source: "grid2" }
            }}
          dropZone={{ mode: "insertion" }}
          onDropTest={e =>
               e.source.data.type == "record" &&
               e.source.record.data.type2 !== "bug"}
          onDrop={(e, { store }) => move(store, "grid2", e)}
        />
        <div style="width:100px" />
            <Grid
               records:bind="grid3"
          columns={[
               {
                  items: (
                     <cx>
                        <DragHandle style="cursor:move">☰</DragHandle>
                     </cx>
                  )
               },
               {
                  style: "width: 300px",
                  field: "name",
                  header: "Name",
                  sortable: true
               },
               {
                  field: "type3",
                  header: "Bug or not",
                  style: "width: 300px"
               },
               {
                  field: "number",
                  header: "Number",
                  format: "n;2",
                  sortable: true,
                  align: "right"
               }
            ]}
          dragSource={{
               mode: "copy",
               data: { type: "record", source: "grid3" }
            }}
          dropZone={{ mode: "insertion" }}
          onDropTest={e =>
               e.source.data.type == "record" &&
               e.source.record.data.type3 !== "bug"}
          onDrop={(e, { store }) => move(store, "grid3", e)}
        />
      </FlexRow>
      </div>
   </cx>
);
