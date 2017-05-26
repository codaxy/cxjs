import {cx, Section, FlexRow, Switch} from 'cx/widgets';
import {bind, expr, LabelsLeftLayout, LabelsTopLayout} from 'cx/ui';

export default <cx>
    <FlexRow wrap spacing="large" target="tablet">
        <Section mod="well" title="Standard" hLevel={4} layout={LabelsLeftLayout}>
            <Switch label="Standard" value={bind("checked")} text="Switch" />
            <Switch label="Disabled" value={bind("checked")} disabled text="Switch" />
            <Switch label="Readonly" value={bind("checked")} readOnly text="Switch" />
            <Switch label="Styled" value={bind("checked")} 
                handleStyle="background:white"
                rangeStyle="background:lightsteelblue" 
            >
                <span style={{ color: "red" }}>Switch</span>
            </Switch>
            <Switch label="View Mode" value={bind("checked")} mode="view" text="On" emptyText="N/A" />
            <Switch label="Label only" on={bind("checked")} />
        </Section>
        <Section mod="well" title="Label On Top" hLevel={4} layout={{ type: LabelsTopLayout, vertical: true }}>
            <Switch label="Default" on={bind("checked")} text={expr("{checked} ? 'ON' : 'OFF'")} />
            <Switch label="Disabled" value={bind("checked")} disabled text="Switch" />
            <Switch label="Readonly" off={bind("checked")} readOnly text="Switch" />
            <Switch
                label="Styled"
                off={bind("checked")}
                handleStyle="background:white"
                rangeStyle="background:lightsteelblue"
            >
                <span style={{ color: "red" }}>Switch</span>
            </Switch>
            <Switch label="Label only" off={bind("checked")} />
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../hmr.js';
declare let module: any;
hmr(module);