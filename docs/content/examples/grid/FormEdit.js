import { Button, HtmlElement, TextField, Checkbox, Grid, DataProxy, Rescope, Tab } from 'cx/widgets';
import { Content, Controller, LabelsLeftLayout, KeySelection, computable } from 'cx/ui';
import { Md } from '../../../components/Md';
import { CodeSplit } from '../../../components/CodeSplit';
import { CodeSnippet } from '../../../components/CodeSnippet';

import { casual } from '../data/casual';

function uid(len) {
    len = len || 7;
    return Math.random().toString(35).substr(2, len);
}

class PageController extends Controller {
    onInit() {
        this.store.init('$page.records', Array.from({ length: 5 }).map((v, i) => ({
            id: uid(),
            fullName: casual.full_name,
            phone: casual.phone,
            city: casual.city,
            notified: casual.coin_flip
        })));

        this.addTrigger('$page.form', ['$page.id', '$page.records'], (id, records) => {
            this.store.set('$page.form', records.find(r => r.id == id));
            this.store.set('$page.add', false);
        });
    }

    newRecord() {
        let newRecord = {
            id: uid(),
            fullName: 'New Entry'
        }
        this.store.update('$page.records', records => [...records, newRecord])
        this.store.set('$page.id', newRecord.id);
    }

    saveRecord() {
        let record = this.store.get('$page.form');
        this.store.update(
            '$page.records',
            records => records.map(r => r.id == record.id ? record : r)
        );
    }

    removeRecord(id) {
        this.store.delete('$page.id');
        this.store.update(
            '$page.records',
            records => records.filter(r => r.id != id)
        );
    }
}

