import {cx, Button, Section, FlexRow } from 'cx/widgets';

const buttons = mod => <cx>
    <FlexRow spacing>
        <Button mod={mod}>Default</Button>
        <Button mod={mod} disabled>Disabled</Button>
        <Button mod={mod} pressed>Pressed</Button>
        <Button mod={mod} icon="search" />
        <Button mod={mod} icon="search">Icon + Text</Button>
    </FlexRow>
    <br/>
    <br/>
</cx>

export default <cx>
    <Section mod="well">
        <h6>Standard</h6>
        {buttons(null)}

        <h6>Primary</h6>
        {buttons("primary")}

        <h6>Danger</h6>
        {buttons("danger")}

        <h6>Hollow</h6>
        {buttons("hollow")}
    </Section>
</cx>

import {hmr} from '../hmr.js';
declare let module: any;
hmr(module);