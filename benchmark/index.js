import {Widget, startAppLoop} from 'cx/ui';
import {HtmlElement, Grid} from 'cx/widgets';
import {Store} from 'cx/data';

import './index.scss';
import Demo from './grid/100-rows';

let resultsStore = new Store({
   data: {
      results: []
   }
});

let stop = startAppLoop(document.getElementById('app'), resultsStore, <cx>
   <div>
      <h2>Results</h2>

      <Grid
         records:bind="results"
         columns={[
            { field: 'name', header: 'Test' },
            { field: 'samples', header: 'Samples', align: 'right', format: 'n;0', value: { expr: '{$record.sample.length}' } },
            { field: 'mean', header: 'Mean', align: 'right', format: 'n;2', value: { expr: '{$record.mean} * 1000' } },
            { field: 'rme', header: 'Deviation', align: 'right', format: 'ps;2:prefix;±' },
         ]}
      />
   </div>
</cx>);

let grid100 = () => {
   let store = new Store();
   let stop = startAppLoop(document.getElementById('test'), store, <cx>
      <div>
         <Demo/>
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
         <Demo/>
      </div>
   </cx>);
   stop();
};

var suite = new Benchmark.Suite;
suite
   .add('Grid100', grid100)
   .add('Grid100 - sealed store', grid100sealed)
   .add('Grid100 - verify', grid100)
   .add('Grid100 - sealed - verify', grid100sealed)
   .on('cycle', function (event) {
      console.log(String(event.target));
      resultsStore.update('results', results => [
         ...results,
         {
            name: event.target.name,
            ...event.target.stats
         }
      ]);
   })
   .on('complete', function () {
      console.log(resultsStore.getData());
   });

suite.run({
   async: true,
   delay: 100
});

console.log('Done!');
//stop();

if (module.hot) {

   // accept itself
   module.hot.accept();

   // // remember data on dispose
   // module.hot.dispose(function (data) {
   //    data.state = store.getData();
   //    if (stop)
   //       stop();
   // });
   //
   // //apply data on hot replace
   // if (module.hot.data)
   //    store.load(module.hot.data.state);
}



