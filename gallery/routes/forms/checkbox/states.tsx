import {cx, Section, FlexRow, Checkbox, HelpText} from 'cx/widgets';
import {bind, LabelsLeftLayout, LabelsTopLayout} from 'cx/ui';

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/forms/checkbox/states.tsx" target="_blank" putInto="github">Source Code</a>
    <FlexRow wrap spacing="large" target="tablet">
        <Section 
            mod="card"
            title="Material Labels"
            visible={{expr: "{$root.$route.theme} == 'material'"}}
            hLevel={4}
        >
            <div style={{ marginTop: "-30px" }}>
                <Checkbox label="Standard" value={bind("standard")} text="Checkbox" labelPlacement="material" />
                <br/>
                <Checkbox label="Disabled" value={bind("standard")} disabled text="Checkbox" labelPlacement="material" />
                <br/>
                <Checkbox label="Readonly" value={bind("standard")} readOnly text="Checkbox" labelPlacement="material" />
                <br/>
                <Checkbox label="Label only" value={bind("label")} labelPlacement="material" />
                <br/>
                <Checkbox label="View Mode" value={bind("standard")} mode="view" text="Checked" emptyText="N/A" labelPlacement="material" />
            </div>
        </Section>
        <Section mod="well" title="Standard" hLevel={4} layout={LabelsLeftLayout}>
            <Checkbox label="Standard" value={bind("standard")} text="Checkbox"/>
            <Checkbox label="Disabled" value={bind("standard")} disabled text="Checkbox"/>
            <Checkbox label="Readonly" value={bind("standard")} readOnly text="Checkbox"/>
            <Checkbox label="Label only" value={bind("label")} />
            <Checkbox label="View Mode" value={bind("standard")} mode="view" text="Checked" emptyText="N/A"/>
        </Section>
        <Section mod="well" title="Native" hLevel={4} layout={LabelsLeftLayout}>
            <Checkbox label="Standard" value={bind("standard")} text="Checkbox" native/>
            <Checkbox label="Disabled" value={bind("standard")} disabled text="Checkbox" native/>
            <Checkbox label="Readonly" value={bind("standard")} readOnly text="Checkbox" native/>
            <Checkbox label="Label only" value={bind("label")} />
            <Checkbox label="View Mode" value={bind("standard")} mode="view" text="Checked" emptyText="N/A" native/>
        </Section>
        <Section mod="well" title="Label On Top" hLevel={4} layout={{ type: LabelsTopLayout, vertical: true }}>
            <Checkbox label="Standard" value={bind("standard")} text="Checkbox" />
            <Checkbox label="Disabled" value={bind("standard")} disabled text="Checkbox" />
            <Checkbox label="Readonly" value={bind("standard")} readOnly text="Checkbox" />
            <Checkbox label="Label only" value={bind("label")} />
            <Checkbox label="View Mode" value={bind("standard")} mode="view" text="Checked" emptyText="N/A" />
        </Section>
        <Section mod="well" title="Helpers" hLevel={4} layout={LabelsLeftLayout}>
            <Checkbox label="Tooltip" value={bind("tooltip")} text="Checked" tooltip="This is a tooltip." />
            <Checkbox label="Help" value={bind("inline")} text="Checked" help="Inline" />
            <Checkbox 
                label="Help" 
                value={bind("block")} 
                text="Checked" 
                help={
                    <cx>
                        <HelpText mod="block">Block</HelpText>
                    </cx>
                }/>
        </Section>
        <Section mod="well" title="Misc" hLevel={4} layout={LabelsLeftLayout} >
            <Checkbox label="Styled" value={bind("checked", true)} inputStyle="color:red" text="Checkbox" />
            <Checkbox label="Three State" value={bind("threeState")} text="Checkbox" indeterminate />
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);