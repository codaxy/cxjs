import {cx, Button, Section, FlexRow} from 'cx/widgets';

const buttons = mod => <cx>
    <FlexRow spacing>
        <Button mod={mod}>Default</Button>
        <Button mod={mod} disabled>Disabled</Button>
        <Button mod={mod} pressed>Pressed</Button>
        <Button mod={mod} icon="search"/>
        <Button mod={mod} icon="search">Icon + Text</Button>
    </FlexRow>
    <br/>
</cx>

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/general/button/states.tsx" target="_blank" putInto="github">GitHub</a>
    <FlexRow>
        <Section mod="well">
            <br/>
            <h6>Standard</h6>
            {buttons(null)}

            <br/>
            <h6>Primary</h6>
            {buttons("primary")}

            <br/>
            <h6>Danger</h6>
            {buttons("danger")}

            <br/>
            <h6>Hollow</h6>
            {buttons("hollow")}
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);