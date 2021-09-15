import { Grid, Content, Tab, Repeater, DragSource, DropZone, Button } from "cx/widgets";
import { Controller, computable } from "cx/ui";
import { insertElement } from "cx/data";
import { casual } from '../data/casual';
import { Md } from '../../../components/Md';
import { CodeSplit } from '../../../components/CodeSplit';
import { CodeSnippet } from '../../../components/CodeSnippet';

let allColumns = [
    {
        key: "date",
        header: "Date",
        field: "date",
        format: "date",
        sortable: true,
        resizable: true,
        type: "date",
        defaultWidth: 100,
        draggable: true,
    },
    {
        key: "fullName",
        header: "Name",
        field: "fullName",
        sortable: true,
        resizable: true,
        defaultWidth: 200,
        draggable: true,
    },
    {
        key: "continent",
        header: "Continent",
        field: "continent",
        sortable: true,
        resizable: true,
        defaultWidth: 150,
        draggable: true,
    },
    {
        key: "browser",
        header: "Browser",
        field: "browser",
        sortable: true,
        resizable: true,
        defaultWidth: 150,
        draggable: true,
    },
    {
        key: "os",
        header: "OS",
        field: "os",
        sortable: true,
        resizable: true,
        defaultWidth: 150,
        draggable: true,
    },
    {
        key: "visits",
        header: "Visits",
        field: "visits",
        sortable: true,
        align: "right",
        type: "number",
        defaultWidth: 100,
        draggable: true,
    },
];

class PageController extends Controller {
    onInit() {
        //init grid data
        this.store.init("$page.records", this.getRandomData());

        this.store.init(
            "$page.columnOrder",
            allColumns.map((x) => x.key)
        );

        this.store.init("$page.unusedColumns", []);
    }

    getRandomData() {
        return Array.from({ length: 100 }).map((v, i) => ({
            id: i + 1,
            fullName: casual.full_name,
            continent: casual.continent,
            browser: casual.browser,
            os: casual.operating_system,
            visits: casual.integer(1, 100),
            date: Date.now() + 100 * Math.random() * 86400 * 1000,
        }));
    }

    onResetColumns() {
        this.store.set(
            "$page.columnOrder",
            allColumns.map((x) => x.key)
        );
        this.store.set("$page.unusedColumns", []);
    }
}

