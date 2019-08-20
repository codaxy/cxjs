
import {cx, Section, FlexRow, ColorField, Slider, HelpText} from 'cx/widgets';
import {bind, LabelsLeftLayout, LabelsTopLayout} from 'cx/ui';

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/forms/slider/states.tsx" target="_blank" putInto="github">Source Code</a>
    <FlexRow wrap spacing="large" target="desktop">
        <Section mod="card" title="Material Labels" hLevel={4} visible={{expr: ("{$root.$route.theme} == 'material' || {$root.$route.theme} == 'material-dark'")}} >
            <Slider label="Standard" value={bind("standard")} labelPlacement="material" />
            <br/>
            <Slider label="Disabled" value={bind("standard")} labelPlacement="material" disabled />
            <br/>
            <Slider label="Read only" value={bind("standard")} labelPlacement="material" readOnly />
            <br/>
            <Slider label="View only" value={bind("standard")} labelPlacement="material" mode="view" emptyText="N/A"  />
        </Section>
        <Section mod="card" title="Horizontal Labels" hLevel={4} layout={LabelsLeftLayout} >
            <Slider label="Standard" value={bind("standard")} />
            <Slider label="Disabled" value={bind("standard")} disabled />
            <Slider label="Read only" value={bind("standard")} readOnly />
            <Slider label="View only" value={bind("standard")} mode="view" emptyText="N/A"  />
        </Section>
        <Section mod="card" title="Labels on Top" hLevel={4} layout={{type: LabelsTopLayout, vertical: true}} >
            <Slider label="Standard" value={bind("standard")} />
            <Slider label="Disabled" value={bind("standard")} disabled />
            <Slider label="Read only" value={bind("standard")} readOnly />
            <Slider label="View only" value={bind("standard")} mode="view" emptyText="N/A"  />
        </Section>
        <Section mod="card" title="Helpers" hLevel={4} layout={LabelsLeftLayout} >
            <Slider
                label="Tooltip"
                value={bind("tooltip")}
                tooltip="This slider will show a tooltip on the handle too."
                valueTooltip={{
                text:{tpl: '{tooltip:n;2}' },
                placement: 'up'
            }} />
            <Slider label="Help" value={bind("inline")} help="Inline" />
            <Slider label="Help" value={bind("block")} help={<cx><HelpText mod="block">Block</HelpText></cx>} />
            <Slider label="Indicator" value={bind("tooltip")} valueTooltip={{
                text:{tpl: '{tooltip:n;2}' },
                placement: 'down',
                alwaysVisible: true
            }} />
        </Section>
        <Section mod="card" title="Misc" hLevel={4} layout={LabelsLeftLayout} >
            <Slider label="Range" from={bind("range.from", 10)} to={bind("range.to", 50)}
                fromTooltip={{
                    text:{tpl: '{range.from:n;2}' },
                    placement: 'up'
                }}
                toTooltip={{
                    text:{tpl: '{range.to:n;2}' },
                    placement: 'up'
                }}
            />
            <Slider label="Stepped" value={bind("stepped")} step={10} />
            <Slider label="Styled" value={bind("styled")} rangeStyle="background:coral" handleStyle="background:coral; border-color:coral" />
            <Slider label="Vertical" value={bind("vertical")} vertical />
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);