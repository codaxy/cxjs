import { NumberField, Restate, Slider } from "cx/widgets";

export default (
    <cx>
        <div>
            <Restate
                data={{}}
                controller={{
                    onInit() {
                        let defaultValue = 500;
                        let fieldValue = 2886;
                        let minValue = 500;
                        let maxValue = 2886;
                        this.store.init('fieldValue', defaultValue);
                        this.store.init('fieldValue', fieldValue);
                        this.store.init('minValue', minValue);
                        this.store.init('maxValue', maxValue);
                    },
                }}
            >
                <NumberField
                    value-bind="fieldValue"
                    minValue-bind="minValue"
                    maxValue-bind="maxValue"
                    format="currency;;0"
                    required
                />
                <Slider
                    value-bind="fieldValue"
                    step={500}
                    minValue-bind="minValue"
                    maxValue-bind="maxValue"
                />
                <div>
                    <span text-tpl="min: {minValue:n;;0}" style="margin-left: 180px; font-size: 14px" />
                    <span text-tpl="max: {maxValue:n;;0}" style="margin-left: 100px; font-size:14px" />
                </div>
            </Restate>
        </div>
    </cx>
)