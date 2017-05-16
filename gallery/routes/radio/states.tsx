import {cx, Section, FlexRow, Radio} from 'cx/widgets';
import {bind, LabelsLeftLayout, LabelsTopLayout, Controller} from 'cx/ui';

const PageController = class extends Controller {
    init() {
        this.store.init('radio', "1")
    }
}

export default <cx>
    <FlexRow wrap spacing="large" target="tablet">
        <Section mod="well" title="Standard" hLevel={4} layout={LabelsLeftLayout} controller={PageController}>
            <Radio label="Standard" value={bind("radio")} option="0" text="Radio"/>
            <Radio label="Disabled" value={bind("radio")} option="0" disabled text="Radio"/>
            <Radio label="Readonly" value={bind("radio")} option="0" readOnly text="Radio"/>
            <Radio label="Styled" value={bind("radio")} option="0" inputStyle="color:red" text="Radio"/>
            <Radio label="View Mode" value={bind("radio")} option="0" mode="view" text="Checked" emptyText="N/A"/>
        </Section>
        <Section mod="well" title="Native" hLevel={4} layout={LabelsLeftLayout}>
            <Radio label="Standard" value={bind("radio")} option="1" text="Radio" native/>
            <Radio label="Disabled" value={bind("radio")} option="1" disabled text="Radio" native/>
            <Radio label="Readonly" value={bind("radio")} option="1" readOnly text="Radio" native/>
            <Radio label="View Mode" value={bind("radio")} option="1" mode="view" text="Radio" emptyText="N/A" native/>
        </Section>
        <Section mod="well" title="Label On Top" hLevel={4} layout={{ type: LabelsTopLayout, vertical: true }}>
            <Radio label="Label" value={bind("radio")} option="2" text="Text"  />
            <Radio label="Label Only" value={bind("radio")} option="2" />
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../hmr.js';
declare let module: any;
hmr(module);