import { Grid, HtmlElement } from "cx/widgets";
import { startAppLoop } from "cx/ui";
import { Store } from "cx/data";
import { casual } from '../casual';

let data = Array.from({ length: 100 }, (_, i) => ({
   id: i,
   fullName: casual.full_name,
   continent: casual.continent,
   browser: casual.browser,
   title: casual.full_name,
   visits: casual.integer(1, 100)
}));

let Demo = (
   <cx>
      <div>
         <Grid
            columns={[
               { header: "Name", field: "fullName", sortable: true },
               { header: "Continent", field: "continent", sortable: true },
               { header: "Browser", field: "browser", sortable: true },
               { header: "OS", field: "os", sortable: true },
               { header: "Visits", field: "visits", sortable: true, align: "right" }
            ]}
            records={data}
         />
      </div>
   </cx>
);

let grid100 = () => {
   let store = new Store();
   let stop = startAppLoop(document.getElementById('test'), store, <cx>
      <div>
         <Demo />
      </div>
   </cx>);
   stop();
};

let grid100sealed = () => {
   let store = new Store({
      sealed: true
   });
   let stop = startAppLoop(document.getElementById('test'), store, <cx>
      <div>
         <Demo />
      </div>
   </cx>);
   stop();
};

let suite = new Benchmark.Suite;
suite
   .add('Grid100', grid100)
   .add('Grid100 - sealed store', grid100sealed)
   .add('Grid100 - verify', grid100)
   .add('Grid100 - sealed - verify', grid100sealed);

//setInterval(grid100, 100);
//grid100()

export default suite;

