import { KeySelection, Controller } from 'cx/ui';
import { Grid, HtmlElement } from 'cx/widgets';
import {casual} from 'shared/data/casual';

class PageController extends Controller {
   init() {
      super.init();

      //init grid data
      this.store.set('$page.fixedRecords', Array.from({length: 30}).map((v, i) => ({
         id: i + 1,
         fullName: casual.full_name,
         continent: casual.continent,
         browser: casual.browser,
         os: casual.operating_system,
         visits: casual.integer(1, 100)
      })));
   }
}

export default <cx>
   <div controller={PageController} style="width:100%">
      <Grid records:bind='$page.fixedRecords'
         style={{height: "450px"}}
         mod="responsive"
         scrollable
         columns={[
            {
               header: 'Name',
               field: 'fullName',
               sortable: true,
               aggregate: 'count',
               footer: {tpl: '{$group.fullName} {$group.fullName:plural;person}'}
            },
            {
               header: 'Continent',
               field: 'continent',
               sortable: true,
               aggregate: 'distinct',
               aggregateField: 'continents',
               footer: {tpl: '{$group.continents} {$group.continents:plural;continent}'}
            },
            {
               header: 'Browser',
               field: 'browser',
               sortable: true,
               aggregate: 'distinct',
               aggregateField: 'browsers',
               footer: {tpl: '{$group.browsers} {$group.browsers:plural;browser}'}
            },
            {
               header: 'OS',
               field: 'os',
               sortable: true,
               aggregate: 'distinct',
               aggregateField: 'oss',
               footer: {tpl: '{$group.oss} {$group.oss:plural;OS}'}
            },
            {header: 'Visits', field: 'visits', sortable: true, aggregate: "sum", align: "right"}
         ]}
         selection={{type: KeySelection, bind: '$page.selection'}}
      />
   </div>
</cx>