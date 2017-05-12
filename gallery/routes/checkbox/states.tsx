import {cx, Section, FlexRow, Checkbox} from 'cx/widgets';
import {bind, LabelsLeftLayout, LabelsTopLayout} from 'cx/ui';

export default <cx>
    <FlexRow wrap spacing="large">
        <Section mod="well" title="Standard" hLevel={4} layout={LabelsLeftLayout}>
            <Checkbox label="Standard" value={bind("checked")} text="Checkbox"/>
            <Checkbox label="Disabled" value={bind("checked")} disabled text="Checkbox"/>
            <Checkbox label="Readonly" value={bind("checked")} readOnly text="Checkbox"/>
            <Checkbox label="Styled" value={bind("checked")} inputStyle="color:red" text="Checkbox"/>
            <Checkbox label="View Mode" value={bind("checked")} mode="view" text="Checkbox" emptyText="N/A"/>
            <Checkbox label="Three State" value={bind("threeState")} text="Checkbox" indeterminate/>
        </Section>
        <Section mod="well" title="Native" hLevel={4} layout={LabelsLeftLayout}>
            <Checkbox label="Standard" value={bind("checked")} text="Checkbox" native/>
            <Checkbox label="Disabled" value={bind("checked")} disabled text="Checkbox" native/>
            <Checkbox label="Readonly" value={bind("checked")} readOnly text="Checkbox" native/>
            <Checkbox label="View Mode" value={bind("checked")} mode="view" text="Checkbox" emptyText="N/A" native/>
        </Section>
        <Section mod="well" title="Label On Top" hLevel={4} layout={{ type: LabelsTopLayout, vertical: true }}>
            <Checkbox label="Label" value={bind("checked")} text="Text" />
            <Checkbox label="Label Only" value={bind("checked")} />
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../hmr.js';
declare let module: any;
hmr(module);