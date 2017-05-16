import {bind, LabelsLeftLayout, LabelsTopLayout} from "cx/ui";
import {cx, DateField, Section, FlexRow, HelpText} from "cx/widgets";

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
                    <DateField label="Standard" value={bind("standard")} labelPlacement="material" />
                    <br/>
                    <DateField label="Disabled" value={bind("disabled")} disabled labelPlacement="material"/>
                    <br/>
                    <DateField
                        label="Icon"
                        value={bind("icon")}
                        icon="search"
                        labelPlacement="material"
                    />
                    <br/>
                    <DateField
                        label="Placeholder"
                        value={bind("placeholder")}
                        placeholder="Enter a date"
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
                <DateField label="Standard" value={bind("standard")} />
                <DateField label="Disabled" value={bind("standard")} disabled/>
                <DateField label="Readonly" value={bind("standard")} readOnly/>
                <DateField label="View Mode" value={bind("standard")} mode="view"/>
                <DateField
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
                <DateField label="Standard" value={bind("standard")}/>
                <DateField
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
                <DateField
                    label="Placeholder"
                    value={bind("placeholder")}
                    placeholder="Enter a number..."
                />
                <DateField
                    label="Clear"
                    value={{ bind: "clear", defaultValue: "123456"}}
                    placeholder="Hidden when empty"
                    showClear
                />
                <DateField
                    label="Icon"
                    value={bind("icon")}
                    icon="search"
                />
                <DateField
                    label="Tooltip"
                    value={bind("text")}
                    tooltip="This is a tooltip."
                />
                <DateField
                    label="Help"
                    value={bind("standard")}
                    help="Inline"
                />
                <DateField
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
                    <DateField label="Required" value={bind("required")} required/>
                    <DateField label="Visited" value={bind("visited")} required visited/>
                    <DateField label="Asterisk" value={bind("asterisk")} required asterisk/>
                    <DateField
                        label="Min/Max Value"
                        value={bind("text")}
                        minValue="2017-01-01"
                        maxValue="2017-12-31"
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
                        <DateField label="Tooltip" value={bind("validation")} required />
                        <DateField label="Help" value={bind("validation")} required validationMode="help" />
                        <DateField label="Help Block" value={bind("validation")} required validationMode="help-block" />
                        <DateField label="Material" value={bind("validation")} required
                            validationMode="help" 
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
                <DateField
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