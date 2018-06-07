import {HtmlElement, Grid, LookupField} from 'cx/widgets';
import {Content, Controller} from 'cx/ui';
import {Format} from 'cx/util';
import {Md} from '../../../components/Md';
import {CodeSplit} from '../../../components/CodeSplit';
import {CodeSnippet} from '../../../components/CodeSnippet';

import {casual} from '../data/casual';
import plural from 'plural';

class PageController extends Controller {
    onInit() {
        //init grid data
        this.store.set('$page.records', Array.from({length: 100}).map((v, i) => ({
            id: i + 1,
            fullName: casual.full_name,
            continent: casual.continent,
            browser: casual.browser,
            os: casual.operating_system,
            visits: casual.integer(1, 100)
        })));

        //init grouping options
        this.store.set('$page.groupableFields', [
            {id: 'continent', text: 'Continent'},
            {id: 'browser', text: 'Browser'},
            {id: 'os', text: 'Operating System'}
        ]);
    }
}

Format.registerFactory('plural', (format, text) => {
    return value => plural(text, value);
});

export const DynamicGrouping = <cx>
    <Md controller={PageController}>
        <CodeSplit>

            # Dynamic Grouping in Grids

            Grid control supports multiple levels of grouping and aggregation.

            <div style="margin-bottom: 10px" ws>
                Group by:
                <LookupField
                    records:bind="$page.grouping"
                    options:bind="$page.groupableFields"
                    multiple={true}
                />
            </div>

            <Grid
                records:bind='$page.records'
                style={{width: "100%"}}
                groupingParams:bind="$page.grouping"
                onCreateGrouping={(groupingParams) => [
                    {key: {}, showFooter: true},
                    ...(groupingParams || []).map(x => x.id)
                ]}
                columns={[{
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
                    header: 'OS',
                    field: 'os',
                    sortable: true,
                    aggregate: 'distinct',
                    aggregateAlias: 'oss',
                    footer: {tpl: '{$group.oss} {$group.oss:plural;OS}'}
                }, {
                    header: 'Visits',
                    field: 'visits',
                    sortable: true,
                    aggregate: "sum",
                    align: "right"
                }]}
            />

            <Content name="code">
                <CodeSnippet fiddle="8q0SGiPg">{`
                class PageController extends Controller {
                    onInit() {
                        //init grid data
                        this.store.set('$page.records', Array.from({length: 100}).map((v, i)=>({
                            id: i + 1,
                            fullName: casual.full_name,
                            continent: casual.continent,
                            browser: casual.browser,
                            os: casual.operating_system,
                            visits: casual.integer(1, 100)
                        })));

                        //init grouping options
                        this.store.set('$page.groupableFields', [
                            {id: 'continent', text: 'Continent'},
                            {id: 'browser', text: 'Browser'},
                            {id: 'os', text: 'Operating System'}
                        ]);
                    }
                }

                Format.registerFactory('plural', (format, text) => {
                   return value => plural(text, value);
                });

               ...

                <div style="margin-bottom: 10px" ws>
                    Group by:
                    <LookupField
                        records:bind="$page.grouping"
                        options:bind="$page.groupableFields"
                        multiple={true}
                    />
                </div>

                <Grid
                    records:bind='$page.records'
                    style={{width: "100%"}}
                    groupingParams:bind="$page.grouping"
                    onCreateGrouping={(groupingParams) => [
                        {key: {}, showFooter: true},
                        ...(groupingParams || []).map(x => x.id)
                    ]}
                    columns={[{
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
                        header: 'OS',
                        field: 'os',
                        sortable: true,
                        aggregate: 'distinct',
                        aggregateAlias: 'oss',
                        footer: {tpl: '{$group.oss} {$group.oss:plural;OS}'}
                    }, {
                        header: 'Visits',
                        field: 'visits',
                        sortable: true,
                        aggregate: "sum",
                        align: "right"
                    }]}
                />

            `}
                </CodeSnippet>
            </Content>

        </CodeSplit>

    </Md>
</cx>
