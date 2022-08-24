import { HtmlElement, Tab, Grid } from 'cx/widgets';
import { Content, Controller, KeySelection } from 'cx/ui';
import { Format } from 'cx/util';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';

import {casual} from '../examples/data/casual';
import plural from 'plural';

import configs from './configs/Grid';
import groupingConfigs from './configs/GridGrouping';
import columnConfigs from './configs/GridColumn';
import columnHeaderConfigs from './configs/GridColumnHeader';

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

        <ImportPath path="import {Grid} from 'cx/widgets';" />

        Grid is a versatile component used to display tabular data. Grid control in Cx has many features such as
        fixed headers, single and multiple selection modes, sorting, filtering, grouping and aggregation, rich cell
        content (including headers),
        tree columns, etc.

        <CodeSplit>


            <div controller={PageController}>
                <Grid records-bind='$page.records'
                      style={{height: '300px'}}
                      mod="responsive"
                      scrollable
                      columns={[
                          {header: 'Name', field: 'fullName', sortable: true, resizable: true},
                          {header: 'Continent', field: 'continent', sortable: true, resizable: true},
                          {header: 'Browser', field: 'browser', sortable: true, resizable: true},
                          {header: 'OS', field: 'os', sortable: true, resizable: true},
                          {header: 'Visits', field: 'visits', sortable: true, align: 'right', resizable: true}
                      ]}
                      selection={{type: KeySelection, bind: '$page.selection', multiple: true}}
                />
            </div>
            <Content name="code">
                <div>
                    <Tab value-bind="$page.code.tab" tab="controller" mod="code" text="Controller" />
                    <Tab value-bind="$page.code.tab" tab="grid" mod="code"  text="Grid" default/>
                </div>
                <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="kzHH3vkM">
                    {`
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
                        `}</CodeSnippet>
                        <CodeSnippet visible-expr="{$page.code.tab}=='grid'" fiddle="kzHH3vkM">{`
                        <Grid records-bind='$page.records'
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
                    `}
                </CodeSnippet>
            </Content>
        </CodeSplit>

        ## Examples:

        - [Pagination](~/examples/grid/pagination)
        - [Multiple selection](~/examples/grid/multiple-selection)
        - [Grouping](~/examples/grid/grouping)
        - [Dynamic Grouping](~/examples/grid/dynamic-grouping)
        - [Form Editing](~/examples/grid/form-edit)
        - [Row Editing](~/examples/grid/row-editing)
        - [Cell Editing](~/examples/grid/cell-editing)
        - [Inline Editing](~/examples/grid/inline-edit)
        - [Tree Grid](~/examples/grid/tree-grid)
        - [Stateful Tree Grid](~/examples/grid/stateful-tree-grid)
        - [Header Menu](~/examples/grid/header-menu)
        - [Complex Header](~/examples/grid/complex-headers)
        - [Buffering 5000 rows](~/examples/grid/buffering)
        - [Infinite scrolling](~/examples/grid/infinite-scrolling)
        - [Row Expanding](~/examples/grid/row-expanding)
        - [Column Resizing](~/examples/grid/column-resizing)
        - [Column Reordering (Drag & Drop)](~/examples/grid/column-reordering)
        - [Fixed Columns](~/examples/grid/fixed-columns)

        ## Configuration

        <p>
            <Tab value={{ bind: "$page.configTab", defaultValue: 'grid' }} tab="grid" mod="line">Grid</Tab>
            <Tab value-bind="$page.configTab" tab="column" mod="line">Column</Tab>
            <Tab value-bind="$page.configTab" tab="header" mod="line">Column Header</Tab>
            <Tab value-bind="$page.configTab" tab="grouping" mod="line">Grouping</Tab>
        </p>

        <ConfigTable props={configs} visible-expr="{$page.configTab}=='grid'"/>

        <ConfigTable props={columnConfigs} visible-expr="{$page.configTab}=='column'"/>

        <ConfigTable props={columnHeaderConfigs} visible-expr="{$page.configTab}=='header'"/>

        <ConfigTable props={groupingConfigs} visible-expr="{$page.configTab}=='grouping'"/>

    </Md>
</cx>
