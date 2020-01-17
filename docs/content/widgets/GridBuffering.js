import { Controller, KeySelection } from 'cx/ui';
import { Grid } from 'cx/widgets';
import { CodeSnippet } from '../../components/CodeSnippet';
import { CodeSplit } from '../../components/CodeSplit';
import { Md } from '../../components/Md';
import { casual } from '../examples/data/casual';

class PageController extends Controller {
    onInit() {
        this.store.init(
            "$page.records",
            Array
                .from({length: 5000})
                .map((v, i) => ({
                    id: i + 1,
                    fullName: casual.full_name,
                    continent: casual.continent,
                    browser: casual.browser,
                    os: casual.operating_system,
                    visits: casual.integer(1, 100)
                }))
        );
    }
}

export const GridBuffering = <cx>
    <Md controller={PageController}>

        # Grid Buffering

        <CodeSplit>

            The `Grid` widget supports buffered rendering which dramatically improves performance with many rows.
            Set grid to `buffered` mode and tweak `bufferSize` and `bufferStep` parameters for the best scrolling experience.

            <Grid
                records:bind="$page.records"
                keyField="id"
                buffered
                style="height: 800px"
                lockColumnWidths
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

            <CodeSnippet putInto="code" fiddle="t1lQ6JCH">{`
                class PageController extends Controller {
                    onInit() {
                        this.store.init(
                            "$page.records",
                            Array
                                .from({length: 10000})
                                .map((v, i) => ({
                                    id: i + 1,
                                    fullName: casual.full_name,
                                    continent: casual.continent,
                                    browser: casual.browser,
                                    os: casual.operating_system,
                                    visits: casual.integer(1, 100)
                                }))
                        );
                    }
                }
                ...
                <Grid
                    records:bind="$page.records"
                    keyField="id"
                    buffered
                    style="height: 800px"
                    lockColumnWidths
                    cached
                    columns={[
                        { header: "#", field: "index", sortable: true, value: { bind: "$index"} },
                        { header: "Name", field: "fullName", sortable: true },
                        { header: "Continent", field: "continent", sortable: true },
                        { header: "Browser", field: "browser", sortable: true },
                        { header: "OS", field: "os", sortable: true },
                        { header: "Visits", field: "visits", sortable: true, align: "right" }
                    ]}
                    selection={{ type: KeySelection, bind: "$page.selection" }}
                />
                `}</CodeSnippet>
        </CodeSplit>

    </Md>
</cx>
