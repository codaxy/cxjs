import { KeySelection } from "cx/ui";
import { Grid, PureContainer, Repeater } from "cx/widgets";
import { casual } from "../casual.js";

const groupsData = [
    {
        name: "Group Alpha",
        items: [
            { id: 1, name: "Item Alpha-1", value: 15 },
            { id: 3, name: "Item Alpha-3", value: 35 },
            { id: 2, name: "Item Alpha-2", value: 25 }
        ]
    },
    {
        name: "Group Beta",
        items: [
            { id: 4, name: "Item Beta-1", value: 45 },
            { id: 5, name: "Item Beta-2", value: 55 }
        ]
    },
    {
        name: "Group Gamma",
        items: [
            { id: 6, name: "Item Gamma-1", value: 65 },
            { id: 7, name: "Item Gamma-2", value: 75 },
            { id: 9, name: "Item Gamma-4", value: 95 },
            { id: 10, name: "Item Gamma-5", value: 95 },
            { id: 8, name: "Item Gamma-3", value: 85 },
            { id: 11, name: "Item Gamma-6", value: 95 }
        ]
    }
];
export default () => (
    <cx>
        <PureContainer
            controller={{
                init() {
                    this.store.init('$page.records', Array.from({ length: 6 }).map((v, i) => ({
                        id: i + 1,
                        fullName: casual.full_name,
                        continent: casual.continent,
                        browser: casual.browser,
                        os: casual.operating_system,
                        visits: casual.integer(1, 100)
                    })));
                    this.store.init('$page.groups', groupsData);
                },
            }}
        >
            <i>When default sort field is set, clearable sort is not behaving as expected and only offers two state: ASC and DESC. This is related to the issue #1246.</i>
            <div style="margin:5x; height:240px;">
                <h3>Clearable sort and default sort field.</h3>
                <Grid records-bind='$page.records'
                    style={{ height: '200px', width: '1000px', marginTop: '10px' }}
                    mod="responsive"
                    scrollable
                    clearableSort
                    defaultSortField='fullName'
                    columns={[
                        { header: 'Name', field: 'fullName', sortable: true, resizable: true },
                        { header: 'Continent', field: 'continent', sortable: true, resizable: true },
                        { header: 'Browser', field: 'browser', sortable: true, resizable: true },
                        { header: 'OS', field: 'os', sortable: true, resizable: true },
                        { header: 'Visits', field: 'visits', sortable: true, align: 'right', resizable: true, primarySortDirection: 'DESC' }
                    ]}
                    selection={{ type: KeySelection, bind: '$page.selection', multiple: true }}
                />
            </div>

            <div style="margin:5px; height:240px;">
                <h3>No default sort field.</h3>
                <Grid records-bind='$page.records'
                    style={{ height: '200px', width: '1000px', marginTop: '10px' }}
                    mod="responsive"
                    scrollable
                    clearableSort
                    columns={[
                        { header: 'Name', field: 'fullName', sortable: true, resizable: true },
                        { header: 'Continent', field: 'continent', sortable: true, resizable: true },
                        { header: 'Browser', field: 'browser', sortable: true, resizable: true },
                        { header: 'OS', field: 'os', sortable: true, resizable: true },
                        { header: 'Visits', field: 'visits', sortable: true, align: 'right', resizable: true, primarySortDirection: 'DESC' }
                    ]}
                    selection={{ type: KeySelection, bind: '$page.selection', multiple: true }}
                />
            </div>

            <div style="margin:5px; height:240px;">
                <h3>No clerable sort.</h3>
                <Grid records-bind='$page.records'
                    style={{ height: '200px', width: '1000px', marginTop: '10px' }}
                    mod="responsive"
                    scrollable
                    defaultSortField='fullName'
                    columns={[
                        { header: 'Name', field: 'fullName', sortable: true, resizable: true },
                        { header: 'Continent', field: 'continent', sortable: true, resizable: true },
                        { header: 'Browser', field: 'browser', sortable: true, resizable: true },
                        { header: 'OS', field: 'os', sortable: true, resizable: true },
                        { header: 'Visits', field: 'visits', sortable: true, align: 'right', resizable: true, primarySortDirection: 'DESC' }
                    ]}
                    selection={{ type: KeySelection, bind: '$page.selection', multiple: true }}
                />
            </div>
            <h2>Within repeater</h2>
            <Repeater style="height:100px"
                records-bind="$page.groups"
                recordAlias="$group" >
                <h3 text-bind="$group.name" />
                <Grid style="width:200px;height:100px"
                    records-bind="$group.items"
                    clearableSort
                    defaultSortField="name"
                    columns={[
                        { header: "Name", field: "name", sortable: true },
                        { header: "Value", field: "value", sortable: true }
                    ]}
                />
            </Repeater>
        </PureContainer>
    </cx>
);
