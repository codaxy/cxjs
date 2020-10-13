import { Controller } from "cx/ui";
import { LookupField, NumberField, Restate, Slider, TextField } from "cx/widgets";

class PageController extends Controller {
    init() {
        super.init();

        this.store.set('$page.options5', Array.from({ length: 5 }).map((v, i) => ({ id: i, text: `Option ${i + 1}` })));

        this.store.set('$page.options10', Array.from({ length: 10 }).map((v, i) => ({ id: i, text: `Option ${i + 1}` })));
    }

    query(q) {
        //fake data
        if (!this.cityDb)
            this.cityDb = Array.from({ length: 100 }).map((_, i) => ({ id: i, text: casual.city }));

        var regex = new RegExp(q, 'gi');
        return new Promise((resolve) => {
            setTimeout(() => resolve(this.cityDb.filter(x => x.text.match(regex))), 300);
        });
    }
}
export default (
    <cx>
        <div controller={PageController}>
            <LookupField
                label="Select"
                value-bind="$page.s5.id"
                text-bind="$page.s5.text"
                options-bind="$page.options5"
                inputStyle={{border: '1px solid green'}}
                inputClass="test"
                autoFocus
            />
        </div>
    </cx>
)