export const ColumnReordering = <cx>
    <Md controller={PageController}>
        <CodeSplit>
            # Column Reordering

            Grid columns can be dragged & dropped.

            <div style="margin-bottom: 10px; display: flex">
                <Repeater
                    records={computable("$page.unusedColumns", (columns) =>
                        columns.map((key) => allColumns.find((c) => c.key == key))
                    )}
                >
                    <DragSource
                        style="background: #eee; border: 1px solid lightgray; padding: 5px 10px; font-size: 12px; margin-right: 5px; cursor: pointer"
                        data={{
                            type: "unused-column",
                            key: { bind: "$record.key" },
                        }}
                    >
                        <span text-bind="$record.header" />
                    </DragSource>
                </Repeater>

                <DropZone
                    style="border: 1px dotted lightgray; flex-grow: 1; padding: 5px 10px; font-size: 12px; transition: background 0.3s"
                    onDropTest={(e) => e?.source?.type == "grid-column"}
                    overStyle="background: yellow;"
                    onDrop={(e, { store }) => {
                        let { key } = e.source.column;
                        store.update("$page.columnOrder", (colOrder) => colOrder.filter((c) => c != key));
                        store.update("$page.unusedColumns", (columns) => [...columns, key]);
                    }}
                >
                    Drag & drop column here to remove it from the grid
                </DropZone>
            </div>


            <Grid
                records-bind="$page.records"
                mod="fixed-layout"
                scrollable
                buffered={true}
                style="height: 330px; margin-bottom: 10px"
                lockColumnWidths
                columnParams-bind="$page.columnOrder"
                onGetColumns={(columnOrder) => columnOrder.map((key) => allColumns.find((c) => c.key == key))}
                onColumnDropTest={(e, instance) =>
                    (e.source?.type == "grid-column" && e.source?.gridInstance == instance) ||
                    e.source?.data?.type == "unused-column"
                }
                onColumnDrop={(e, { store }) => {
                    let key = e.source.type == "grid-column" ? e.source.column.key : e.source.data.key;
                    let { index } = e.target;
                    let columnOrder = store.get("$page.columnOrder");
                    let at = columnOrder.indexOf(key);
                    let result = columnOrder.filter((c) => c != key);
                    if (at >= 0 && at < index) index--;
                    result = insertElement(result, index, key);
                    store.set("$page.columnOrder", result);
                    store.update("$page.unusedColumns", (unused) => unused.filter((c) => c != key));
                }}
            />

            <Button onClick="onResetColumns">Reset Columns</Button>

            <Content name="code">
                <div>
                    <Tab value-bind="$page.code.tab" tab="controller" mod="code">
                        <code>Controller</code>
                    </Tab>

                    <Tab value-bind="$page.code.tab" tab="grid" mod="code" default>
                        <code>Grid</code>
                    </Tab>

                    <Tab value-bind="$page.code.tab" tab="toolbar" mod="code">
                        <code>Toolbar</code>
                    </Tab>

                    <Tab value-bind="$page.code.tab" tab="columns" mod="code">
                        <code>Columns</code>
                    </Tab>
                </div>

                <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle='w6G2aFy9'>{`
                class PageController extends Controller {
                    onInit() {
                        //init grid data
                        this.store.init("$page.records", this.getRandomData());

                        //set all columns to be visible
                        this.store.init(
                           "$page.columnOrder",
                           allColumns.map((x) => x.key)
                        );

                        //no unused columns
                        this.store.init("$page.unusedColumns", []);
                     }

                     getRandomData() {
                        return Array.from({ length: 100 }).map((v, i) => ({
                           id: i + 1,
                           fullName: casual.full_name,
                           continent: casual.continent,
                           browser: casual.browser,
                           os: casual.operating_system,
                           visits: casual.integer(1, 100),
                           date: Date.now() + 100 * Math.random() * 86400 * 1000,
                        }));
                     }

                     onResetColumns() {
                        this.store.set(
                            "$page.columnOrder",
                            allColumns.map((x) => x.key)
                        );
                        this.store.set("$page.unusedColumns", []);
                     }
                }
                `}</CodeSnippet>
                <CodeSnippet visible:expr="{$page.code.tab}=='grid'" fiddle='w6G2aFy9'>{`
                <Grid
                    records-bind="$page.records"
                    mod="fixed-layout"
                    scrollable
                    buffered
                    style="height: 500px;"
                    lockColumnWidths
                    columnParams-bind="$page.columnOrder"
                    onGetColumns={(columnOrder) => columnOrder.map((key) => allColumns.find((c) => c.key == key))}
                    onColumnDropTest={(e, instance) =>
                        (e.source.type == "grid-column" && e.source.gridInstance == instance) ||
                        e.source?.data.type == "unused-column"
                    }
                    onColumnDrop={(e, { store }) => {
                        let key = e.source.type == "grid-column" ? e.source.column.key : e.source.data.key;
                        let { index } = e.target;
                        let columnOrder = store.get("$page.columnOrder");
                        let at = columnOrder.indexOf(key);
                        let result = columnOrder.filter((c) => c != key);
                        if (at >= 0 && at < index) index--;
                        result = insertElement(result, index, key);
                        store.set("$page.columnOrder", result);
                        store.update("$page.unusedColumns", (unused) => unused.filter((c) => c != key));
                    }}
                />
                `}
                </CodeSnippet>
                <CodeSnippet visible-expr="{$page.code.tab}=='toolbar'" fiddle='w6G2aFy9'>{`
                <div style="margin-bottom: 10px; display: flex">
                    <Repeater
                        records={computable("$page.unusedColumns", (columns) =>
                            columns.map((key) => allColumns.find((c) => c.key == key))
                        )}
                    >
                        <DragSource
                            style="background: #eee; border: 1px solid lightgray; padding: 5px 10px; font-size: 12px; margin-right: 5px; cursor: pointer"
                            data={{
                                type: "unused-column",
                                key: { bind: "$record.key" },
                            }}
                        >
                            <span text-bind="$record.header" />
                        </DragSource>
                    </Repeater>

                    <DropZone
                        style="border: 1px dotted lightgray; flex-grow: 1; padding: 5px 10px; font-size: 12px; transition: background 0.3s"
                        onDropTest={(e) => e?.source?.type == "grid-column"}
                        overStyle="background: yellow;"
                        onDrop={(e, { store }) => {
                            let { key } = e.source.column;
                            store.update("$page.columnOrder", (colOrder) => colOrder.filter((c) => c != key));
                            store.update("$page.unusedColumns", (columns) => [...columns, key]);
                        }}
                    >
                        Drag & drop column here to remove it from the grid
                    </DropZone>
                </div>
                `}
                </CodeSnippet>
                <CodeSnippet visible-expr="{$page.code.tab}=='columns'" fiddle='w6G2aFy9'>{`
                let allColumns = [
                    {
                       key: "date",
                       header: "Date",
                       field: "date",
                       format: "date",
                       sortable: true,
                       resizable: true,
                       type: "date",
                       defaultWidth: 100,
                       draggable: true,
                    },
                    {
                       key: "fullName",
                       header: "Name",
                       field: "fullName",
                       sortable: true,
                       resizable: true,
                       defaultWidth: 200,
                       draggable: true,
                    },
                    {
                       key: "continent",
                       header: "Continent",
                       field: "continent",
                       sortable: true,
                       resizable: true,
                       defaultWidth: 150,
                       draggable: true,
                    },
                    {
                       key: "browser",
                       header: "Browser",
                       field: "browser",
                       sortable: true,
                       resizable: true,
                       defaultWidth: 150,
                       draggable: true,
                    },
                    {
                       key: "os",
                       header: "OS",
                       field: "os",
                       sortable: true,
                       resizable: true,
                       defaultWidth: 150,
                       draggable: true,
                    },
                    {
                       key: "visits",
                       header: "Visits",
                       field: "visits",
                       sortable: true,
                       align: "right",
                       type: "number",
                       defaultWidth: 100,
                       draggable: true,
                    },
                ];
                `}
                </CodeSnippet>
            </Content>

            To allow dragging grid column around, set `draggable` to `true` on each column.

            There are two parts required to implement column reordering. The first part is dynamic column generation. The `onGetColumns` callback method
            is invoked whenever `columnParams` change (in this example it's bound to `$page.columnOrder`) and it should return
            the list of columns to be displayed. The list should be in the same format as when assigned to the `columns` property.
            It's important to set a unique `key` for each column so that grid can correctly associate column meta data (such as column width)
            and restore it on each configuration change.

            The other part is implementing column drag & drop using `onColumnDropTest` and `onColumnDrop` callbacks.
            The `onColumnDropTest` checks if the dragged object contains information required to make a successful column drop.
            The logic for changing columns is implemented in `onColumnDrop`. In this example, `columnOrder`
            and `unusedColumns` are modified and after that the grid automatically reflects the updated configuration.
        </CodeSplit>
    </Md>
</cx>;
