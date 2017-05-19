
import {cx, Section, FlexRow, Select, HelpText} from 'cx/widgets';
import {bind, expr, LabelsLeftLayout, LabelsTopLayout, Controller} from 'cx/ui';
import casual from '../../../util/casual';



export default <cx>
    <FlexRow wrap spacing="large" target="desktop">
        <Section
            mod="card"
            title="Material Labels"
            hLevel={4}
            layout={LabelsLeftLayout}
            visible={{expr: "{$root.$route.theme} == 'material'"}}
        >
            <Select value={bind("material")} label="Standard" labelPlacement="material" >
               <option value={1}>Option 1</option>
               <option value={2}>Option 2</option>
            </Select>
            <Select value={bind("material")} label="Disabled" disabled labelPlacement="material">
               <option value={1}>Option 1</option>
               <option value={2}>Option 2</option>
            </Select>
            <Select value={bind("material")} label="Placeholder" placeholder="Please select..." labelPlacement="material">
               <option value={1}>Option 1</option>
               <option value={2}>Option 2</option>
            </Select>
            <Select value={bind("material")} label="Icon" labelPlacement="material" icon="calendar">
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
            <Select value={bind("standard")} label="Placeholder" placeholder="Please select...">
               <option value={1}>Option 1</option>
               <option value={2}>Option 2</option>
            </Select>
            <Select value={bind("standard")} label="Icon" icon="calendar">
               <option value={1}>Option 1</option>
               <option value={2}>Option 2</option>
            </Select>
        </Section>
        <Section
            mod="card"
            title="Vertical Labels"
            hLevel={4}
            layout={{type: LabelsTopLayout, vertical: true}}
        >
            <Select value={bind("vertical")} label="Standard">
               <option value={1}>Option 1</option>
               <option value={2}>Option 2</option>
            </Select>
            <Select value={bind("vertical")} label="Disabled" disabled>
               <option value={1}>Option 1</option>
               <option value={2}>Option 2</option>
            </Select>
            <Select value={bind("vertical")} label="Placeholder" placeholder="Please select...">
               <option value={1}>Option 1</option>
               <option value={2}>Option 2</option>
            </Select>
            <Select value={bind("standard")} label="Icon" icon="calendar">
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
                <Select label="Placeholder" value={bind("helper")} placeholder="Enter a number...">
                    <option value={1}>Option 1</option>
                    <option value={2}>Option 2</option>
                </Select>
                <Select label="Clear" value={bind("helper")} placeholder="Requires a placeholder" >
                    <option value={1}>Option 1</option>
                    <option value={2}>Option 2</option>
                </Select>
                <Select
                    label="Tooltip"
                    value={bind("helper")}
                    tooltip="This is a tooltip."
                >
                    <option value={1}>Option 1</option>
                    <option value={2}>Option 2</option>
                </Select>
                <Select
                    label="Help"
                    value={bind("helper")}
                    help="Inline"
                >
                    <option value={1}>Option 1</option>
                    <option value={2}>Option 2</option>
                </Select>
                <Select
                    label="Help"
                    value={bind("helper")}
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
                <Select value={bind("required")} label="Required" placeholder="Please select..." required >
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
                
                <Select label="Tooltip" value={bind("validationMode")} required placeholder="Please select...">
                    <option value={1}>Option 1</option>
                    <option value={2}>Option 2</option>
                </Select>
                <Select label="Help" value={bind("validationMode")} required validationMode="help" placeholder="Please select...">
                    <option value={1}>Option 1</option>
                    <option value={2}>Option 2</option>
                </Select>
                <Select label="Help Block" value={bind("validationMode")} required validationMode="help-block" placeholder="Please select..." >
                    <option value={1}>Option 1</option>
                    <option value={2}>Option 2</option>
                </Select>
                <Select label="Material" value={bind("validationMode")} required
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
declare let module: any;
hmr(module);