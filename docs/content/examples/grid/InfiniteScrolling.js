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
            offset: 0,
            nextOffset: 0
        });

        this.addTrigger('load', ['$page.nextOffset'], ::this.loadPage, true);
    }

    loadPage() {
        if (this.loading)
            return false;
        let offset = this.store.get('$page.nextOffset');
        console.log("LOAD", offset);
        this.loading = true;
        setTimeout(() => {
            let records = Array
                .from({length: 100})
                .map((v, i) => this.getRow(offset + i));

            this.loading = false;
            let nextOffset = this.store.get('$page.nextOffset');

            if (Math.abs(offset - nextOffset) < 50) {
                this.store.set('$page.records', records);
                this.store.set('$page.offset', offset);
                console.log("DONE", offset, records);
            }

            if (offset != nextOffset)
                this.loadPage();
        }, 50);
    }

    getRow(i) {
        if (!this.cache)
            this.cache = {};

        if (!this.cache[i])
            this.cache[i] = {
                id: i + 1,
                fullName: casual.full_name,
                continent: casual.continent,
                browser: casual.browser,
                os: casual.operating_system,
                visits: casual.integer(1, 100)
            };

        return this.cache[i];
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
                            {header: "#", field: "id", sortable: true},
                            {header: "Name", field: "fullName", sortable: true},
                            {header: "Continent", field: "continent", sortable: true},
                            {header: "Browser", field: "browser", sortable: true},
                            {header: "OS", field: "os", sortable: true},
                            {header: "Visits", field: "visits", sortable: true, align: "right"}
                        ]}
                        //selection={{type: KeySelection, bind: "$page.selection"}}
                    />
                </div>
            </DetachedScope>

            <CodeSnippet putInto="code" fiddle="Qq5LHNJc">{}</CodeSnippet>
        </CodeSplit>

    </Md>
</cx>
