import {Checkbox, Grid, Section, cx} from "cx/widgets";
import {Controller, PropertySelection} from "cx/ui";
import casual from '../../util/casual';

class PageController extends Controller {
    init() {
        super.init();

        this.store.set(
            "$page.records",
            Array
                .from({length: 20})
                .map(() => ({
                    fullName: casual.full_name,
                    phone: casual.phone,
                    city: casual.city,
                    selected: false
                }))
        );

        this.addTrigger("select-all-click", ["$page.selectAll"], value => {
            if (value != null)
                this.store.set(
                    "$page.records",
                    this.store
                        .get("$page.records")
                        .map(r => Object.assign({}, r, {selected: value}))
                );
        });

        this.addTrigger(
            "item-click",
            ["$page.records"],
            records => {
                if (records.every(a => a.selected))
                    this.store.set("$page.selectAll", true);
                else if (records.every(a => !a.selected))
                    this.store.set("$page.selectAll", false);
                else
                    this.store.set("$page.selectAll", null);
            },
            true
        );
    }
}

export default <cx>
    <Section
        mod="well"
        style="height: 100%"
        bodyStyle="display:flex; flex-direction:column"
        controller={PageController}
    >
        <Grid
            records={{bind: "$page.records"}}
            style={{width: "100%"}}
            columns={[
                {
                    header: {
                        items: (
                            <cx>
                                <Checkbox
                                    value={{bind: "$page.selectAll"}}
                                    indeterminate
                                    unfocusable
                                />
                            </cx>
                        )
                    },
                    field: "selected",
                    style: "width: 1px",
                    items: (
                        <cx><Checkbox value={{bind: "$record.selected"}} unfocusable/></cx>
                    )
                },
                {header: "Name", field: "fullName", sortable: true},
                {header: "Phone", field: "phone"},
                {header: "City", field: "city", sortable: true}
            ]}
            selection={
                {type: PropertySelection, bind: "$page.selection", multiple: true}
            }
            sorters={{bind: "$page.sorters"}}
        />
    </Section>
</cx>;

