import {bind, LabelsLeftLayout, LabelsTopLayout} from "cx/ui";
import {cx, TextArea, Section, FlexRow, HelpText} from "cx/widgets";

export default (
    <cx>
        <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/forms/text-area/states.tsx" target="_blank" putInto="github">GitHub</a>
        <FlexRow wrap spacing="large" target="desktop">

            <Section
                mod="card"
                title="Material Labels"
                visible={{expr: "{$root.$route.theme} == 'material'"}}
                hLevel={4}
            >
                <div styles="margin-top: -30px">
                    <TextArea label="Standard" value={bind("material")} labelPlacement="material"/>
                    <br/>
                    <TextArea label="Disabled" value={bind("material")} disabled labelPlacement="material"/>
                    <br/>
                    <TextArea
                        label="Placeholder"
                        value={bind("material")}
                        placeholder="Type something here..."
                        labelPlacement="material"
                    />
                </div>
            </Section>

            <Section
                mod="card"
                title="Horizontal Labels"
                hLevel={4}
                layout={LabelsLeftLayout}
            >
                <TextArea label="Standard" value={bind("standard")}/>
                <TextArea label="Disabled" value={bind("standard")} disabled/>
                <TextArea label="Readonly" value={bind("standard")} readOnly/>
                <TextArea label="View Mode" value={bind("standard")} mode="view"/>
                <TextArea
                    label="EmptyText"
                    value={bind("standard")}
                    mode="view"
                    emptyText="N/A"
                />
            </Section>

            <Section
                mod="card"
                title="Labels on Top"
                hLevel={4}
                layout={{type: LabelsTopLayout, vertical: true}}
            >
                <TextArea label="Standard" value={bind("vertical")}/>
                <TextArea
                    label="Placeholder"
                    value={bind("vertical")}
                    placeholder="Type something here..."
                />
            </Section>

            <Section
                mod="card"
                layout={LabelsLeftLayout}
                title="Helpers"
                hLevel={4}
            >
                <TextArea
                    label="Placeholder"
                    value={bind("helpers")}
                    placeholder="Type something here..."
                />
                <TextArea
                    label="Tooltip"
                    value={bind("helpers")}
                    tooltip="This is a tooltip."
                />
                <TextArea
                    label="Help"
                    value={bind("helpers")}
                    help="Inline"
                />
                <TextArea
                    label="Help"
                    value={bind("helpers")}
                    help={<cx>
                        <HelpText mod="block">Block</HelpText>
                    </cx>}
                />
            </Section>

            <Section
                mod="card"
                layout={LabelsLeftLayout}
                title="Validation"
                hLevel={4}
            >
                <div layout={LabelsLeftLayout}>

                </div>
                <div layout={LabelsLeftLayout}>
                    <TextArea label="Required" value={bind("validation")} required/>
                    <TextArea label="Visited" value={bind("validation")} required visited/>
                    <TextArea label="Asterisk" value={bind("validation")} required asterisk/>
                    <TextArea
                        label="Min/Max Length"
                        value={bind("validation")}
                        minLength={3}
                        maxLength={10}
                    />
                </div>
            </Section>

            <Section
                title="Validation Modes"
                mod="card"
                layout={LabelsLeftLayout}
                hLevel={4}
            >
                <FlexRow wrap spacing="xlarge">
                    <div layout={LabelsLeftLayout}>
                        <TextArea label="Tooltip" value={bind("validationMode")} required minLength={10}/>
                        <TextArea label="Help" value={bind("validationMode")} required validationMode="help" minLength={10}/>
                        <TextArea label="Help Block" value={bind("validationMode")} required validationMode="help-block"
                            minLength={10}/>
                        <TextArea label="Material" value={bind("validationMode")} required
                            validationMode="help" 
                            minLength={3}
                            maxLength={10}
                            helpPlacement="material"
                            visible={{expr: "{$root.$route.theme} == 'material'"}}
                        />
                    </div>
                </FlexRow>
            </Section>

            <Section
                title="Misc"
                mod="card"
                layout={LabelsLeftLayout}
                hLevel={4}
            >
                <TextArea
                    label="Styled"
                    value={bind("styled")}
                    inputStyle={{background: "rgba(255, 255, 0, 0.3)"}}
                    rows={5}
                />
            </Section>
        </FlexRow>
    </cx>
);


import {hmr} from '../../hmr.js';
hmr(module);