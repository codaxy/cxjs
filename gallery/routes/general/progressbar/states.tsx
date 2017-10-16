import {cx, ProgressBar, Slider, FlexRow, Section, Text} from 'cx/widgets';
import {bind, tpl, expr, Controller, KeySelection} from 'cx/ui';
import '../../../util/plural';

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/general/ProgressBar/progressbar.tsx" target="_blank" putInto="github">Source Code</a>
    <FlexRow wrap spacing="large" target="tablet" align="start">
      <Section mod="card" title="Standard">
        <ProgressBar text={tpl("{$page.value:p;0}")} value={bind('$page.value')} />     
        <Slider value={bind('$page.value')} maxValue={1} />
      </Section>  
      <Section mod="card" title="Disabled">
        <ProgressBar disabled text={'50%'} value={0.5} />     
      </Section>  
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);