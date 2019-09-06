import {bind, LabelsLeftLayout, LabelsTopLayout} from "cx/ui";
import {cx, MonthField, Section, FlexRow, HelpText} from "cx/widgets";

const range = (function() {
        
    let from = new Date();
    from.setMonth(0);

    let to = new Date();
    to.setMonth(11);

    return { from, to };
})();

export default (
    <cx>
        <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/forms/month-field/states.tsx" target="_blank" putInto="github">Source Code</a>
        <FlexRow wrap spacing="large" target="desktop">

            <Section
                mod="card"
                title="Material Labels"
                visible={{expr: ("{$root.$route.theme} == 'material' || {$root.$route.theme} == 'material-dark'")}}
                hLevel={4}
            >
                <div styles="margin-top: -30px">
                    <MonthField label="Standard" value={bind("material")} labelPlacement="material" />
                    <br/>
                    <MonthField label="Disabled" value={bind("material")} disabled labelPlacement="material"/>
                    <br/>
                    <MonthField
                        label="Icon"
                        value={bind("material")}
                        icon="search"
                        labelPlacement="material"
                    />
                    <br/>
                    <MonthField
                        label="Placeholder"
                        value={bind("material")}
                        placeholder="Enter a month"
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
                <MonthField label="Standard" value={bind("standard")} />
                <MonthField label="Disabled" value={bind("standard")} disabled/>
                <MonthField label="Readonly" value={bind("standard")} readOnly/>
                <MonthField label="View Mode" value={bind("standard")} mode="view"/>
                <MonthField
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
                <MonthField label="Standard" value={bind("vertical")}/>
                <MonthField
                    label="Placeholder"
                    value={bind("vertical")}
                    placeholder="Enter a month"
                />
            </Section>

            <Section
                mod="card"
                layout={LabelsLeftLayout}
                title="Helpers"
                hLevel={4}
            >
                <MonthField
                    label="Placeholder"
                    value={bind("helper")}
                    placeholder="Enter a month..."
                />
                <MonthField
                    label="Clear"
                    value={{ bind: "clear", defaultValue: new Date()}}
                    placeholder="Hidden when empty"
                    showClear
                />
                <MonthField
                    label="Icon"
                    value={bind("helper")}
                    icon="search"
                />
                <MonthField
                    label="Tooltip"
                    value={bind("helper")}
                    tooltip="This is a tooltip."
                />
                <MonthField
                    label="Help"
                    value={bind("helper")}
                    help="Inline"
                />
                <MonthField
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
                    <MonthField label="Required" value={bind("validation")} required/>
                    <MonthField label="Visited" value={bind("validation")} required visited/>
                    <MonthField label="Asterisk" value={bind("validation")} required asterisk/>
                    <MonthField
                        label="Min/Max Value"
                        value={bind("validation")}
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
                        <MonthField label="Tooltip" value={bind("validationMode")} required visited />
                        <MonthField label="Help" value={bind("validationMode")} required visited validationMode="help" />
                        <MonthField label="Help Block" value={bind("validationMode")} required visited validationMode="help-block" />
                        <MonthField label="Material" value={bind("validationMode")} required visited
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
                <MonthField
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