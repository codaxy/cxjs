import {Grid, HtmlElement} from "cx/widgets";
import {casual} from '../casual';

let data = Array.from({length: 100}, (_, i) => ({
   id: i,
   fullName: casual.full_name,
   continent: casual.continent,
   browser: casual.browser,
   title: casual.full_name,
   visits: casual.integer(1, 100)
}));

export default (
   <cx>
      <div>
         <Grid
            scrollable
            style={{height: "800px"}}
            mod="responsive"
            columns={[
               {header: "Name", field: "fullName", sortable: true},
               {header: "Continent", field: "continent", sortable: true},
               {header: "Browser", field: "browser", sortable: true},
               {header: "OS", field: "os", sortable: true},
               {header: "Visits", field: "visits", sortable: true, align: "right"}
            ]}
            records={data}
         />
      </div>
   </cx>
);
