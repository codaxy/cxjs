
import {cx, Section, FlexRow, ColorField} from 'cx/widgets';
import {bind, LabelsLeftLayout, LabelsTopLayout} from 'cx/ui';

export default <cx>
    <FlexRow wrap spacing="large" target="desktop">
        <Section mod="card" title="Material Labels" hLevel={4} visible={{expr: "{$root.$route.theme} == 'material'"}} >
            <ColorField value={bind("standard")} label="Standard" labelPlacement="material" />
            <br/>
            <ColorField value={bind("standard")} label="Disabled" labelPlacement="material" disabled />
            <br/>
            <ColorField value={bind("standard")} label="Read only" labelPlacement="material" readOnly />
            <br/>
            <ColorField value={bind("standard")} label="View mode" labelPlacement="material" mode="view" emptyText="N/A"/>
            <br/>
            <ColorField value={bind("placeholder")} label="Placeholder" labelPlacement="material" placeholder="Enter a color..." />
        </Section>
        <Section mod="card" title="Horizontal Labels" hLevel={4} layout={LabelsLeftLayout} >
            <ColorField value={bind("standard")} label="Standard" />
            <br/>
            <ColorField value={bind("standard")} label="Disabled" disabled />
            <br/>
            <ColorField value={bind("standard")} label="Read only" readOnly />
            <br/>
            <ColorField value={bind("standard")} label="View mode" mode="view" emptyText="N/A" />
            <br/>
            <ColorField value={bind("placeholder")} label="Placeholder" placeholder="Enter a color..." />
        </Section>
        <Section mod="card" title="Labels on Top" hLevel={4} layout={{type: LabelsTopLayout, vertical: true}} >
            <ColorField value={bind("standard")} label="Standard" />
            <br/>
            <ColorField value={bind("standard")} label="Disabled" disabled />
            <br/>
            <ColorField value={bind("standard")} label="Read only" readOnly />
            <br/>
            <ColorField value={bind("standard")} label="View mode" mode="view" emptyText="N/A" />
            <br/>
            <ColorField value={bind("placeholder")} label="Placeholder" placeholder="Enter a color..." />
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
declare let module: any;
hmr(module);