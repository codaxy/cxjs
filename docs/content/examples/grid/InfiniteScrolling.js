import {HtmlElement, DetachedScope, Grid} from 'cx/widgets';
import {Controller, KeySelection} from 'cx/ui';
import {debounce} from 'cx/util';
import {Md} from '../../../components/Md';
import {CodeSplit} from '../../../components/CodeSplit';
import {CodeSnippet} from '../../../components/CodeSnippet';

import {casual} from '../data/casual';

class PageController extends Controller {
    loadPage({page, pageSize}) {
        return new Promise(resolve => {
            setTimeout(() => {
                //console.log("LOAD", page, pageSize)
                let records = [];
                for (let i = 0; i < pageSize; i++)
                    records.push({
                        index: (page-1) * pageSize + i + 1,
                        question_id: page * pageSize + i + 1,
                        fullName: casual.full_name,
                        continent: casual.continent,
                        browser: casual.browser,
                        title: casual.full_name,
                        answer_count: casual.integer(1, 100),
                        view_count: casual.integer(1, 100),
                    });
                resolve({
                    records,
                    totalRecordCount: 100000
                });
            }, 100);
        });

        return fetch(`https://api.stackexchange.com/2.2/questions?order=desc&sort=activity&site=stackoverflow&page=${page}&pagesize=${pageSize}`)
            .then(x => x.json())
            .then(x => ({
                records: x.items,
                lastPage: !x.has_more
            }));
    }
}

export const InfiniteScrolling = <cx>
    <Md>

        # Infinite Grid Scrolling

        <CodeSplit>

            Infinite scrolling is a technique of dynamically loading more data based on the scroll position. Grids
            support infinite by setting the `infinite` flag and implementing the `onFetchRecords` callback which
            is responsible for fetching data based on current sorting and filtering parameters.

            <DetachedScope bind="$page">
                <div controller={PageController}>
                    <Grid
                        infinite
                        onFetchRecords="loadPage"
                        style="height: 800px"
                        lockColumnWidths
                        cached
                        keyField="question_id"
                        columns={[
                            {header: "#", field: "index"},
                            {header: "Answers", field: "answer_count", sortable: true},
                            {header: "Question", field: "title"},
                            {header: "Views", field: "view_count", sortable: true, align: "right"}
                        ]}
                        selection={{type: KeySelection, bind: "$page.selection", keyField: "question_id"}}
                    />
                </div>
            </DetachedScope>

            <CodeSnippet putInto="code">{}</CodeSnippet>
        </CodeSplit>

    </Md>
</cx>
