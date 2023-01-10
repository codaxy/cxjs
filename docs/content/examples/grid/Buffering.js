import { HtmlElement, Checkbox, Grid, Tab, Content } from 'cx/widgets';
import { Controller, KeySelection } from 'cx/ui';
import { Md } from '../../../components/Md';
import { CodeSplit } from '../../../components/CodeSplit';
import { CodeSnippet } from '../../../components/CodeSnippet';

import { casual } from '../data/casual';

class PageController extends Controller {
    onInit() {
        this.store.init(
            "$page.records",
            Array
                .from({ length: 5000 })
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

export const Buffering = <cx>
    <Md controller={PageController}>

        # Grid Buffering

        <CodeSplit>

            The `Grid` widget supports buffered rendering which dramatically improves performance with many rows.
            Set grid to `buffered` mode and tweak `bufferSize` and `bufferStep` parameters for the best scrolling experience.

            <Grid
                records-bind="$page.records"
                keyField="id"
                buffered
                style="height: 650px"
                mod={["fixed-layout", "contain"]}
                cached
                columns={[
                    { header: '#', defaultWidth: 50, items: <cx><div class="cxe-grid-row-number" /></cx> },
                    { header: { text: "Name", style: 'width: 100%' }, field: "fullName", sortable: true, resizable: true },
                    { header: "Continent", field: "continent", sortable: true, resizable: true, defaultWidth: 150 },
                    { header: "Browser", field: "browser", sortable: true, resizable: true, defaultWidth: 170 },
                    { header: "OS", field: "os", sortable: true, resizable: true, defaultWidth: 80 },
                    { header: "Visits", field: "visits", sortable: true, align: "right", resizable: true, defaultWidth: 70 }
                ]}
                selection={{ type: KeySelection, bind: "$page.selection" }}
            />
            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="controller" text="Controller" default/>
                <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default/>
                <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="t1lQ6JCH">{`
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
                `}</CodeSnippet>
                <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="t1lQ6JCH">{`
                    <Grid
                        records-bind="$page.records"
                        keyField="id"
                        buffered
                        style="height: 650px"
                        mod="fixed-layout"
                        cached
                        columns={[
                            { header: '#', defaultWidth: 50, items: <cx><div class="cxe-grid-row-number" /></cx> },
                            { header: { text: "Name", style: 'width: 100%' }, field: "fullName", sortable: true, resizable: true },
                            { header: "Continent", field: "continent", sortable: true, resizable: true, defaultWidth: 150 },
                            { header: "Browser", field: "browser", sortable: true, resizable: true, defaultWidth: 170 },
                            { header: "OS", field: "os", sortable: true, resizable: true, defaultWidth: 80 },
                            { header: "Visits", field: "visits", sortable: true, align: "right", resizable: true, defaultWidth: 70 }
                        ]}
                        selection={{ type: KeySelection, bind: "$page.selection" }}
                    />
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

    </Md>
</cx>
