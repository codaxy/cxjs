import {bind, LabelsLeftLayout, LabelsTopLayout} from "cx/ui";
import {cx, DateTimeField, Section, FlexRow, HelpText} from "cx/widgets";

const range = (function() {
    let today = new Date();
    let dayOfWeek = today.getDay();

    let from = new Date();
    from.setDate(from.getDate() - dayOfWeek);

    let to = new Date();
    to.setDate(to.getDate() - dayOfWeek + 6);

    return { from, to };
})();

export default (
    <cx>
        <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/forms/date-time-field/states.tsx" target="_blank" putInto="github">Source Code</a>
        <FlexRow wrap spacing="large" target="desktop">

            <Section
                mod="card"
                title="Material Labels"
                visible={{expr: "{$root.$route.theme} == 'material'"}}
                hLevel={4}
            >
                <div styles="margin-top: -30px">
                    <DateTimeField label="Standard" value={bind("standard")} labelPlacement="material" />
                    <br/>
                    <DateTimeField label="Disabled" value={bind("standard")} disabled labelPlacement="material"/>
                    <br/>
                    <DateTimeField label="Read only" value={bind("standard")} readOnly labelPlacement="material"/>
                    <br/>
                    <DateTimeField label="View only" value={bind("standard")} mode="view" emptyText="N/A" labelPlacement="material"/>
                    <br/>
                    <DateTimeField
                        label="Icon"
                        value={bind("icon")}
                        icon="search"
                        labelPlacement="material"
                    />
                    <br/>
                    <DateTimeField
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
                <DateTimeField label="Standard" value={bind("standard")} />
                <DateTimeField label="Disabled" value={bind("standard")} disabled/>
                <DateTimeField label="Read only" value={bind("standard")} readOnly/>
                <DateTimeField
                    label="View only"
                    value={bind("standard")}
                    mode="view"
                    emptyText="N/A"
                />
                <DateTimeField label="Icon" value={bind("icon")} icon="search" />
                <DateTimeField label="Placeholder" value={bind("placeholder")} placeholder="Enter a date/time" />
            </Section>

            <Section
                mod="card"
                title="Labels on Top"
                hLevel={4}
                layout={{type: LabelsTopLayout, vertical: true}}
            >
                <DateTimeField label="Standard" value={bind("standard")}/>
                <DateTimeField label="Placeholder" value={bind("placeholder")} placeholder="Enter a date/time" />
            </Section>
            <Section
                mod="card"
                layout={LabelsLeftLayout}
                title="Helpers"
                hLevel={4}
            >
                <DateTimeField
                    label="Placeholder"
                    value={bind("placeholder")}
                    placeholder="Enter a date..."
                />
                <DateTimeField
                    label="Clear"
                    value={{ bind: "clear", defaultValue: new Date()}}
                    placeholder="Hidden when empty"
                    showClear
                />
                <DateTimeField
                    label="Icon"
                    value={bind("icon")}
                    icon="search"
                />
                <DateTimeField
                    label="Tooltip"
                    value={bind("tooltip")}
                    tooltip="This is a tooltip."
                />
                <DateTimeField
                    label="Help"
                    value={bind("inline")}
                    help="Inline"
                />
                <DateTimeField
                    label="Help"
                    value={bind("block")}
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
                    <DateTimeField label="Required" value={bind("required")} required/>
                    <DateTimeField label="Visited" value={bind("visited")} required visited/>
                    <DateTimeField label="Asterisk" value={bind("asterisk")} required asterisk/>
                    <DateTimeField
                        label="Min/Max Value"
                        value={bind("minmax")}
                        minValue={range.from}
                        maxValue={range.to}
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
                        <DateTimeField label="Tooltip" value={bind("validation.tooltip")} required visited />
                        <DateTimeField label="Help" value={bind("validation.inline")} required visited validationMode="help" />
                        <DateTimeField label="Help Block" value={bind("validation.block")} required visited validationMode="help-block" />
                        <DateTimeField label="Material" value={bind("validation.material")} required visited
                            validationMode="help" 
                            helpPlacement="material"
                            minValue={range.from}
                            maxValue={range.to}
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
                <DateTimeField
                    label="Styled"
                    value={bind("styled")}
                    inputStyle={{background: "rgba(255, 255, 0, 0.3)"}}
                />
                <DateTimeField label="Time only" value={bind("time")} segment="time" />
                <DateTimeField label="Date only" value={bind("date")} segment="date" />
            </Section>
        </FlexRow>
    </cx>
);


import {hmr} from '../../hmr.js';
hmr(module);