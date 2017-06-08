import {cx, Button, Section, FlexCol, FlexRow} from 'cx/widgets';

let boxIndex = 0;

const Box = (name, flex = 1) => <cx>
    <div
        style={{
            flex: flex,
            background: `rgba(128, 128, 128, ${++boxIndex % 2 == 0 ? 0.3 : 0.2})`,
            padding: "20px",
            whiteSpace: "nowrap",
            textAlign: "center"
        }}
    >
        {name}
    </div>
</cx>;
    
const borderColor = 'rgba(176, 196, 222, 0.5)';


export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/general/flex-row/options.tsx" target="_blank"
        putInto="github">GitHub</a>
    <FlexCol vspacing>
        <FlexRow spacing wrap target="tablet" align="start">

            <Section mod="card" title="spacing: xsmall" hLevel={4}>
                <FlexRow style={`border: 1px solid ${borderColor}`} spacing="xsmall">
                    {Box("Item 1")}
                    {Box("Item 2")}
                </FlexRow>
            </Section>

            <Section mod="card" title="spacing: small" hLevel={4}>
                <FlexRow style={`border: 1px solid ${borderColor}`} spacing="small">
                    {Box("Item 1")}
                    {Box("Item 2")}
                </FlexRow>
            </Section>

            <Section mod="card" title="spacing: medium" hLevel={4}>
                <FlexRow style={`border: 1px solid ${borderColor}`} spacing>
                    {Box("Item 1")}
                    {Box("Item 2")}
                </FlexRow>
            </Section>

            <Section mod="card" title="spacing: large" hLevel={4}>
                <FlexRow style={`border: 1px solid ${borderColor}`} spacing="large">
                    {Box("Item 1")}
                    {Box("Item 2")}
                </FlexRow>
            </Section>

            <Section mod="card" title="spacing: xlarge" hLevel={4}>
                <FlexRow style={`border: 1px solid ${borderColor}`} spacing="xlarge">
                    {Box("Item 1")}
                    {Box("Item 2")}
                </FlexRow>
            </Section>
        </FlexRow>

        <FlexRow spacing wrap target="tablet" align="start">
            <Section mod="card" title="padding: xsmall" hLevel={4}>
                <FlexRow style={`border: 1px solid ${borderColor}`} padding="xsmall">
                    {Box("Item 1")}
                    {Box("Item 2")}
                </FlexRow>
            </Section>

            <Section mod="card" title="padding: small" hLevel={4}>
                <FlexRow style={`border: 1px solid ${borderColor}`} padding="small">
                    {Box("Item 1")}
                    {Box("Item 2")}
                </FlexRow>
            </Section>

            <Section mod="card" title="padding: medium" hLevel={4}>
                <FlexRow style={`border: 1px solid ${borderColor}`} padding="medium">
                    {Box("Item 1")}
                    {Box("Item 2")}
                </FlexRow>
            </Section>

            <Section mod="card" title="padding: large" hLevel={4}>
                <FlexRow style={`border: 1px solid ${borderColor}`} padding="large">
                    {Box("Item 1")}
                    {Box("Item 2")}
                </FlexRow>
            </Section>

            <Section mod="card" title="padding: xlarge" hLevel={4}>
                <FlexRow style={`border: 1px solid ${borderColor}`} padding="xlarge">
                    {Box("Item 1")}
                    {Box("Item 2")}
                </FlexRow>
            </Section>
        </FlexRow>

        <FlexRow spacing wrap target="tablet" align="start">
            <Section mod="card" title="justify: start" hLevel={4}>
                <FlexRow style={`border: 1px solid ${borderColor}`} justify="start">
                    {Box("Item", 0)}
                </FlexRow>
            </Section>

            <Section mod="card" title="justify: center" hLevel={4}>
                <FlexRow style={`border: 1px solid ${borderColor}`} justify="center">
                    {Box("Item", 0)}
                </FlexRow>
            </Section>

            <Section mod="card" title="justify: end" hLevel={4}>
                <FlexRow style={`border: 1px solid ${borderColor}`} justify="end">
                    {Box("Item", 0)}
                </FlexRow>
            </Section>
        </FlexRow>

        <FlexRow spacing wrap target="tablet" align="start">
            <Section mod="card" title="align: start" hLevel={4}>
                <FlexRow style={`border: 1px solid ${borderColor}; height: 100px`} align="start">
                    {Box("Item 1")}
                    {Box("Item 2")}
                </FlexRow>
            </Section>

            <Section mod="card" title="align: center" hLevel={4}>
                <FlexRow style={`border: 1px solid ${borderColor}; height: 100px`} align="center">
                    {Box("Item 1")}
                    {Box("Item 2")}
                </FlexRow>
            </Section>

            <Section mod="card" title="align: end" hLevel={4}>
                <FlexRow style={`border: 1px solid ${borderColor}; height: 100px`} align="end">
                    {Box("Item 1")}
                    {Box("Item 2")}
                </FlexRow>
            </Section>

            <Section mod="card" title="align: stretch" hLevel={4}>
                <FlexRow style={`border: 1px solid ${borderColor}; height: 100px`} align="stretch">
                    {Box("Item 1")}
                    {Box("Item 2")}
                </FlexRow>
            </Section>
        </FlexRow>

        <FlexRow spacing wrap target="tablet" align="start">
            <Section mod="card" title="padding+spacing" hLevel={4}>
                <FlexRow style={`border: 1px solid ${borderColor}`} padding spacing>
                    {Box("Item 1")}
                    {Box("Item 2")}
                </FlexRow>
            </Section>

            <Section mod="card" title="wrap" hLevel={4}>
                <FlexRow style={`border:1px solid ${borderColor}; max-width: 250px`} padding spacing wrap>
                    {Box("Item 1")}
                    {Box("Item 2")}
                    {Box("Item 3")}
                </FlexRow>
            </Section>

        </FlexRow>
    </FlexCol>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);