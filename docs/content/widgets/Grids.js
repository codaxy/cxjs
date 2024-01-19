import { Tab, Grid, Link } from 'cx/widgets';
import { Content, Controller, KeySelection } from 'cx/ui';
import { Format } from 'cx/util';
import { Md } from '../../components/Md';
import { CodeSplit } from '../../components/CodeSplit';
import { CodeSnippet } from '../../components/CodeSnippet';
import { ConfigTable } from '../../components/ConfigTable';
import { ImportPath } from '../../components/ImportPath';

import { casual } from '../examples/data/casual';
import plural from 'plural';

import configs from './configs/Grid';
import groupingConfigs from './configs/GridGrouping';
import columnConfigs from './configs/GridColumn';
import columnHeaderConfigs from './configs/GridColumnHeader';

class PageController extends Controller {
    onInit() {
        this.store.init('$page.records', Array.from({ length: 100 }).map((v, i) => ({
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
                    style={{ height: '300px' }}
                    mod="responsive"
                    scrollable
                    columns={[
                        { header: 'Name', field: 'fullName', sortable: true, resizable: true },
                        { header: 'Continent', field: 'continent', sortable: true, resizable: true },
                        { header: 'Browser', field: 'browser', sortable: true, resizable: true },
                        { header: 'OS', field: 'os', sortable: true, resizable: true },
                        { header: 'Visits', field: 'visits', sortable: true, align: 'right', resizable: true }
                    ]}
                    selection={{ type: KeySelection, bind: '$page.selection', multiple: true }}
                />
            </div>
            <Content name="code">
                <div>
                    <Tab value-bind="$page.code.tab" tab="controller" mod="code" text="Controller" />
                    <Tab value-bind="$page.code.tab" tab="grid" mod="code" text="Grid" default />
                </div>
                <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="kzHH3vkM">
                    {`
                        class PageController extends Controller {
                            onInit() {
                               this.store.set('$page.records', Array.from({length: 10}).map((v, i) => ({
                                  id: i + 1,
                                  fullName: casual.full_name,
                                  continent: casual.continent,
                                  browser: casual.browser,
                                  os: casual.operating_system,
                                  visits: casual.integer(1, 100)
                               })));
                            }
                         }
                    `}
                </CodeSnippet>
                <CodeSnippet visible-expr="{$page.code.tab}=='grid'" fiddle="kzHH3vkM">{`
                    <Grid records-bind='$page.records'
                        style={{width: "100%"}}
                        columns={[
                            { header: 'Name', field: 'fullName', sortable: true },
                            { header: 'Continent', field: 'continent', sortable: true },
                            { header: 'Browser', field: 'browser', sortable: true },
                            { header: 'OS', field: 'os', sortable: true },
                            { header: 'Visits', field: 'visits', sortable: true }
                        ]}
                        selection={{type: KeySelection, bind:'$page.selection'}}
                    />
                `}
                </CodeSnippet>
            </Content>
        </CodeSplit>

        ## Examples:

        <div class="flex-row" style="gap: 4rem">
            <ul>
                <li><Link href="~/examples/grid/pagination" text="Pagination" /></li>
                <li><Link href="~/examples/grid/multiple-selection" text="Multiple selection" /></li>
                <li><Link href="~/examples/grid/grouping" text="Grouping" /></li>
                <li><Link href="~/examples/grid/dynamic-grouping" text="Dynamic Grouping" /></li>
                <li><Link href="~/examples/grid/form-edit" text="Form Editing" /></li>
                <li><Link href="~/examples/grid/row-editing" text="Row Editing" /></li>
                <li><Link href="~/examples/grid/cell-editing" text="Cell Editing" /></li>
                <li><Link href="~/examples/grid/inline-edit" text="Inline Editing" /></li>
                <li><Link href="~/examples/grid/tree-grid" text="Tree Grid" /></li>
                <li><Link href="~/examples/grid/stateful-tree-grid" text="Stateful Tree Grid" /></li>
            </ul>
            <ul>
                <li><Link href="~/examples/grid/header-menu" text="Header Menu" /></li>
                <li><Link href="~/examples/grid/complex-headers" text="Complex Header" /></li>
                <li><Link href="~/examples/grid/buffering" text="Buffering 5000 rows" /></li>
                <li><Link href="~/examples/grid/infinite-scrolling" text="Infinite scrolling" /></li>
                <li><Link href="~/examples/grid/row-expanding" text="Row Expanding" /></li>
                <li><Link href="~/examples/grid/column-resizing" text="Column Resizing" /></li>
                <li><Link href="~/examples/grid/column-reordering" text="Column Reordering (Drag & Drop)" /></li>
                <li><Link href="~/examples/grid/fixed-columns" text="Fixed Columns" /></li>
                <li><Link href="~/examples/grid/dynamic-columns" text="Dynamic Columns" /></li>
            </ul>
        </div>

        ## Configuration

        <p>
            <Tab value={{ bind: "$page.configTab", defaultValue: 'grid' }} tab="grid" mod="line">Grid</Tab>
            <Tab value-bind="$page.configTab" tab="column" mod="line">Column</Tab>
            <Tab value-bind="$page.configTab" tab="header" mod="line">Column Header</Tab>
            <Tab value-bind="$page.configTab" tab="grouping" mod="line">Grouping</Tab>
        </p>

        <ConfigTable props={configs} visible-expr="{$page.configTab}=='grid'" />
        <ConfigTable props={columnConfigs} visible-expr="{$page.configTab}=='column'" />
        <ConfigTable props={columnHeaderConfigs} visible-expr="{$page.configTab}=='header'" />
        <ConfigTable props={groupingConfigs} visible-expr="{$page.configTab}=='grouping'" />
    </Md>
</cx>
