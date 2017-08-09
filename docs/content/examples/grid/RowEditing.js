import {Grid, HtmlElement, Button, TextField, NumberField, Content, Tab} from "cx/widgets";
import {Controller} from "cx/ui";
import {casual} from '../data/casual';
import {Md} from '../../../components/Md';
import {CodeSplit} from '../../../components/CodeSplit';
import {CodeSnippet} from '../../../components/CodeSnippet';

class PageController extends Controller {
    onInit() {
        //init grid data
        if (!this.store.get('$page.records'))
            this.shuffle();
    }

    shuffle() {
        this.store.set(
            "$page.records",
            Array
                .from({length: 10})
                .map((v, i) => ({
                    fullName: casual.full_name,
                    continent: casual.continent,
                    browser: casual.browser,
                    os: casual.operating_system,
                    visits: casual.integer(1, 100)
                }))
        );
    }

    editRow(e, {store}) {
        let record = store.get('$record');
        //keep old values
        store.set('$record.$editing', record);
    }

    saveRow(e, {store}) {
        store.delete('$record.$editing');
    }

    cancelRowEditing(e, {store}) {
        let oldRecord = store.get('$record.$editing');
        if (oldRecord.add)
            store.delete('$record');
        else
            store.set('$record', oldRecord);
    }

    addRow(e) {
        this.store.update('$page.records', records => [...records, {
            $editing: {add: true}
        }])
    }

    deleteRow(e, {store}) {
        store.delete('$record');
    }
}

