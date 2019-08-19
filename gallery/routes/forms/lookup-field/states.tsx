
import {cx, Section, FlexRow, LookupField, HelpText} from 'cx/widgets';
import {bind, expr, LabelsLeftLayout, LabelsTopLayout, Controller} from 'cx/ui';
import casual from '../../../util/casual';

class PageController extends Controller {

    cityDb: any;

    init() {
        super.init();

        this.store.set(
        "options5",
        Array
            .from({ length: 5 })
            .map((v, i) => ({ id: i, text: `Option ${i + 1}` }))
        );

        this.store.set(
        "options10",
        Array
            .from({ length: 10 })
            .map((v, i) => ({ id: i, text: `Option ${i + 1}` }))
        );
    }

    query(q) {
        //fake data
        if (!this.cityDb)
        this.cityDb = Array
            .from({ length: 100 })
            .map((_, i) => ({ id: i, text: casual.city }));

        var regex = new RegExp(q, "gi");
        return new Promise(resolve => {
        setTimeout(
            () => resolve(this.cityDb.filter(x => x.text.match(regex))),
            100
        );
        });
    }
}

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/forms/lookup-field/states.tsx" target="_blank" putInto="github">Source Code</a>
    <FlexRow wrap spacing="large" target="desktop">
        <Section
            mod="card"
            title="Material Labels"
            hLevel={4}
            layout={LabelsLeftLayout}
            visible={{expr: "{$root.$route.theme} == 'material' || 'material-dark'"}}
        >
            <LookupField 
                label="Standard" 
                value={bind("standard")} 
                options={bind("options5")}
                labelPlacement="material"
            />
            <LookupField 
                label="Disabled" 
                value={bind("standard")} 
                options={bind("options5")}
                disabled
                labelPlacement="material"
            />
            <LookupField 
                label="View only" 
                value={bind("standard")} 
                options={bind("options5")}
                labelPlacement="material"
                mode="view"
                emptyText="N/A"
            />
            <LookupField 
                label="Placeholder" 
                value={bind("placeholder")} 
                options={bind("options5")}
                placeholder="Please select..."
                labelPlacement="material"
            />
            <LookupField 
                label="Icon" 
                value={bind("icon")} 
                options={bind("options5")}
                labelPlacement="material"
                icon="calendar"
            />
        </Section>
        <Section
            mod="card"
            title="Horizontal Labels"
            hLevel={4}
            layout={LabelsLeftLayout}
        >
            <LookupField 
                label="Standard" 
                value={bind("standard")} 
                options={bind("options5")}
            />
            <LookupField 
                label="Disabled" 
                value={bind("standard")} 
                options={bind("options5")}
                disabled
            />
            <LookupField 
                label="View only" 
                value={bind("standard")} 
                options={bind("options5")}
                mode="view"
                emptyText="N/A"
            />
            <LookupField 
                label="Placeholder" 
                value={bind("placeholder")} 
                options={bind("options5")}
                placeholder="Please select..."
            />
            <LookupField 
                label="Icon" 
                value={bind("icon")} 
                options={bind("options5")}
                icon="calendar"
            />
        </Section>
        <Section
            mod="card"
            title="Labels on Top"
            hLevel={4}
            layout={{type: LabelsTopLayout, vertical: true}}
        >
            <LookupField 
                label="Standard" 
                value={bind("standard")} 
                options={bind("options5")}
            />
            <LookupField 
                label="Disabled" 
                value={bind("standard")} 
                options={bind("options5")}
                disabled
            />
            <LookupField 
                label="View only" 
                value={bind("standard")} 
                options={bind("options5")}
                mode="view"
                emptyText="N/A"
            />
            <LookupField 
                label="Placeholder"
                value={bind("placeholder")} 
                options={bind("options5")}
                placeholder="Please select..."
            />
            <LookupField 
                label="Icon" 
                value={bind("icon")} 
                options={bind("options5")}
                icon="calendar"
            />
        </Section>
        <Section
            mod="card"
            layout={LabelsLeftLayout}
            title="Helpers"
            hLevel={4}
        >
            <LookupField
                label="Placeholder"
                value={bind("placeholder")}
                options={bind("options5")}
                placeholder="Please select..."
            />
            <LookupField
                label="Clear"
                value={{ bind: "clear", defaultValue: 0 }}
                options={bind("options5")}
                placeholder="Hidden when empty"
            />
            <LookupField
                label="Icon"
                value={bind("icon")}
                options={bind("options5")}
                icon="search"
            />
            <LookupField
                label="Tooltip"
                value={bind("tooltip")}
                options={bind("options5")}
                tooltip="This is a tooltip."
            />
            <LookupField
                label="Help"
                value={bind("inline")}
                options={bind("options5")}
                help="Inline"
            />
            <LookupField
                label="Help"
                value={bind("block")}
                options={bind("options5")}
                help={<cx>
                    <HelpText mod="block">Block</HelpText>
                </cx>}
            />
        </Section>
        <Section
            mod="card"
            title="Validation"
            hLevel={4}
            layout={LabelsLeftLayout}
        >
            <LookupField 
                value={bind("required")}
                options={bind("options5")}
                label="Required" 
                placeholder="Please select..." 
                required 
            />
            <LookupField 
                value={bind("visited")} 
                options={bind("options5")}
                label="Visited" 
                placeholder="Please select..." 
                required 
                visited
            />
            <LookupField 
                value={bind("asterisk")} 
                options={bind("options5")}
                label="Asterisk" 
                placeholder="Please select..." 
                required 
                asterisk
            />
        </Section>
        <Section
            title="Validation Modes"
            mod="card"
            layout={LabelsLeftLayout}
            hLevel={4}
        >
            <LookupField 
                label="Tooltip" 
                value={bind("validation.tooltip")} 
                options={bind("options5")}
                required
                visited
                placeholder="Please select..." 
            />
            <LookupField 
                label="Help" 
                value={bind("validation.help")} 
                options={bind("options5")}
                required
                visited
                validationMode="help"
                placeholder="Please select..."
            />
            <LookupField 
                label="Help Block" 
                value={bind("validation.block")} 
                options={bind("options5")}
                required
                visited
                validationMode="help-block" 
                placeholder="Please select..." 
            />
            <LookupField 
                label="Material" 
                value={bind("validation.material")} 
                options={bind("options5")}
                required
                visited
                validationMode="help"
                helpPlacement="material"
                visible={{expr: "{$root.$route.theme} == 'material'"}}
                placeholder="Please select..."
            />
        </Section>
        <Section
            mod="card"
            title="Misc"
            hLevel={4}
            layout={LabelsLeftLayout}
            controller={PageController}
        >
            <LookupField 
                value={bind("syled")}
                options={bind("options5")}
                label="Styled"
                style={{background: "rgba(255, 255, 0, 0.3)"}} 
            />
            <LookupField 
                values={bind("syled")}
                options={bind("options10")}
                label="Multiple"
                multiple
            />
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);