export const FormEdit = <cx>
    <Md controller={PageController}>
        <CodeSplit>
            # Grid with Form Editing

            The following example shows how to connect a form with a grid control.

            <Grid records-bind='$page.records'
                style={{ width: "100%" }}
                selection={{ type: KeySelection, bind: '$page.id', keyField: 'id' }}
                columns={[
                    { header: 'Name', field: 'fullName', sortable: true },
                    { header: 'Phone', field: 'phone' },
                    { header: 'City', field: 'city', sortable: true },
                    {
                        header: 'Notified',
                        field: 'notified',
                        sortable: true,
                        value: { expr: '{$record.notified} ? "Yes" : "No"' }
                    },
                    {
                        header: 'Actions', items: <cx>
                            <Button data-id-bind='$record.id' onClick={(e, { controller, data }) => {
                                controller.removeRecord(data.data.id);
                            }}>Remove
                            </Button>
                        </cx>
                    }
                ]}
            />

            <Button type="button" onClick={(e, { controller }) => {
                controller.newRecord()
            }}>Add
            </Button>

            <hr style={{ margin: '30px' }} />

            <div class='flex-row'>
                <div visible-expr='{$page.form}' style="flex: 1;">
                    <h2 text="Normal form" />
                    <h4 text-bind="$page.form.fullName" />
                    <div layout={LabelsLeftLayout}>
                        <TextField label="Name" value-bind="$page.form.fullName" />
                        <TextField label="Phone" value-bind="$page.form.phone" />
                        <TextField label="City" value-bind="$page.form.city" />
                        <Checkbox label="Notified" value-bind="$page.form.notified" />
                        <Button onClick={(e, { controller }) => {
                            controller.saveRecord()
                        }}>Save
                        </Button>
                    </div>
                </div>
                <div style="flex: 1;">
                    <Rescope bind="$page">
                        <DataProxy
                            value={{
                                expr: computable("id", "records", (id, records) => {
                                    if (!id) return;
                                    return records.find(rec => rec.id == id);
                                }),
                                set: (record, { store }) => {
                                    store.update(
                                        "records",
                                        records => records.map(rec => rec.id === record.id ? { ...record } : rec)
                                    );
                                }
                            }}
                            alias="$liveForm"
                        >
                            <div visible-expr='{$liveForm}'>
                                <h2 text="Live form" />
                                <h4 text-bind="$liveForm.fullName" />
                                <div layout={LabelsLeftLayout}>
                                    <TextField label="Name" value-bind="$liveForm.fullName" />
                                    <TextField label="Phone" value-bind="$liveForm.phone" />
                                    <TextField label="City" value-bind="$liveForm.city" />
                                    <Checkbox label="Notified" value-bind="$liveForm.notified" />
                                </div>
                            </div>
                        </DataProxy>
                    </Rescope>
                </div>
            </div>


            <Content name="code">
                <div>
                    <Tab value-bind="$page.code.tab" tab="controller" mod="code" default>
                        <code>Controller</code>
                    </Tab>

                    <Tab value-bind="$page.code.tab" tab="grid" mod="code">
                        <code>Grid</code>
                    </Tab>

                    <Tab value-bind="$page.code.tab" tab="form" mod="code">
                        <code>Form</code>
                    </Tab>
                </div>
                <CodeSnippet fiddle="xPjUX9Ad" visible-expr="{$page.code.tab} == 'controller'">{`
                class PageController extends Controller {
                    onInit() {
                        this.store.init('$page.records', Array.from({length: 5}).map((v, i)=>({
                            id: uid(),
                            fullName: casual.full_name,
                            phone: casual.phone,
                            city: casual.city,
                            notified: casual.coin_flip
                        })));

                        this.addTrigger('$page.form', ['$page.id', '$page.records'], (id, records) => {
                            this.store.set('$page.form', records.find(r => r.id == id));
                            this.store.set('$page.add', false);
                        });
                    }

                    newRecord() {
                        let newRecord = {
                            id: uid(),
                            fullName: 'New Entry'
                        }
                        this.store.update('$page.records', records => [...records, newRecord])
                        this.store.set('$page.id', newRecord.id);
                    }

                    saveRecord() {
                        let record = this.store.get('$page.form');
                        this.store.update(
                            '$page.records',
                            records => records.map(r => r.id == record.id ? record : r)
                        );
                    }

                    removeRecord(id) {
                        this.store.update(
                            '$page.records',
                            records => records.filter(r => r.id != id)
                        );
                    }
                }
                `}
                </CodeSnippet>
                <CodeSnippet fiddle="xPjUX9Ad" visible-expr="{$page.code.tab} == 'grid'">{`
                <Grid records-bind='$page.records'
                    style={{width: "100%"}}
                    selection={{type: KeySelection, bind: '$page.id', keyField: 'id'}}
                    columns={[
                        {header: 'Name', field: 'fullName', sortable: true},
                        {header: 'Phone', field: 'phone'},
                        {header: 'City', field: 'city', sortable: true},
                        {
                            header: 'Notified',
                            field: 'notified',
                            sortable: true,
                            value: {expr: '{$record.notified} ? "Yes" : "No"'}
                        },
                        {
                            header: 'Actions', items: <cx>
                            <Button data-id-bind='$record.id' onClick={(e, {controller, data}) => {
                                controller.removeRecord(data.data.id);
                            }}>Remove
                            </Button>
                        </cx>
                        }
                    ]}
                />

                <Button type="button" onClick={(e, {controller}) => {
                    controller.newRecord()
                }}>
                    Add
                </Button>

                `}</CodeSnippet>
                <CodeSnippet fiddle="xPjUX9Ad" visible-expr="{$page.code.tab} == 'form'">{`
                <div class='flex-row'>
                    <div visible-expr='{$page.form}' style="flex: 1;">
                        <h2 text="Normal form"/>
                        <h4 text-bind="$page.form.fullName"/>
                        <div layout={LabelsLeftLayout}>
                            <TextField label="Name" value-bind="$page.form.fullName"/>
                            <TextField label="Phone" value-bind="$page.form.phone"/>
                            <TextField label="City" value-bind="$page.form.city"/>
                            <Checkbox label="Notified" value-bind="$page.form.notified"/>
                            <Button onClick={(e, {controller}) => {
                                controller.saveRecord()
                            }}>Save
                            </Button>
                        </div>
                    </div>
                    <div style="flex: 1;">
                        <Rescope bind="$page">
                            <DataProxy
                                value={{
                                    expr: computable("id", "records", (id, records) => {
                                        if (!id) return;
                                        return records.find(rec => rec.id == id);
                                    }),
                                    set: (record, {store}) => {
                                        store.update(
                                            "records",
                                            records => records.map(rec => rec.id === record.id ? { ...record } : rec)
                                        );
                                    }
                                }}
                                alias="$liveForm"
                            >
                                <div visible-expr='{$liveForm}'>
                                    <h2 text="Live form"/>
                                    <h4 text-bind="$liveForm.fullName"/>
                                    <div layout={LabelsLeftLayout}>
                                        <TextField label="Name" value-bind="$liveForm.fullName"/>
                                        <TextField label="Phone" value-bind="$liveForm.phone"/>
                                        <TextField label="City" value-bind="$liveForm.city"/>
                                        <Checkbox label="Notified" value-bind="$liveForm.notified"/>
                                    </div>
                                </div>
                            </DataProxy>
                        </Rescope>
                    </div>
                </div>

            `}
                </CodeSnippet>
            </Content>
        </CodeSplit>
    </Md>
</cx>
