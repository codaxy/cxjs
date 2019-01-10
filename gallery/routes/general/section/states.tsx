import {cx, Section, FlexRow, List, Text} from 'cx/widgets';
import {bind, tpl, expr, Controller, KeySelection} from 'cx/ui';
import casual from '../../../util/casual';
import '../../../util/plural';

const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/general/section/states.tsx" target="_blank" putInto="github">Source Code</a>
    <FlexRow wrap spacing="large" target="tablet" align="start">
        <Section mod="card" title="Card" hLevel={4}>
            <p>{loremIpsum}</p>
        </Section>

        <Section mod="primary" title="Primary" hLevel={4}>
            <p>{loremIpsum}</p>
        </Section>

        <Section mod="success" title="Success" hLevel={4}>
            <p>{loremIpsum}</p>
        </Section>

        <Section mod="warning" title="Warning" hLevel={4}>
            <p>{loremIpsum}</p>
        </Section>

        <Section mod="error" title="Error" hLevel={4}>
            <p>{loremIpsum}</p>
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);