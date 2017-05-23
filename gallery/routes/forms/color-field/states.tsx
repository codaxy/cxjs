
import {cx, Section, FlexRow, ColorField} from 'cx/widgets';
import {bind} from 'cx/ui';

export default <cx>
    <FlexRow wrap spacing="large" target="desktop">
        <Section mod="card" title="Material Labels" hLevel={4} visible={{expr: "{$root.$route.theme} == 'material'"}} >
            <ColorField value={bind("standard")} label="Standard" labelPlacement="material" />
            <br/>
            <ColorField value={bind("standard")} label="Disabled" labelPlacement="material" disabled />
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
declare let module: any;
hmr(module);