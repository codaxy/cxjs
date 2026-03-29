import {Grid, HtmlElement} from "cx/widgets";
import {startAppLoop, batchUpdates} from "cx/ui";
import {Store, updateArray} from "cx/data";
import {casual} from '../casual';

let Demo = (
   <cx>
      <div>
         <Grid
            records:bind="data"
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
         />
      </div>
   </cx>
);

let store, stop;

let suite = new Benchmark.Suite({
   onStart: function () {
      store = new Store({
         data: {
            data: Array.from({length: 100}, (_, i) => ({
               id: i,
               fullName: casual.full_name,
               continent: casual.continent,
               browser: casual.browser,
               title: casual.full_name,
               visits: casual.integer(1, 100)
            }))
         }
      });
      stop = startAppLoop(document.getElementById('test'), store, <cx>
         <div>
            <Demo/>
         </div>
      </cx>);
   },
   onComplete: function () {
      stop();
   }
});

suite
   .add('change 1 cell', () => {
      batchUpdates(() => {
         store.update('data', data => {
            let index = Math.floor(Math.random() * data.length);
            return updateArray(data, r => ({
                  ...r,
                  visits: casual.integer(1, 100)
               }),
               (r, i) => i == index
            );
         });
      });
   })
   .add('change 5 cells', () => {
      batchUpdates(() => {
         for (let i = 0; i < 5; i++) {
            store.update('data', data => {
               let index = Math.floor(Math.random() * data.length);
               return updateArray(data, r => ({
                     ...r,
                     visits: casual.integer(1, 100)
                  }),
                  (r, i) => i == index
               );
            });
         }
      });
   })
   .add('change all cells', () => {
      batchUpdates(() => {
         store.update('data', data => {
            return updateArray(data, r => ({
                  ...r,
                  visits: casual.integer(1, 100)
               })
            );
         });
      });
   })

export default suite;