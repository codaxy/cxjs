import {bind, LabelsLeftLayout, LabelsTopLayout} from "cx/ui";
import {cx, TextField, Section, FlexRow, HelpText} from "cx/widgets";

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
                    <TextField label="Standard" value={bind("standard")} labelPlacement="material"/>
                    <br/>
                    <TextField label="Disabled" value={bind("disabled")} disabled labelPlacement="material"/>
                    <br/>
                    <TextField
                        label="Icon"
                        value={bind("icon")}
                        icon="search"
                        labelPlacement="material"
                    />
                    <br/>
                    <TextField
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
                <TextField label="Standard" value={bind("standard")}/>
                <TextField label="Disabled" value={bind("disabled")} disabled/>
                <TextField label="Readonly" value={bind("standard")} readOnly/>
                <TextField label="View Mode" value={bind("standard")} mode="view"/>
                <TextField
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
                <TextField label="Standard" value={bind("standard")}/>
                <TextField
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
                <TextField
                    label="Placeholder"
                    value={bind("placeholder")}
                    placeholder="Type something here..."
                />
                <TextField
                    label="Clear"
                    value={{ bind: "clear", defaultValue: "Text"}}
                    placeholder="Hidden when empty"
                    showClear
                />
                <TextField
                    label="Icon"
                    value={bind("icon")}
                    icon="search"
                />
                <TextField
                    label="Tooltip"
                    value={bind("text")}
                    tooltip="This is a tooltip."
                />
                <TextField
                    label="Help"
                    value={bind("standard")}
                    help="Inline"
                />
                <TextField
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
                    <TextField label="Required" value={bind("required")} required/>
                    <TextField label="Visited" value={bind("visited")} required visited/>
                    <TextField label="Asterisk" value={bind("asterisk")} required asterisk/>
                    <TextField
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
                        <TextField label="Tooltip" value={bind("validation")} required minLength={10}/>
                        <TextField label="Help" value={bind("validation")} required validationMode="help" minLength={10}/>
                        <TextField label="Help Block" value={bind("validation")} required validationMode="help-block"
                            minLength={10}/>
                        <TextField label="Material" value={bind("validation")} required
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
                <TextField
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