import {cx, Button, Section, FlexRow} from 'cx/widgets';

export default <cx>
    <h2 putInto="header">
        Button
    </h2>
    <Section mod="well">
        <FlexRow spacing>
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
        </FlexRow>
    </Section>
</cx>

import { hmr } from '../hmr';
declare let module: any;
hmr(module);