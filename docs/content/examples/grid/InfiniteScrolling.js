import {HtmlElement, DetachedScope, Grid} from 'cx/widgets';
import {Controller, KeySelection} from 'cx/ui';
import {debounce} from 'cx/util';
import {Md} from '../../../components/Md';
import {CodeSplit} from '../../../components/CodeSplit';
import {CodeSnippet} from '../../../components/CodeSnippet';

import {casual} from '../data/casual';

class PageController extends Controller {
    onInit() {
        this.store.init('$page', {
            recordCount: 100000,
            pageSize: 120,
            offset: 0,
            nextOffset: 0
        });

        //TODO: Support total to be loaded with the page, make records and offset to be optional bindings
    }

    loadPage({page, pageSize}) {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log("LOAD", page, pageSize)
                let records = [];
                for (let i = 0; i<pageSize; i++)
                    records.push({
                        id: page * pageSize + i + 1,
                        fullName: casual.full_name,
                        continent: casual.continent,
                        browser: casual.browser,
                        title: casual.full_name,
                        answer_count: casual.integer(1, 100),
                        view_count: casual.integer(1, 100),
                    });
                resolve(records);
            }, 100);
        });

        return fetch(`https://api.stackexchange.com/2.2/questions?order=desc&sort=activity&site=stackoverflow&page=${page + 1}&pageSize=${pageSize}`)
            .then(x => x.json())
            .then(x => {
                this.cache[page] = x.items;
                return x.items;
            })
    }
}

export const InfiniteScrolling = <cx>
    <Md>

        # Infinite Grid Scrolling

        <CodeSplit>

            The `Grid` widgets supports buffered rendering which dramatically improves performance with many rows.
            Set grid to `buffered` mode and tweak `bufferSize` and `bufferStep` parameters for the best scrolling
            experience.

            <DetachedScope bind="$page">
                <div controller={PageController}>
                    <Grid
                        records:bind="$page.records"
                        buffered
                        style="height: 800px"
                        lockColumnWidths
                        totalRecordCount:bind="$page.recordCount"
                        offset:bind="$page.offset"
                        loadingOffset:bind="$page.nextOffset"
                        bufferedLoading
                        cached
                        keyField="id"
                        columns={[
                            {header: "Answers", field: "answer_count", sortable: true},
                            {header: "Question", field: "title", sortable: true},
                            {header: "Views", field: "view_count", sortable: true, align: "right"}
                        ]}
                        selection={{type: KeySelection, bind: "$page.selection"}}
                        onLoadRecordsPage="loadPage"
                    />
                </div>
            </DetachedScope>

            <CodeSnippet putInto="code" fiddle="Qq5LHNJc">{}</CodeSnippet>
        </CodeSplit>

    </Md>
</cx>
