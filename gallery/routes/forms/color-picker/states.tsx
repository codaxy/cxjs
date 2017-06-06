
import {cx, Section, FlexRow, ColorPicker, HelpText} from 'cx/widgets';
import {bind, LabelsLeftLayout, LabelsTopLayout} from 'cx/ui';

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/forms/color-picker/states.tsx" target="_blank" putInto="github">GitHub</a>
    <FlexRow wrap spacing="large" target="desktop">
        <Section mod="card" >
            <ColorPicker value={bind("rgba")} />
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);