import {bind, LabelsLeftLayout, LabelsTopLayout} from "cx/ui";
import {cx, TextArea, Section, FlexRow, HelpText} from "cx/widgets";

export default (
    <cx>
        <FlexRow wrap spacing="large" target="desktop">

            <Section
                mod="card"
                title="Material Labels"
                visible={{expr: "{$root.$route.theme} == 'material'"}}
                hLevel={4}
            >
                <div styles="margin-top: -30px">
                    <TextArea label="Standard" value={bind("standard")} labelPlacement="material"/>
                    <br/>
                    <TextArea label="Disabled" value={bind("disabled")} disabled labelPlacement="material"/>
                    <br/>
                    <TextArea
                        label="Icon"
                        value={bind("icon")}
                        icon="search"
                        labelPlacement="material"
                    />
                    <br/>
                    <TextArea
                        label="Placeholder"
                        value={bind("placeholder")}
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
                <TextArea label="Disabled" value={bind("disabled")} disabled/>
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
                title="Vertical Labels"
                hLevel={4}
                layout={{type: LabelsTopLayout, vertical: true}}
            >
                <TextArea label="Standard" value={bind("standard")}/>
                <TextArea
                    label="Placeholder"
                    value={bind("placeholder")}
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
                    value={bind("placeholder")}
                    placeholder="Type something here..."
                />
                <TextArea
                    label="Clear"
                    value={{ bind: "clear", defaultValue: "Text"}}
                    placeholder="Hidden when empty"
                    showClear
                />
                <TextArea
                    label="Icon"
                    value={bind("icon")}
                    icon="search"
                />
                <TextArea
                    label="Tooltip"
                    value={bind("text")}
                    tooltip="This is a tooltip."
                />
                <TextArea
                    label="Help"
                    value={bind("standard")}
                    help="Inline"
                />
                <TextArea
                    label="Help"
                    value={bind("standard")}
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
                    <TextArea label="Required" value={bind("required")} required/>
                    <TextArea label="Visited" value={bind("visited")} required visited/>
                    <TextArea label="Asterisk" value={bind("asterisk")} required asterisk/>
                    <TextArea
                        label="Min/Max Length"
                        value={bind("text")}
                        minLength={3}
                        maxLength={8}
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
                        <TextArea label="Tooltip" value={bind("validation")} required minLength={10}/>
                        <TextArea label="Help" value={bind("validation")} required validationMode="help" minLength={10}/>
                        <TextArea label="Help Block" value={bind("validation")} required validationMode="help-block"
                            minLength={10}/>
                        <TextArea label="Material" value={bind("validation")} required
                            validationMode="help" minLength={10}
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
                />
            </Section>
        </FlexRow>
    </cx>
);


import {hmr} from '../hmr.js';
declare let module: any;
hmr(module);