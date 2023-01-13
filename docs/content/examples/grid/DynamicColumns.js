import {Grid, LookupField, Tab, Button} from 'cx/widgets';
import {Content, Controller} from 'cx/ui';
import {Format} from 'cx/util';
import {Md} from '../../../components/Md';
import {CodeSplit} from '../../../components/CodeSplit';
import {CodeSnippet} from '../../../components/CodeSnippet';

import {casual} from '../data/casual';
import plural from 'plural';

let allColumns = [
    {
        header: 'Name',
        field: 'fullName',
        sortable: true,
        aggregate: 'count',
        footer: {expr: '({$group.$level} > 1 ? {$group.$name:s|TOTAL} + " - " : "") + {$group.fullName} + " " + {$group.fullName:plural;item}'}
    }, {
        header: 'Continent',
        field: 'continent',
        sortable: true,
        aggregate: 'distinct',
        aggregateAlias: 'continents',
        footer: {tpl: '{$group.continents} {$group.continents:plural;continent}'}
    }, {
        header: 'Browser',
        field: 'browser',
        sortable: true,
        aggregate: 'distinct',
        aggregateAlias: 'browsers',
        footer: {tpl: '{$group.browsers} {$group.browsers:plural;browser}'}
    }, {
        header: 'Visits',
        field: 'visits',
        sortable: true,
        aggregate: "sum",
        align: "right"
    }
];

class PageController extends Controller {
    onInit() {
        //init grid data
        this.store.set('$page.records', Array.from({length: 5}).map((v, i) => ({
            id: i + 1,
            fullName: casual.full_name,
            continent: casual.continent,
            browser: casual.browser,
            os: casual.operating_system,
            visits: casual.integer(1, 100)
        })));

        this.store.init('$page.visibleColumns', ['fullName', 'continent', 'browser', 'visits']);
    }
}

Format.registerFactory('plural', (format, text) => {
    return value => plural(text, value);
});

