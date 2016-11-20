/**
 * Created by m on 11/16/2016.
 */
import {Controller} from 'cx/ui/Controller';
import {Grid} from 'cx/ui/grid/Grid';
import {HtmlElement} from 'cx/ui/HtmlElement';
import {casual} from 'shared/data/casual';

class PageController extends Controller {
   init() {
      super.init();

      //init grid data
      this.store.set('$page.records', Array.from({length: 100}).map((v, i) => ({
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
   <div controller={PageController}>
      <Grid records:bind='$page.records'
         scrollable
         mod="responsive"
         style={{width: "100%", height: '450px'}}
         columns={[
            {
               header: 'Name',
               field: 'fullName',
               sortable: true,
               aggregate: 'count',
               aggregateField: 'people',
               footer: {tpl: '{$group.name} - {$group.people} {$group.people:plural;person}'}
            },
            {
               header: 'Continent',
               field: 'continent',
               sortable: true,
               aggregate: 'distinct',
               footer: {tpl: '{$group.continent} {$group.continent:plural;continent}'}
            },
            {
               header: 'Browser',
               field: 'browser',
               sortable: true,
               aggregate: 'distinct',
               footer: {tpl: '{$group.browser} {$group.browser:plural;browser}'}
            },
            {
               header: 'OS',
               field: 'os',
               sortable: true,
               aggregate: 'distinct',
               footer: {tpl: '{$group.os} {$group.os:plural;OS}'}
            },
            {header: 'Visits', field: 'visits', sortable: true, aggregate: "sum", align: "right"}
         ]}
         grouping={[
            {
               key: {
                  name: {bind: '$record.continent'}
               },
               showFooter: true,
               caption: {bind: '$group.name'}
            }]}
      />
   </div>
</cx>