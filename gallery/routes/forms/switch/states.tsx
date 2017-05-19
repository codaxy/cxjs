import {cx, Section, FlexRow, Switch} from 'cx/widgets';
import {bind, expr, LabelsLeftLayout, LabelsTopLayout} from 'cx/ui';

export default <cx>
    <FlexRow wrap spacing="large" target="tablet">
        <Section 
            mod="card"
            title="Material Labels"
            visible={{expr: "{$root.$route.theme} == 'material'"}}
            hLevel={4}
        >
            <div style={{ marginTop: "-30px" }} >
                <Switch label="Standard" value={bind("checked")} text="Switch" labelPlacement="material" />
                <br/>
                <Switch label="Disabled" value={bind("checked")} disabled text="Switch" labelPlacement="material" />
                <br/>
                <Switch label="Readonly" value={bind("checked")} readOnly text="Switch" labelPlacement="material" />
                <br/>
                <Switch label="View Mode" value={bind("checked")} mode="view" text="On" emptyText="N/A" labelPlacement="material" />
                <br/>
                <Switch label="Label only" on={bind("checked")} labelPlacement="material" />
            </div>
        </Section>
        <Section mod="well" title="Standard" hLevel={4} layout={LabelsLeftLayout}>
            <Switch label="Standard" value={bind("checked")} text="Switch" />
            <Switch label="Disabled" value={bind("checked")} disabled text="Switch" />
            <Switch label="Readonly" value={bind("checked")} readOnly text="Switch" />
            <Switch label="View Mode" value={bind("checked")} mode="view" text="On" emptyText="N/A" />
            <Switch label="Label only" on={bind("checked")} />
        </Section>
        <Section mod="well" title="Label On Top" hLevel={4} layout={{ type: LabelsTopLayout, vertical: true }}>
            <Switch label="Standard" value={bind("checked")} text="Switch" />
            <Switch label="Disabled" value={bind("checked")} disabled text="Switch" />
            <Switch label="View Mode" value={bind("checked")} mode="view" text="On" emptyText="N/A" />
            <Switch label="Label only" on={bind("checked")} />
        </Section>
        <Section mod="well" title="Misc" hLevel={4} layout={{ type: LabelsTopLayout, vertical: true }}>
            <Switch label="Text expression" on={bind("checked")} text={expr("{checked} ? 'ON' : 'OFF'")} />
            <Switch label="Styled" value={bind("checked")} 
                handleStyle="background:white"
                rangeStyle="background:lightsteelblue" 
            >
                <span style={{ color: "red" }}>Switch</span>
            </Switch>
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
declare let module: any;
hmr(module);