import {Checkbox, Grid, Section, cx, FlexRow} from "cx/widgets";
import {Controller, PropertySelection} from "cx/ui";
import casual from '../../../util/casual';

class PageController extends Controller {

}

export default <cx>
    <FlexRow spacing wrap>
    <Section
        mod="well"
        style="height: 100%"
        bodyStyle="display:flex; flex-direction:column"
        controller={PageController}
        title="Empty Text"
        hLevel={4}
    >
        <Grid
            records={[]}
            scrollable
            columns={[
                {header: "Name", field: "fullName", sortable: true},
                {header: "Phone", field: "phone"},
                {header: "City", field: "city", sortable: true}
            ]}
            emptyText="No records found matching the given criteria."
        />
    </Section>
    </FlexRow>
</cx>;

