import { Button } from "cx/widgets";
import { enableTooltips } from "cx/widgets";
enableTooltips();

export default (
    <cx>
        <div style="margin: 25px;">
            <Button
                disabled-bind="isDisabled"
                onClick={(e, { store }) => {
                    store.toggle('isDisabled');
                }}
                text-expr="{isDisabled} ? 'Disabled' : 'Enabled'"
                tooltip="This is a tooltip"
            />
        </div>
    </cx>
)