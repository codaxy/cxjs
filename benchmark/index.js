import {Widget, startAppLoop, enableCultureSensitiveFormatting} from 'cx/ui';
import {HtmlElement, Grid} from 'cx/widgets';
import {Store} from 'cx/data';

import './index.scss';

enableCultureSensitiveFormatting();

import suite from './grid/100-rows';
//import suite from './data/expressions';

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
            { field: 'mean', header: 'Mean', align: 'right', format: 'n;6:suffix; s' },
            { field: 'pers', header: 'Ops/s', align: 'right', format: 'n;0:suffix; ops/sec', value: { expr: '1/{$record.mean}' } },
            { field: 'rme', header: 'Deviation', align: 'right', format: 'ps;2:prefix;±' },
         ]}
      />
   </div>
</cx>);

suite
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
   delay: 100,
   maxTime: 1,
   minTime: 1
});

console.log('Done!');
//stop();

if (module.hot) {

   // accept itself
   module.hot.accept();

   // remember data on dispose
   module.hot.dispose(function (data) {
      data.state = resultsStore.getData();
      if (stop)
         stop();
   });

   //apply data on hot replace
   if (module.hot.data)
      resultsStore.load(module.hot.data.state);
}



