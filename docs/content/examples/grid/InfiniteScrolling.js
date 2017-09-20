import { HtmlElement, Checkbox, Grid } from 'cx/widgets';
import { Controller, KeySelection } from 'cx/ui';
import {Md} from '../../../components/Md';
import {CodeSplit} from '../../../components/CodeSplit';
import {CodeSnippet} from '../../../components/CodeSnippet';

import {casual} from '../data/casual';

class PageController extends Controller {
    onInit() {
        this.store.init('$page', {
            recordCount: 10000,
            offset: 0
        });

        this.addTrigger('load', ['$page.nextOffset'], ::this.loadPage, true);
    }

    loadPage() {
        if (this.loading)
            return false;
        let offset = this.store.get('$page.nextOffset');
        this.loading = true;
        setTimeout(() => {
            let records = Array
                .from({length: 100})
                .map((v, i) => this.getRow(i));

            this.store.set('$page.records', records);
            this.store.set('$page.offset', offset);
            this.loading = false;
            if (offset != this.store.get('$page.nextOffset'))
                this.loadPage();
        }, 100);
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
    <Md controller={PageController}>

        # Infinite Grid Scrolling

        <CodeSplit>

            The `Grid` widgets supports buffered rendering which dramatically improves performance with many rows.
            Set grid to `buffered` mode and tweak `bufferSize` and `bufferStep` parameters for the best scrolling experience.

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
                columns={[
                    { header: "#", field: "index", sortable: true, value: { expr: "{$index}+1"} },
                    { header: "Name", field: "fullName", sortable: true },
                    { header: "Continent", field: "continent", sortable: true },
                    { header: "Browser", field: "browser", sortable: true },
                    { header: "OS", field: "os", sortable: true },
                    { header: "Visits", field: "visits", sortable: true, align: "right" }
                ]}
                selection={{ type: KeySelection, bind: "$page.selection" }}
            />

            <CodeSnippet putInto="code" fiddle="Qq5LHNJc">{}</CodeSnippet>
        </CodeSplit>

    </Md>
</cx>
