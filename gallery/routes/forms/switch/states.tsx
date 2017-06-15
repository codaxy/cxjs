import {cx, Section, FlexRow, Switch, HelpText} from 'cx/widgets';
import {bind, expr, LabelsLeftLayout, LabelsTopLayout} from 'cx/ui';

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/forms/switch/states.tsx" target="_blank" putInto="github">Source Code</a>
    <FlexRow wrap spacing="large" target="tablet">
        <Section 
            mod="card"
            title="Material Labels"
            visible={{expr: "{$root.$route.theme} == 'material'"}}
            hLevel={4}
        >
            <div style={{ marginTop: "-30px" }} >
                <Switch label="Standard" value={bind("standard")} text="Switch" labelPlacement="material" />
                <br/>
                <Switch label="Disabled" value={bind("standard")} disabled text="Switch" labelPlacement="material" />
                <br/>
                <Switch label="Readonly" value={bind("standard")} readOnly text="Switch" labelPlacement="material" />
                <br/>
                <Switch label="View Mode" value={bind("standard")} mode="view" text="Switch" emptyText="N/A" labelPlacement="material" />
                <br/>
                <Switch label="Label only" on={bind("label")} labelPlacement="material" />
            </div>
        </Section>
        <Section mod="well" title="Standard" hLevel={4} layout={LabelsLeftLayout}>
            <Switch label="Standard" value={bind("standard")} text="Switch" />
            <Switch label="Disabled" value={bind("standard")} disabled text="Switch" />
            <Switch label="Readonly" value={bind("standard")} readOnly text="Switch" />
            <Switch label="View Mode" value={bind("standard")} mode="view" text="Switch" emptyText="N/A" />
            <Switch label="Label only" on={bind("label")} />
        </Section>
        <Section mod="well" title="Label On Top" hLevel={4} layout={{ type: LabelsTopLayout, vertical: true }}>
            <Switch label="Standard" value={bind("standard")} text="Switch" />
            <Switch label="Disabled" value={bind("standard")} disabled text="Switch" />
            <Switch label="View Mode" value={bind("standard")} mode="view" text="Switch" emptyText="N/A" />
            <Switch label="Label only" on={bind("label")} />
        </Section>
        <Section mod="well" title="Helpers" hLevel={4} layout={LabelsLeftLayout}>
            <Switch label="Tooltip" value={bind("tooltip")} text="Switch" tooltip="This is a tooltip." />
            <Switch label="Help" value={bind("inline")} text="Switch" help="Inline" />
            <Switch label="Help" 
                value={bind("block")} 
                text="Switch" 
                help={<cx>
                    <HelpText mod="block">Block</HelpText>
                </cx>} 
            />
            <Switch label="Label only" on={bind("label")} />
        </Section>
        <Section mod="well" title="Misc" hLevel={4} layout={{ type: LabelsTopLayout, vertical: true }}>
            <Switch label="Text expression" on={bind("expr")} text={expr("{standard} ? 'ON' : 'OFF'")} />
            <Switch label="Styled" value={bind("styled")} 
                handleStyle="background:white"
                rangeStyle="background:lightsteelblue" 
            >
                <span style={{ color: "red" }}>Switch</span>
            </Switch>
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);