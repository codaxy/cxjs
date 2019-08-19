
import {cx, Section, FlexRow, Select, HelpText} from 'cx/widgets';
import {bind, expr, LabelsLeftLayout, LabelsTopLayout} from 'cx/ui';

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/forms/select/states.tsx" target="_blank" putInto="github">Source Code</a>
    <FlexRow wrap spacing="large" target="desktop">
        <Section
            mod="card"
            title="Material Labels"
            hLevel={4}
            layout={LabelsLeftLayout}
            visible={{expr: "{$root.$route.theme} == 'material' || 'material-dark'"}}
        >
            <Select value={bind("standard")} label="Standard" labelPlacement="material" >
               <option value={1}>Option 1</option>
               <option value={2}>Option 2</option>
            </Select>
            <Select value={bind("standard")} label="Disabled" disabled labelPlacement="material">
               <option value={1}>Option 1</option>
               <option value={2}>Option 2</option>
            </Select>
            <Select value={bind("clear")} label="View only" mode="view" emptyText="N/A" labelPlacement="material">
               <option value={1}>Option 1</option>
               <option value={2}>Option 2</option>
            </Select>
            <Select value={bind("placeholder")} label="Placeholder" placeholder="Please select..." labelPlacement="material">
               <option value={1}>Option 1</option>
               <option value={2}>Option 2</option>
            </Select>
            <Select value={bind("icon")} label="Icon" labelPlacement="material" icon="calendar">
               <option value={1}>Option 1</option>
               <option value={2}>Option 2</option>
            </Select>
        </Section>
        <Section
            mod="card"
            title="Horizontal Labels"
            hLevel={4}
            layout={LabelsLeftLayout}
        >
            <Select value={bind("standard")} label="Standard">
               <option value={1}>Option 1</option>
               <option value={2}>Option 2</option>
            </Select>
            <Select value={bind("standard")} label="Disabled" disabled>
               <option value={1}>Option 1</option>
               <option value={2}>Option 2</option>
            </Select>
            <Select value={bind("clear")} label="View only" mode="view" emptyText="N/A" >
               <option value={1}>Option 1</option>
               <option value={2}>Option 2</option>
            </Select>
            <Select value={bind("placeholder")} label="Placeholder" placeholder="Please select...">
               <option value={1}>Option 1</option>
               <option value={2}>Option 2</option>
            </Select>
            <Select value={bind("icon")} label="Icon" icon="calendar">
               <option value={1}>Option 1</option>
               <option value={2}>Option 2</option>
            </Select>
        </Section>
        <Section
            mod="card"
            title="Labels on Top"
            hLevel={4}
            layout={{type: LabelsTopLayout, vertical: true}}
        >
            <Select value={bind("standard")} label="Standard">
               <option value={1}>Option 1</option>
               <option value={2}>Option 2</option>
            </Select>
            <Select value={bind("clear")} label="Disabled" disabled>
               <option value={1}>Option 1</option>
               <option value={2}>Option 2</option>
            </Select>
            <Select value={bind("clear")} label="View only" mode="view" emptyText="N/A" >
               <option value={1}>Option 1</option>
               <option value={2}>Option 2</option>
            </Select>
            <Select value={bind("placeholder")} label="Placeholder" placeholder="Please select...">
               <option value={1}>Option 1</option>
               <option value={2}>Option 2</option>
            </Select>
            <Select value={bind("icon")} label="Icon" icon="calendar">
               <option value={1}>Option 1</option>
               <option value={2}>Option 2</option>
            </Select>
        </Section>
        <Section
                mod="card"
                layout={LabelsLeftLayout}
                title="Helpers"
                hLevel={4}
            >
                <Select label="Placeholder" value={bind("placeholder")} placeholder="Please select...">
                    <option value={1}>Option 1</option>
                    <option value={2}>Option 2</option>
                </Select>
                <Select label="Clear" value={bind("clear")} placeholder="Requires a placeholder" >
                    <option value={1}>Option 1</option>
                    <option value={2}>Option 2</option>
                </Select>
                <Select value={bind("icon")} label="Icon" icon="search">
                    <option value={1}>Option 1</option>
                    <option value={2}>Option 2</option>
                </Select>
                <Select
                    label="Tooltip"
                    value={bind("tooltip")}
                    tooltip="This is a tooltip."
                >
                    <option value={1}>Option 1</option>
                    <option value={2}>Option 2</option>
                </Select>
                <Select
                    label="Help"
                    value={bind("inline")}
                    help="Inline"
                >
                    <option value={1}>Option 1</option>
                    <option value={2}>Option 2</option>
                </Select>
                <Select
                    label="Help"
                    value={bind("help")}
                    help={<cx>
                        <HelpText mod="block">Block</HelpText>
                    </cx>}
                >
                    <option value={1}>Option 1</option>
                    <option value={2}>Option 2</option>
                </Select>
            </Section>
            <Section
                mod="card"
                title="Validation"
                hLevel={4}
                layout={LabelsLeftLayout}
            >
                <Select value={bind("required")} label="Required" placeholder="Please select..." required>
                   <option value={1}>Option 1</option>
                   <option value={2}>Option 2</option>
                </Select>
                <Select value={bind("visited")} label="Visited" placeholder="Please select..." required visited>
                   <option value={1}>Option 1</option>
                   <option value={2}>Option 2</option>
                </Select>
                <Select value={bind("asterisk")} label="Asterisk" placeholder="Please select..." required asterisk>
                   <option value={1}>Option 1</option>
                   <option value={2}>Option 2</option>
                </Select>
            </Section>
            <Section
                title="Validation Modes"
                mod="card"
                layout={LabelsLeftLayout}
                hLevel={4}
            >
                
                <Select label="Tooltip" value={bind("validation.tooltip")} required visited placeholder="Please select...">
                    <option value={1}>Option 1</option>
                    <option value={2}>Option 2</option>
                </Select>
                <Select label="Help" value={bind("validation.help")} required visited validationMode="help" placeholder="Please select...">
                    <option value={1}>Option 1</option>
                    <option value={2}>Option 2</option>
                </Select>
                <Select label="Help Block" value={bind("validation.block")} required visited validationMode="help-block" placeholder="Please select..." >
                    <option value={1}>Option 1</option>
                    <option value={2}>Option 2</option>
                </Select>
                <Select
                    label="Material"
                    value={bind("validation.material")}
                    required
                    visited
                    validationMode="help"
                    helpPlacement="material"
                    visible={{expr: "{$root.$route.theme} == 'material'"}}
                    placeholder="Please select..."
                >
                    <option value={1}>Option 1</option>
                    <option value={2}>Option 2</option>
                </Select>
            </Section>
            <Section
                mod="card"
                title="Misc"
                hLevel={4}
                layout={LabelsLeftLayout}
            >
                <Select value={bind("styled")} label="Styled" inputStyle={{background: "rgba(255, 255, 0, 0.3)"}} >
                   <option value={1}>Option 1</option>
                   <option value={2}>Option 2</option>
                </Select>
            </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);