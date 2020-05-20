import { bind, Restate } from "cx/ui";
import { Tab, TextField } from "cx/widgets";


export default (
    <cx>
        <div style="padding: 20px">
            <p>
                <Tab text="Tab 1" tab="tab1" value-bind="tab" default />
                <Tab text="Tab 2" tab="tab2" value-bind="tab" />
            </p>
            <Restate
                cacheKey-bind="tab"
                // cacheKey="tab1"
                data={{ tab: bind('tab') }} visible-expr="{tab} == 'tab1'">
                <TextField label="Tab 1" value-bind="text" />
            </Restate>
            <Restate
                cacheKey-bind="tab"
                // cacheKey="tab2"
                data={{ tab: bind('tab') }} visible-expr="{tab} == 'tab2'">
                <TextField label="Tab 2" value-bind="text" />
            </Restate>

        </div>
    </cx>
);
