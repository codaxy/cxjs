import {cx, Button, Section, FlexRow } from 'cx/widgets';

const buttons = mod => <cx>
    <FlexRow spacing>
        <Button mod={mod}>Normal</Button>
        <Button mod={mod} disabled>Disabled</Button>
        <Button mod={mod} pressed>Pressed</Button>
        <Button mod={mod} icon="search" />
        <Button mod={mod} icon="search">Icon + Text</Button>
    </FlexRow>
    <br/>
</cx>

export default <cx>
    <Section mod="well">
        <p>
            <strong>Normal</strong>
        </p>
        {buttons(null)}

        <p>
            <strong>Primary</strong>
        </p>
        {buttons("primary")}

        <p>
            <strong>Danger</strong>
        </p>
        {buttons("danger")}

        <p>
            <strong>Hollow</strong>
        </p>
        {buttons("hollow")}
    </Section>
</cx>

import {hmr} from '../hmr.js';
declare let module: any;
hmr(module);