import { KeySelection } from "cx/ui";
import { Grid, PureContainer } from "cx/widgets";
import { casual } from "../casual.js";

export default () => (
    <cx>
        <PureContainer
            controller={{
                init() {
                    this.store.init('$page.records', Array.from({ length: 20 }).map((v, i) => ({
                        id: i + 1,
                        fullName: casual.full_name,
                        continent: casual.continent,
                        browser: casual.browser,
                        os: casual.operating_system,
                        visits: casual.integer(1, 100)
                    })));
                },
            }}
        >
            <div style="margin:40px">
                <i>When default sort field is set, clearable sort is not behaving as expected and only offers two state: ASC and DESC. This is related to the issue #1246.</i>
                <Grid records-bind='$page.records'
                    style={{ height: '600px', width: '1000px', marginTop: '10px' }}
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
        </PureContainer>
    </cx>
);
