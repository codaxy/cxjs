import {cx, Section, FlexRow, Radio} from 'cx/widgets';
import {bind, LabelsLeftLayout, LabelsTopLayout} from 'cx/ui';

export default <cx>
    <FlexRow wrap spacing="large" target="tablet">
        <Section mod="well" title="Standard" hLevel={4} layout={LabelsLeftLayout}>
            <Radio label="Standard" value={bind("checked")} text="Radio"/>
            <Radio label="Disabled" value={bind("checked")} disabled text="Radio"/>
            <Radio label="Readonly" value={bind("checked")} readOnly text="Radio"/>
            <Radio label="Styled" value={bind("checked")} inputStyle="color:red" text="Radio"/>
            <Radio label="View Mode" value={bind("checked")} mode="view" emptyText="N/A"/>
            <Radio label="Three State" value={bind("threeState")} text="Radio" />
        </Section>
        <Section mod="well" title="Native" hLevel={4} layout={LabelsLeftLayout}>
            <Radio label="Standard" value={bind("checked")} text="Radio" native/>
            <Radio label="Disabled" value={bind("checked")} disabled text="Radio" native/>
            <Radio label="Readonly" value={bind("checked")} readOnly text="Radio" native/>
            <Radio label="View Mode" value={bind("checked")} mode="view" text="Radio" emptyText="N/A" native/>
        </Section>
        <Section mod="well" title="Label On Top" hLevel={4} layout={{ type: LabelsTopLayout, vertical: true }}>
            <Radio label="Label" value={bind("checked")} text="Text" />
            <Radio label="Label Only" value={bind("checked")} />
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../hmr.js';
declare let module: any;
hmr(module);