export const RowEditing = <cx>
    <Md controller={PageController}>
        <CodeSplit>
            # Grid with Row Editing

            Grid supports arbitrary content inside its cells and this can be used to implement row editing.

            <Grid
                records:bind="$page.records"
                lockColumnWidths
                cached
                rowStyle={{
                    background: {expr: "!!{$record.$editing} ? 'lightsteelblue' : null"}
                }}
                columns={[
                    {
                        header: "Name",
                        field: "fullName",
                        sortable: true,
                        items: <cx>
                            <TextField
                                value:bind="$record.fullName"
                                viewMode:expr="!{$record.$editing}"
                                style="width: 100%"
                            />
                        </cx>
                    },
                    {
                        header: "Continent",
                        field: "continent",
                        sortable: true,
                        items: <cx>
                            <TextField
                                value:bind="$record.continent"
                                viewMode:expr="!{$record.$editing}"
                                style="width: 100%"
                            />
                        </cx>
                    },
                    {
                        header: "Browser",
                        field: "browser",
                        sortable: true,
                        items: <cx>
                            <TextField
                                value:bind="$record.browser"
                                viewMode:expr="!{$record.$editing}"
                                style="width: 100%"
                            />
                        </cx>
                    },
                    {
                        header: "OS",
                        field: "os",
                        sortable: true,
                        items: <cx>
                            <TextField
                                value:bind="$record.os"
                                viewMode:expr="!{$record.$editing}"
                                style="width: 100%"
                            />
                        </cx>
                    },
                    {
                        header: "Visits",
                        field: "visits",
                        sortable: true,
                        align: "right",
                        items: <cx>
                            <NumberField
                                value:bind="$record.visits"
                                viewMode:expr="!{$record.$editing}"
                                style="width: 100%"
                                inputStyle="text-align: right"
                            />
                        </cx>
                    }, {
                        header: 'Actions',
                        style: "width: 150px",
                        align:"center",
                        items: <cx>
                            <Button mod="hollow" onClick="editRow" visible:expr="!{$record.$editing}">Edit</Button>
                            <Button mod="hollow" onClick="deleteRow" visible:expr="!{$record.$editing}" confirm="Are you sure?">Delete</Button>
                            <Button mod="primary" onClick="saveRow" visible:expr="!!{$record.$editing}">Save</Button>
                            <Button mod="hollow" onClick="cancelRowEditing" visible:expr="!!{$record.$editing}">Cancel</Button>
                        </cx>
                    }
                ]}
            />
            <p>
                <Button onClick="addRow">Add</Button>
            </p>

            <Content name="code">
                <div>
                    <Tab value={{bind:"$page.code.tab", defaultValue: "grid"}} tab="grid" mod="code" >
                        <code>Grid</code>
                    </Tab>
                    <Tab value:bind="$page.code.tab" tab="controller" mod="code">
                        <code>Controller</code>
                    </Tab>
                </div>

                <CodeSnippet visible:expr="{$page.code.tab}=='controller'" fiddle="1q59A8u3">{`
                class PageController extends Controller {
                    onInit() {
                        //init grid data
                        if (!this.store.get('$page.records'))
                            this.shuffle();
                    }

                    shuffle() {
                        this.store.set(
                            "$page.records",
                            Array
                                .from({length: 10})
                                .map((v, i) => ({
                                    fullName: casual.full_name,
                                    continent: casual.continent,
                                    browser: casual.browser,
                                    os: casual.operating_system,
                                    visits: casual.integer(1, 100)
                                }))
                        );
                    }

                    editRow(e, {store}) {
                        let record = store.get('$record');
                        //keep old values
                        store.set('$record.$editing', record);
                    }

                    saveRow(e, {store}) {
                        store.delete('$record.$editing');
                    }

                    cancelRowEditing(e, {store}) {
                        let oldRecord = store.get('$record.$editing');
                        if (oldRecord.add)
                            store.delete('$record');
                        else
                            store.set('$record', oldRecord);
                    }

                    addRow(e) {
                        this.store.update('$page.records', records => [...records, {
                            $editing: {add: true}
                        }])
                    }

                    deleteRow(e, {store}) {
                        store.delete('$record');
                    }
                }
                `}</CodeSnippet>
                <CodeSnippet visible:expr="{$page.code.tab}=='grid'" fiddle="1q59A8u3">{`
                <Grid
                    records:bind="$page.records"
                    lockColumnWidths
                    cached
                    rowStyle={{
                        background: {expr: "!!{$record.$editing} ? 'lightsteelblue' : null"}
                    }}
                    columns={[{
                            header: "Name",
                            field: "fullName",
                            sortable: true,
                            items: <cx>
                                <TextField
                                    value:bind="$record.fullName"
                                    viewMode:expr="!{$record.$editing}"
                                    style="width: 100%"
                                />
                            </cx>
                        }, {
                            header: "Continent",
                            field: "continent",
                            sortable: true,
                            items: <cx>
                                <TextField
                                    value:bind="$record.continent"
                                    viewMode:expr="!{$record.$editing}"
                                    style="width: 100%"
                                />
                            </cx>
                        }, {
                            header: "Browser",
                            field: "browser",
                            sortable: true,
                            items: <cx>
                                <TextField
                                    value:bind="$record.browser"
                                    viewMode:expr="!{$record.$editing}"
                                    style="width: 100%"
                                />
                            </cx>
                        }, {
                            header: "OS",
                            field: "os",
                            sortable: true,
                            items: <cx>
                                <TextField
                                    value:bind="$record.os"
                                    viewMode:expr="!{$record.$editing}"
                                    style="width: 100%"
                                />
                            </cx>
                        }, {
                            header: "Visits",
                            field: "visits",
                            sortable: true,
                            align: "right",
                            items: <cx>
                                <NumberField
                                    value:bind="$record.visits"
                                    viewMode:expr="!{$record.$editing}"
                                    style="width: 100%"
                                    inputStyle="text-align: right"
                                />
                            </cx>
                        }, {
                            header: 'Actions',
                            style: "width: 150px",
                            align:"center",
                            items: <cx>
                                <Button mod="hollow" onClick="editRow" visible:expr="!{$record.$editing}">Edit</Button>
                                <Button mod="hollow" onClick="deleteRow" visible:expr="!{$record.$editing}" confirm="Are you sure?">Delete</Button>
                                <Button mod="primary" onClick="saveRow" visible:expr="!!{$record.$editing}">Save</Button>
                                <Button mod="hollow" onClick="cancelRowEditing" visible:expr="!!{$record.$editing}">Cancel</Button>
                            </cx>
                        }
                    ]}
                />
                <p>
                    <Button onClick="addRow">Add</Button>
                </p>
            `}
            </CodeSnippet>
            </Content>
        </CodeSplit>

    </Md>
</cx>;
