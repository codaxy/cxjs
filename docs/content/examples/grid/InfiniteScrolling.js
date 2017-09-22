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

        this.addComputable('$page.startPage', ['$page.nextOffset', '$page.pageSize'], (offset, pageSize) => Math.trunc(offset / pageSize));
        this.addComputable('$page.endPage', ['$page.nextOffset', '$page.pageSize'], (offset, pageSize) => Math.trunc((offset + pageSize - 1) / pageSize));

        this.addTrigger('load', ['$page.startPage', '$page.endPage'], ::this.load, true);

        //TODO: Move caching logic inside the grid and provide onLoadPage(pageInfo, instance, filterData)
        //reset scroll on filter params change
    }

    load() {
        if (this.loading)
            return false;

        let {startPage, endPage, pageSize} = this.store.get('$page');
        console.log(startPage, endPage);

        let promises = [];
        for (let page = startPage; page <= endPage; page++)
            promises.push(this.loadPage(page));

        Promise.all(promises)
            .then(pages => {
                let records = [];
                pages.forEach(p => {
                    records.push(...p)
                });
                this.store.set('$page.records', records);
                this.store.set('$page.offset', startPage * pageSize);
                this.loading = false;
            })
            .catch((err) => {
                console.log(err);
                this.loading = false;
            });

        // console.log("LOAD", page);
        // this.loading = true;
        //
        //     .then(data => {
        //         this.store.set('$page.records', data.items);
        //         this.store.set('$page.offset', page * 100);
        //         this.loading = false;
        //     });
        //
        // // setTimeout(() => {
        // //     let records = Array
        // //         .from({length: 100})
        // //         .map((v, i) => this.getRow(offset + i));
        // //
        // //     this.loading = false;
        // //     let nextOffset = this.store.get('$page.nextOffset');
        // //
        // //     if (Math.abs(offset - nextOffset) < 50) {
        // //         this.store.set('$page.records', records);
        // //         this.store.set('$page.offset', offset);
        // //         console.log("DONE", offset, records);
        // //     }
        // //
        // //     if (offset != nextOffset)
        // //         this.loadPage();
        // // }, 50);
    }

    loadPage(page) {
        if (!this.cache)
            this.cache = {};
        let data = this.cache[page];
        if (data)
            return Promise.resolve(data);

        let records = [];
        for (let i = 0; i<120; i++)
            records.push({
                id: i + 1,
                fullName: casual.full_name,
                continent: casual.continent,
                browser: casual.browser,
                title: casual.full_name,
                answer_count: casual.integer(1, 100),
                view_count: casual.integer(1, 100),
            });

        this.cache[page] = records;
        return Promise.resolve(records);

        return fetch(`https://api.stackexchange.com/2.2/questions?order=desc&sort=activity&site=stackoverflow&page=${page + 1}&pageSize=120`)
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
                        //selection={{type: KeySelection, bind: "$page.selection"}}
                    />
                </div>
            </DetachedScope>

            <CodeSnippet putInto="code" fiddle="Qq5LHNJc">{}</CodeSnippet>
        </CodeSplit>

    </Md>
</cx>
