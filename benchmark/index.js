import {Widget, startHotAppLoop, enableCultureSensitiveFormatting} from 'cx/ui';
import {HtmlElement, Grid} from 'cx/widgets';
import {Store} from 'cx/data';

//import './index.scss';

enableCultureSensitiveFormatting();

import suite1 from './grid/100-rows';
import suite2 from './data/expressions';
import suite3 from './grid/realtime';

let suites = [
    suite1,
    suite2,
    suite3
];

let resultsStore = new Store({
   data: {
      results: []
   }
});

let stop = startHotAppLoop(module, document.getElementById('app'), resultsStore, <cx>
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

let suiteIndex = 0;

function proceed() {
   let suite = suites[suiteIndex++];
   if (!suite)
      return;

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
         proceed();
      });

   suite.run({
      async: true,
      delay: 100,
      maxTime: 1,
      minTime: 1
   });
}

proceed();

console.log('Done!');
//stop();




