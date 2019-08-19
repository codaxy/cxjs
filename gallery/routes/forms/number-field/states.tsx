import {bind, LabelsLeftLayout, LabelsTopLayout} from "cx/ui";
import {cx, NumberField, Section, FlexRow, HelpText} from "cx/widgets";

export default (
    <cx>
        <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/forms/number-field/states.tsx" target="_blank" putInto="github">Source Code</a>
        <FlexRow wrap spacing="large" target="desktop">

            <Section
                mod="card"
                title="Material Labels"
                visible={{expr: "{$root.$route.theme} == 'material' || 'material-dark'"}}
                hLevel={4}
            >
                <div styles="margin-top: -30px">
                    <NumberField label="Standard" value={bind("material")} labelPlacement="material"/>
                    <br/>
                    <NumberField label="Disabled" value={bind("material")} disabled labelPlacement="material"/>
                    <br/>
                    <NumberField
                        label="Icon"
                        value={bind("material")}
                        icon="search"
                        labelPlacement="material"
                    />
                    <br/>
                    <NumberField
                        label="Placeholder"
                        value={bind("material")}
                        placeholder="Enter a number..."
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
                <NumberField label="Standard" value={bind("standard")}/>
                <NumberField label="Disabled" value={bind("standard")} disabled/>
                <NumberField label="Readonly" value={bind("standard")} readOnly/>
                <NumberField label="View Mode" value={bind("standard")} mode="view"/>
                <NumberField
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
                <NumberField label="Standard" value={bind("vertical")}/>
                <NumberField
                    label="Placeholder"
                    value={bind("vertical")}
                    placeholder="Enter a number..."
                />
            </Section>

            <Section
                mod="card"
                layout={LabelsLeftLayout}
                title="Helpers"
                hLevel={4}
            >
                <NumberField
                    label="Placeholder"
                    value={bind("helper")}
                    placeholder="Enter a number..."
                />
                <NumberField
                    label="Clear"
                    value={{ bind: "clear", defaultValue: 123456 }}
                    placeholder="Hidden when empty"
                    showClear
                />
                <NumberField
                    label="Icon"
                    value={bind("helper")}
                    icon="search"
                />
                <NumberField
                    label="Tooltip"
                    value={bind("helper")}
                    tooltip="This is a tooltip."
                />
                <NumberField
                    label="Help"
                    value={bind("helper")}
                    help="Inline"
                />
                <NumberField
                    label="Help"
                    value={bind("helper")}
                    help={<cx>
                        <HelpText mod="block">Block</HelpText>
                    </cx>}
                />
            </Section>

            <Section
                mod="card"
                layout={LabelsLeftLayout}
                title="Formatting"
                hLevel={4}
            >
                <div layout={LabelsLeftLayout}>

                </div>
                <div layout={LabelsLeftLayout}>
                    <NumberField 
                        label="Currency" 
                        value={{ bind: "formatting", defaultValue: 75 }} 
                        placeholder="EUR" 
                        format="currency;EUR" />
                    <NumberField label="Currency" value={bind("formatting")} placeholder="USD" format="currency;USD" />
                    <NumberField label="Formatted" value={bind("formatting")} format="n;2" />
                    <NumberField label="Percentage" value={bind("formatting")} format="ps" placeholder="%" />
                    <NumberField label="Suffix" value={bind("formatting")} format="suffix; kg" placeholder="kg" />
                </div>
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
                    <NumberField label="Required" value={bind("validation")} required/>
                    <NumberField label="Visited" value={bind("validation")} required visited/>
                    <NumberField label="Asterisk" value={bind("validation")} required asterisk/>
                    <NumberField
                        label="Min/Max Value"
                        value={bind("validation")}
                        minValue={1}
                        maxValue={5}
                        placeholder="Value between 1 and 5"
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
                        <NumberField label="Tooltip" value={bind("validationMode")} required visited />
                        <NumberField label="Help" value={bind("validationMode")} required visited validationMode="help" />
                        <NumberField label="Help Block" value={bind("validationMode")} required visited validationMode="help-block"/>
                        <NumberField label="Material" value={bind("validationMode")} required visited
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
                <NumberField
                    label="Styled"
                    value={bind("styled")}
                    inputStyle={{background: "rgba(255, 255, 0, 0.3)"}}
                />
            </Section>
        </FlexRow>
    </cx>
);


import {hmr} from '../../hmr.js';
hmr(module);