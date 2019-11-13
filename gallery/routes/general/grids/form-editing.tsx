import {
    Grid,
    Button,
    Section,
    cx,
    Checkbox,
    TextField,
    ValidationGroup,
    FlexCol,
    FlexRow
} from "cx/widgets";
import {Controller, bind, expr, KeySelection, LabelsLeftLayout} from "cx/ui";
import casual from '../../../util/casual';

class PageController extends Controller {
    init() {
        super.init();

        this.store.set(
            "$page.records",
            Array
                .from({length: 5})
                .map((v, i) => ({
                    id: i + 1,
                    fullName: casual.full_name,
                    phone: casual.phone,
                    city: casual.city,
                    notified: casual.coin_flip
                }))
        );

        this.addTrigger("$page.form", ["$page.id", "$page.records"], (id,
                                                                      records) => {
            this.store.set("$page.form", records.find(a => a.id == id));
            this.store.set("$page.add", false);
        });
    }

    newRecord() {
        let records = this.store.get("$page.records");
        this.store.set("$page.add", true);
        this.store.set("$page.form", {fullName: "New Entry"});
    }

    saveRecord() {
        let page = this.store.get("$page"), newRecords;
        if (page.add) {
            let id = page.records.reduce((acc, rec) => Math.max(acc, rec.id), 0) + 1;
            newRecords = [...page.records, Object.assign({id: id}, page.form)];
            this.store.set("$page.id", id);
        } else newRecords = page.records.map(r => r.id == page.id ? page.form : r);

        this.store.set("$page.records", newRecords);
    }

    removeRecord(id) {
        let newRecords = this.store.get("$page.records").filter(r => r.id != id);
        this.store.set("$page.records", newRecords);
    }
}

export default (
    <cx>
        <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/general/grids/form-editing.tsx" target="_blank"
            putInto="github">Source Code</a>
        <FlexRow target="tablet" spacing="large" controller={PageController}>
            <Section mod="card">
                <Grid
                    records={bind("$page.records")}
                    style={{
                        "width": "100%",
                    }}
                    selection={{type: KeySelection, bind: "$page.id", keyField: "id"}}
                    columns={[
                        {header: "Name", field: "fullName", sortable: true, style: "white-space: nowrap"},
                        {header: "Phone", field: "phone", style: "white-space: nowrap"},
                        {header: "City", field: "city", sortable: true},
                        {
                            header: "Notified",
                            field: "notified",
                            align: 'center',
                            sortable: true,
                            value: {expr: '{$record.notified} ? "Yes" : "No"'}
                        },
                        {
                            header: "Actions",
                            items: (
                                <cx>
                                    <Button
                                        type="button"
                                        mod="flat-primary"
                                        data-id={bind("$record.id")}
                                        onClick={(e, {controller, data}) => {
                                            controller.removeRecord(data.data.id);
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </cx>
                            )
                        }
                    ]}
                />
                <br/>
                <Button
                    type="button"
                    onClick={(e, {controller}) => {
                        controller.newRecord();
                    }}
                    style={{}}
                >
                    Add
                </Button>
            </Section>

            <Section mod="card" title={bind("$page.form.fullName")} hLevel={4} visible={expr("{$page.form}")}>
                <ValidationGroup layout={LabelsLeftLayout}>
                    <TextField label="Name" value={bind("$page.form.fullName")}/>
                    <TextField label="Phone" value={bind("$page.form.phone")}/>
                    <TextField label="City" value={bind("$page.form.city")}/>
                    <Checkbox label="Notified" value={bind("$page.form.notified")}/>
                    <Button onClick="saveRecord">
                        Save
                    </Button>
                </ValidationGroup>
            </Section>
        </FlexRow>
    </cx>
);

import {hmr} from '../../hmr.js';
hmr(module);