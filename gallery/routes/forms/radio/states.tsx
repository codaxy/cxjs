import {cx, Section, FlexRow, Radio} from 'cx/widgets';
import {bind, LabelsLeftLayout, LabelsTopLayout, Controller} from 'cx/ui';

const PageController = class extends Controller {
    init() {
        this.store.init('radio', "1")
    }
}

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/forms/radio/states.tsx" target="_blank" putInto="github">Source Code</a>
    <FlexRow wrap spacing="large" target="tablet">
        <Section 
            mod="card"
            title="Material Labels"
            visible={{expr: ("{$root.$route.theme} == 'material' || {$root.$route.theme} == 'material-dark'")}}
            hLevel={4}
        >
            <div style={{ marginTop: "-30px" }}>
                <Radio label="Standard" value={bind("radio")} option="0" text="Radio" labelPlacement="material" />
                <br/>
                <Radio label="Disabled" value={bind("radio")} option="0" disabled text="Radio" labelPlacement="material" />
                <br/>
                <Radio label="Readonly" value={bind("radio")} option="0" readOnly text="Radio" labelPlacement="material" />
                <br/>
                <Radio label="Label only" value={bind("radio")} option="0" labelPlacement="material" />
                <br/>
                <Radio label="View Mode" value={bind("radio")} option="0" mode="view" text="Checked" emptyText="N/A" labelPlacement="material" />
            </div>
        </Section>
        <Section mod="well" title="Standard" hLevel={4} layout={LabelsLeftLayout} controller={PageController}>
            <Radio label="Standard" value={bind("radio")} option="1" text="Radio"/>
            <Radio label="Disabled" value={bind("radio")} option="1" disabled text="Radio"/>
            <Radio label="Readonly" value={bind("radio")} option="1" readOnly text="Radio"/>
            <Radio label="Label only" value={bind("radio")} option="1" />
            <Radio label="View Mode" value={bind("radio")} option="1" mode="view" text="Checked" emptyText="N/A" />
        </Section>
        <Section mod="well" title="Native" hLevel={4} layout={LabelsLeftLayout}>
            <Radio label="Standard" value={bind("radio")} option="2" text="Radio" native/>
            <Radio label="Disabled" value={bind("radio")} option="2" disabled text="Radio" native/>
            <Radio label="Readonly" value={bind("radio")} option="2" readOnly text="Radio" native/>
            <Radio label="Label only" value={bind("radio")} option="2" native />
            <Radio label="View Mode" value={bind("radio")} option="2" mode="view" text="Checked" emptyText="N/A" native/>
        </Section>
        <Section mod="well" title="Label On Top" hLevel={4} layout={{ type: LabelsTopLayout, vertical: true }}>
            <Radio label="Label" value={bind("radio")} option="3" text="Text"  />
            <Radio label="Label Only" value={bind("radio")} option="3" />
        </Section>
        <Section mod="well" title="Misc" hLevel={4} >
            <Radio label="Styled" value={bind("radio")} option="4" inputStyle="color:red" text="Radio"/>
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);