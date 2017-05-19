import {cx, Section, FlexRow, Checkbox} from 'cx/widgets';
import {bind, LabelsLeftLayout, LabelsTopLayout} from 'cx/ui';

export default <cx>
    <FlexRow wrap spacing="large" target="tablet">
        <Section 
            mod="card"
            title="Material Labels"
            visible={{expr: "{$root.$route.theme} == 'material'"}}
            hLevel={4}
        >
            <div style={{ marginTop: "-30px" }}>
                <Checkbox label="Standard" value={bind("checked")} text="Checkbox" labelPlacement="material" />
                <br/>
                <Checkbox label="Disabled" value={bind("checked")} disabled text="Checkbox" labelPlacement="material" />
                <br/>
                <Checkbox label="Readonly" value={bind("checked")} readOnly text="Checkbox" labelPlacement="material" />
                <br/>
                <Checkbox label="Label only" value={bind("checked")} labelPlacement="material" />
                <br/>
                <Checkbox label="View Mode" value={bind("checked")} mode="view" text="Checked" emptyText="N/A" labelPlacement="material" />
            </div>
        </Section>
        <Section mod="well" title="Standard" hLevel={4} layout={LabelsLeftLayout}>
            <Checkbox label="Standard" value={bind("checked")} text="Checkbox"/>
            <Checkbox label="Disabled" value={bind("checked")} disabled text="Checkbox"/>
            <Checkbox label="Readonly" value={bind("checked")} readOnly text="Checkbox"/>
            <Checkbox label="Label only" value={bind("checked")} />
            <Checkbox label="View Mode" value={bind("checked")} mode="view" text="Checked" emptyText="N/A"/>
        </Section>
        <Section mod="well" title="Native" hLevel={4} layout={LabelsLeftLayout}>
            <Checkbox label="Standard" value={bind("checked")} text="Checkbox" native/>
            <Checkbox label="Disabled" value={bind("checked")} disabled text="Checkbox" native/>
            <Checkbox label="Readonly" value={bind("checked")} readOnly text="Checkbox" native/>
            <Checkbox label="Label only" value={bind("checked")} />
            <Checkbox label="View Mode" value={bind("checked")} mode="view" text="Checked" emptyText="N/A" native/>
        </Section>
        <Section mod="well" title="Label On Top" hLevel={4} layout={{ type: LabelsTopLayout, vertical: true }}>
            <Checkbox label="Label" value={bind("checked")} text="Text" />
            <Checkbox label="Label Only" value={bind("checked")} />
        </Section>
        <Section mod="well" title="Misc" hLevel={4} layout={LabelsLeftLayout} >
            <Checkbox label="Styled" value={bind("checked")} inputStyle="color:red" text="Checkbox" />
            <Checkbox label="Three State" value={bind("threeState")} text="Checkbox" indeterminate />
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
declare let module: any;
hmr(module);