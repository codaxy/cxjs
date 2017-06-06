
import {cx, Section, FlexRow} from 'cx/widgets';
import {bind} from 'cx/ui';

export default <cx>
    <FlexRow wrap spacing="large" target="desktop">
        <Section mod="well" title="TITLE" hLevel={4}>
            Widget showroom
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../hmr.js';
hmr(module);