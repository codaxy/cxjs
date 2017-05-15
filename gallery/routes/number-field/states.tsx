import {bind, LabelsLeftLayout, LabelsTopLayout} from "cx/ui";
import {cx, NumberField, Section, FlexRow, HelpText} from "cx/widgets";

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
                    <NumberField label="Standard" value={bind("standard")} labelPlacement="material"/>
                    <br/>
                    <NumberField label="Disabled" value={bind("disabled")} disabled labelPlacement="material"/>
                    <br/>
                    <NumberField
                        label="Icon"
                        value={bind("icon")}
                        icon="search"
                        labelPlacement="material"
                    />
                    <br/>
                    <NumberField
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
                <NumberField label="Standard" value={bind("standard")}/>
                <NumberField label="Disabled" value={bind("disabled")} disabled/>
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
                title="Vertical Labels"
                hLevel={4}
                layout={{type: LabelsTopLayout, vertical: true}}
            >
                <NumberField label="Standard" value={bind("standard")}/>
                <NumberField
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
                <NumberField
                    label="Placeholder"
                    value={bind("placeholder")}
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
                    value={bind("icon")}
                    icon="search"
                />
                <NumberField
                    label="Tooltip"
                    value={bind("text")}
                    tooltip="This is a tooltip."
                />
                <NumberField
                    label="Help"
                    value={bind("standard")}
                    help="Inline"
                />
                <NumberField
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
                    <NumberField label="Required" value={bind("required")} required/>
                    <NumberField label="Visited" value={bind("visited")} required visited/>
                    <NumberField label="Asterisk" value={bind("asterisk")} required asterisk/>
                    <NumberField
                        label="Min/Max Value"
                        value={bind("text")}
                        minValue={1}
                        maxValue={10}
                        placeholder="Value between 1 and 10"
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
                        <NumberField label="Tooltip" value={bind("validation")} required minLength={10}/>
                        <NumberField label="Help" value={bind("validation")} required validationMode="help" minLength={10}/>
                        <NumberField label="Help Block" value={bind("validation")} required validationMode="help-block"
                            minLength={10}/>
                        <NumberField label="Material" value={bind("validation")} required
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
                <NumberField
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