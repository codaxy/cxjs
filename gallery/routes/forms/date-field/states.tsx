import {bind, LabelsLeftLayout, LabelsTopLayout} from "cx/ui";
import {cx, DateField, Section, FlexRow, HelpText} from "cx/widgets";

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
        <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/forms/calendar/states.tsx" target="_blank" putInto="github">GitHub</a>
        <FlexRow wrap spacing="large" target="desktop">

            <Section
                mod="card"
                title="Material Labels"
                visible={{expr: "{$root.$route.theme} == 'material'"}}
                hLevel={4}
            >
                <div styles="margin-top: -30px">
                    <DateField label="Standard" value={bind("material")} labelPlacement="material" />
                    <br/>
                    <DateField label="Disabled" value={bind("material")} disabled labelPlacement="material"/>
                    <br/>
                    <DateField
                        label="Icon"
                        value={bind("material")}
                        icon="search"
                        labelPlacement="material"
                    />
                    <br/>
                    <DateField
                        label="Placeholder"
                        value={bind("material")}
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
                title="Labels on Top"
                hLevel={4}
                layout={{type: LabelsTopLayout, vertical: true}}
            >
                <DateField label="Standard" value={bind("vertical")}/>
                <DateField
                    label="Placeholder"
                    value={bind("vertical")}
                    placeholder="Enter a date"
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
                    value={bind("helper")}
                    placeholder="Enter a date..."
                />
                <DateField
                    label="Clear"
                    value={{ bind: "clear", defaultValue: new Date()}}
                    placeholder="Hidden when empty"
                    showClear
                />
                <DateField
                    label="Icon"
                    value={bind("helper")}
                    icon="search"
                />
                <DateField
                    label="Tooltip"
                    value={bind("helper")}
                    tooltip="This is a tooltip."
                />
                <DateField
                    label="Help"
                    value={bind("helper")}
                    help="Inline"
                />
                <DateField
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
                        <DateField label="Tooltip" value={bind("validationMode")} required visited />
                        <DateField label="Help" value={bind("validationMode")} required visited validationMode="help" />
                        <DateField label="Help Block" value={bind("validationMode")} required visited validationMode="help-block" />
                        <DateField label="Material" value={bind("validationMode")} required visited
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
                <DateField
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