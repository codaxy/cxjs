import { cx, Grid, Section } from "cx/widgets";
import { Controller, KeySelection, bind } from "cx/ui";
import casual from '../../../util/casual';

class PageController extends Controller {
   onInit() {
       this.store.set(
           "records",
           Array
               .from({ length: 5000 })
               .map((v, i) => ({
                   id: i + 1,
                   fullName: casual.full_name,
                   continent: casual.continent,
                   browser: casual.browser,
                   os: casual.operating_system,
                   visits: casual.integer(1, 100)
               }))
       );
   }
}

export default (
   <cx>
       <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/general/grids/buffering.tsx" target="_blank" putInto="github">Source Code</a>
       <Section
           mod="well"
           style="height: 100%"
           bodyStyle="display:flex; flex-direction:column"
           controller={PageController}
       >
           <Grid
               records={bind("records")}
               scrollable
               buffered
               style="flex: 1"
               lockColumnWidths
               cached
               columns={
                   [
                       { header: "#", field: "index", sortable: true, value: {bind: "$index"} },
                       { header: "Name", field: "fullName", sortable: true },
                       { header: "Continent", field: "continent", sortable: true },
                       { header: "Browser", field: "browser", sortable: true },
                       { header: "OS", field: "os", sortable: true },
                       { header: "Visits", field: "visits", sortable: true, align: "right"}
                   ]
               }
               selection={{ type: KeySelection, bind: "selection" }}
           />
       </Section>
   </cx>
);
