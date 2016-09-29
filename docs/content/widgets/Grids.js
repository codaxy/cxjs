import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Content} from 'cx/ui/layout/Content';
import {Controller} from 'cx/ui/Controller';
import {Grid} from 'cx/ui/grid/Grid';
import {casual} from '../examples/data/casual';
import {Format} from 'cx/util/Format';
import {KeySelection} from 'cx/ui/selection/KeySelection';
import plural from 'plural';

import configs from './configs/Grid';
import groupingConfigs from './configs/GridGrouping';
import columnConfigs from './configs/GridColumn';

class PageController extends Controller {
   init() {
      super.init();

      //init grid data
      this.store.init('$page.records', Array.from({length: 100}).map((v, i)=>({
         id: i + 1,
         fullName: casual.full_name,
         continent: casual.continent,
         browser: casual.browser,
         os: casual.operating_system,
         visits: casual.integer(1, 100)
      })));
   }
}

Format.registerFactory('plural', (format, text) => {
   return value => plural(text, value);
});

export const Grids = <cx>
   <Md>

      # Grid

      Grid is a versatile component used for displaying tabular data. Grid control in Cx has many features such as
      fixed headers, single and multiple selection modes, sorting, filtering, grouping and aggregation, rich cell content (including headers),
      tree columns, etc.

      <CodeSplit>


         <div controller={PageController}>
            <Grid records:bind='$page.records'
                  style={{ height: '300px'}}
                  mod="responsive"
                  scrollable
                  columns={[
                  { header: 'Name', field: 'fullName', sortable: true },
                  { header: 'Continent', field: 'continent', sortable: true },
                  { header: 'Browser', field: 'browser', sortable: true },
                  { header: 'OS', field: 'os', sortable: true },
                  { header: 'Visits', field: 'visits', sortable: true, align: 'right' }
               ]}
               selection={{type: KeySelection, bind:'$page.selection'}}
            />
         </div>
         <CodeSnippet putInto="code">{`
            class PageController extends Controller {
               init() {
                  super.init();

                  //init grid data
                  this.store.set('$page.records', Array.from({length: 10}).map((v, i)=>({
                     id: i + 1,
                     fullName: casual.full_name,
                     continent: casual.continent,
                     browser: casual.browser,
                     os: casual.operating_system,
                     visits: casual.integer(1, 100)
                  })));
               }
            }

            Format.registerFactory('plural', (format, text) => {
               return value => plural(text, value);
            });

            <Grid records:bind='$page.records'
                  style={{width: "100%"}}
                  columns={[
                  { header: 'Name', field: 'fullName', sortable: true, aggregate: 'count', footer: { tpl: '{$group.fullName} {$group.fullName:plural;person}' }},
                  { header: 'Continent', field: 'continent', sortable: true, aggregate: 'distinct', aggregateField: 'continents', footer: { tpl: '{$group.continents} {$group.continents:plural;continent}' } },
                  { header: 'Browser', field: 'browser', sortable: true, aggregate: 'distinct', aggregateField: 'browsers', footer: { tpl: '{$group.browsers} {$group.browsers:plural;browser}' }  },
                  { header: 'OS', field: 'os', sortable: true, aggregate: 'distinct', aggregateField: 'oss', footer: { tpl: '{$group.oss} {$group.oss:plural;OS}' } },
                  { header: 'Visits', field: 'visits', sortable: true, aggregate: "sum", align: "right" }
               ]}
               selection={{type: KeySelection, bind:'$page.selection'}}
            />
         `}</CodeSnippet>
      </CodeSplit>

      Examples:

      - [Pagination](~/examples/grid/pagination)
      - [Multiple selection](~/examples/grid/multiple-selection)
      - [Grouping](~/examples/grid/grouping)
      - [Dynamic Grouping](~/examples/grid/dynamic-grouping)
      - [Inline Editing](~/examples/grid/inline-edit)
      - [Form Editing](~/examples/grid/form-edit)
      - [TreeGrid](~/examples/grid/tree-grid)

      ## Configuration

      <ConfigTable props={configs} />

      ### Column Configuration

      <ConfigTable props={columnConfigs} />

      ### Grouping Configuration

      <ConfigTable props={groupingConfigs} />

   </Md>
</cx>