export const DynamicColumns = <cx>
    <Md controller={PageController}>
        <CodeSplit>

            # Dynamic Columns

            A common grid requirement is a possibility to configure visible columns.

            **Note**: this cannot be achieved using `columns` property, since `columns` property is not bindable.

            One way of doing this is by using `ContentResolver`.
            ContentResolver would listen to the changes of some store, i.e. `visibleColumns` and re-create columns array every time the store changes.
            However, since grid would be re-rendered on each store change, state of the grid, i.e. scroll, column widths (if resized from the initial width) would be lost.

            To avoid this, `columnParams` and `onGetColumns` callback were introduced.

            <div style="margin-bottom: 10px" ws>
                Visible Columns:
                <LookupField
                    values-bind="$page.visibleColumns"
                    options={[
                        {id: 'fullName', text: 'Name'},
                        {id: 'continent', text: 'Continent'},
                        {id: 'browser', text: 'Browser'},
                        {id: 'visits', text: 'Visits'},
                    ]}
                    multiple={true}
                />
            </div>

            <Grid
                records-bind='$page.records'
                style={{width: "100%"}}
                columnParams-bind="$page.visibleColumns"
                onGetColumns={(visibleColumns) => {
                    return allColumns.filter(c => visibleColumns.includes(c.field));
                }}
            />

            <div text="Multi-line use case:" visible-expr='{$page.visibleColumns.length}' style='margin: 20px 0' />

            <Grid
                records-bind="$page.records"
                style={{width: "100%"}}
                columnParams-bind="$page.visibleColumns"
                onGetColumns={(visibleColumns) => {
                    let columns = allColumns.filter(c => visibleColumns.includes(c.field));
                    if (!columns.length) return {};

                    return {
                        style: {
                            background: {expr: "{$record.showDescription} ? '#fff7e6' : null"}
                        },
                        line1: {
                            columns: [
                                ...columns,
                                {
                                    header: false,
                                    align: "center",
                                    pad: false,
                                    items: <cx>
                                        <cx>
                                            <Button
                                                mod="hollow"
                                                icon="drop-down"
                                                onClick={(e, {store}) => {
                                                    store.toggle('$record.showDescription');
                                                }}
                                            />
                                        </cx>
                                    </cx>,
                                    visible: columns.length > 0
                                }
                            ]
                        },
                        line3: {
                            visible: {expr: "{$record.showDescription}"},
                            columns: [{
                                colSpan: 1000,
                                style: 'border-top-color: rgba(0, 0, 0, 0.05)',
                                items: <cx>
                                    <div>
                                        {columns.map(c => <cx>
                                            <div>
                                                <div
                                                    text-tpl={`${c.header}: `}
                                                    style='width: 70px; display: inline-block; text-align: right; margin-right: 10px; font-weight: bold'
                                                />
                                                <div text-tpl={`{$record.${c.field}}`} style='display: inline-block'/>
                                            </div>
                                        </cx>)}
                                    </div>
                                </cx>
                            }]
                        }
                    }
                }}
            />

            <Content name="code">
                <Tab value-bind="$page.code.tab" tab="controller" mod="code" text="Controller" />
                <Tab value-bind="$page.code.tab" tab="grids" mod="code"  text="Grids" default/>
                <Tab value-bind="$page.code.tab" tab="columns" mod="code" text="Columns" />

                <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle='eP8JXxF3'>{`
                class PageController extends Controller {
                    onInit() {
                        //init grid data
                        this.store.set('$page.records', Array.from({length: 5}).map((v, i) => ({
                            id: i + 1,
                            fullName: casual.full_name,
                            continent: casual.continent,
                            browser: casual.browser,
                            os: casual.operating_system,
                            visits: casual.integer(1, 100)
                        })));

                        this.store.init('$page.visibleColumns', ['fullName', 'continent', 'browser', 'visits']);
                    }
                }
                `}</CodeSnippet>
                <CodeSnippet visible-expr="{$page.code.tab}=='grids'" fiddle='eP8JXxF3'>{`
                <div style="margin-bottom: 10px" ws>
                    Visible Columns:
                    <LookupField
                        values-bind="$page.visibleColumns"
                        options={[
                            {id: 'fullName', text: 'Name'},
                            {id: 'continent', text: 'Continent'},
                            {id: 'browser', text: 'Browser'},
                            {id: 'visits', text: 'Visits'},
                        ]}
                        multiple={true}
                    />
                </div>

                <Grid
                    records-bind='$page.records'
                    style={{width: "100%"}}
                    columnParams-bind="$page.visibleColumns"
                    onGetColumns={(visibleColumns) => {
                        return allColumns.filter(c => visibleColumns.includes(c.field));
                    }}
                />

                <div text="Multi-line use case:" visible-expr='{$page.visibleColumns.length}' style='margin: 20px 0' />

                <Grid
                    records-bind="$page.records"
                    style={{width: "100%"}}
                    columnParams-bind="$page.visibleColumns"
                    onGetColumns={(visibleColumns) => {
                        let columns = allColumns.filter(c => visibleColumns.includes(c.field));
                        if (!columns.length) return {};

                        return {
                            style: {
                                background: {expr: "{$record.showDescription} ? '#fff7e6' : null"}
                            },
                            line1: {
                                columns: [
                                    ...columns,
                                    {
                                        header: false,
                                        align: "center",
                                        pad: false,
                                        items: <cx>
                                            <cx>
                                                <Button
                                                    mod="hollow"
                                                    icon="drop-down"
                                                    onClick={(e, {store}) => {
                                                        store.toggle('$record.showDescription');
                                                    }}
                                                />
                                            </cx>
                                        </cx>,
                                        visible: columns.length > 0
                                    }
                                ]
                            },
                            line3: {
                                visible: {expr: "{$record.showDescription}"},
                                columns: [{
                                    colSpan: 1000,
                                    style: 'border-top-color: rgba(0, 0, 0, 0.05)',
                                    items: <cx>
                                        <div>
                                            {columns.map(c => <cx>
                                                <div>
                                                    <div
                                                        text-tpl={\`\${c.header}: \`}
                                                        style='width: 70px; display: inline-block; text-align: right; margin-right: 10px; font-weight: bold'
                                                    />
                                                    <div text-tpl={\`{$record.\${c.field}}\`} style='display: inline-block'/>
                                                </div>
                                            </cx>)}
                                        </div>
                                    </cx>
                                }]
                            }
                        }
                    }}
                />
                `}
                </CodeSnippet>

                <CodeSnippet visible-expr="{$page.code.tab}=='columns'" fiddle='eP8JXxF3'>{`
                let allColumns = [
                    {
                        header: 'Name',
                        field: 'fullName',
                        sortable: true,
                        aggregate: 'count',
                        footer: {expr: '({$group.$level} > 1 ? {$group.$name:s|TOTAL} + " - " : "") + {$group.fullName} + " " + {$group.fullName:plural;item}'}
                    }, {
                        header: 'Continent',
                        field: 'continent',
                        sortable: true,
                        aggregate: 'distinct',
                        aggregateAlias: 'continents',
                        footer: {tpl: '{$group.continents} {$group.continents:plural;continent}'}
                    }, {
                        header: 'Browser',
                        field: 'browser',
                        sortable: true,
                        aggregate: 'distinct',
                        aggregateAlias: 'browsers',
                        footer: {tpl: '{$group.browsers} {$group.browsers:plural;browser}'}
                    }, {
                        header: 'Visits',
                        field: 'visits',
                        sortable: true,
                        aggregate: "sum",
                        align: "right"
                    }
                ];
                `}
                </CodeSnippet>
            </Content>
        </CodeSplit>
    </Md>
</cx>
