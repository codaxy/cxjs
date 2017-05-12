
import {cx, Section, FlexRow} from 'cx/widgets';
import {bind} from 'cx/ui';

export default <cx>
    <FlexRow>
        <Section mod="well">
            Widget showroom
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../hmr.js';
declare let module: any;
hmr(module);