import {HtmlElement, DetachedScope, Grid} from 'cx/widgets';
import {Controller, KeySelection} from 'cx/ui';
import {Md} from '../../../components/Md';
import {CodeSplit} from '../../../components/CodeSplit';
import {CodeSnippet} from '../../../components/CodeSnippet';

import {casual} from '../data/casual';

export const InfiniteScrolling = <cx>
    <Md>
        # Infinite Grid Scrolling

        <CodeSplit>

            Infinite scrolling is a technique of dynamically loading additional data based on the scroll position. Grids
            support infinite by setting the `infinite` flag and implementing the `onFetchRecords` callback which
            is responsible for fetching data based on current the visible page and active sorting and filtering
            parameters. Fetch result should be an object containing the `records` property containing an array of
            records; The `lastPage` flag should be set if there is no remaining data. Alternatively, `totalRecordCount`
            can be used to indicate total number of records. If necessary, the fetch result should include `state` to
            pass data such as pagination tokens or cursor positions between fetch results.

            <Grid
                infinite
                style="height: 800px"
                lockColumnWidths
                cached
                keyField="id"
                columns={[
                    {header: "#", field: "id", sortable: true},
                    {header: "Name", field: "fullName", sortable: true},
                    {header: "Continent", field: "continent", sortable: true},
                    {header: "Browser", field: "browser", sortable: true},
                    {header: "Visits", field: "visits", sortable: true, align: "right"}
                ]}
                selection={{type: KeySelection, bind: "$page.selection", keyField: "id"}}
                onFetchRecords={({page, pageSize}) => new Promise(resolve => {
                    setTimeout(() => {
                        let records = [];
                        for (let i = 0; i < pageSize; i++)
                            records.push({
                                id: (page - 1) * pageSize + i + 1,
                                fullName: casual.full_name,
                                continent: casual.continent,
                                browser: casual.browser,
                                title: casual.full_name,
                                visits: casual.integer(1, 100)
                            });

                        resolve({
                            records,
                            totalRecordCount: 100000
                        });
                    }, 100);
                })}
            />

            <CodeSnippet putInto="code">{`
                <Grid
                    infinite
                    style="height: 800px"
                    lockColumnWidths
                    cached
                    keyField="question_id"
                    columns={[
                        {header: "#", field: "id", sortable: true},
                        {header: "Name", field: "fullName", sortable: true},
                        {header: "Continent", field: "continent", sortable: true},
                        {header: "Browser", field: "browser", sortable: true},
                        {header: "Visits", field: "visits", sortable: true, align: "right"}
                    ]}
                    selection={{type: KeySelection, bind: "$page.selection", keyField: "id"}}
                    onFetchRecords={({page, pageSize}) => new Promise(resolve => {
                        setTimeout(() => {
                            let records = [];
                            for (let i = 0; i < pageSize; i++)
                                records.push({
                                    id: (page - 1) * pageSize + i + 1,
                                    fullName: casual.full_name,
                                    continent: casual.continent,
                                    browser: casual.browser,
                                    title: casual.full_name,
                                    visits: casual.integer(1, 100)
                                });
                            resolve({
                                records,
                                totalRecordCount: 100000
                            });
                        }, 100);
                    })}
                />
            `}</CodeSnippet>
        </CodeSplit>
    </Md>
</cx>
