import { Controller, LabelsLeftLayout } from "cx/ui";
import { HtmlElement, LookupField, TextField, Checkbox, Button, Repeater } from "cx/widgets";
import { casual } from "../casual"

class PageController extends Controller {
    onQuery({ query, pageSize, page }, instance) {
        let count = this.store.get("$page.queryExecuted") ?? 0;
        this.store.set("$page.queryExecuted", count + 1);
        console.log(count + " count")
        if (!this.cityDb) {
            this.cityDb = Array.from({ length: 100000 }).map((_, i) => ({
                id: i,
                text: casual.city
            }));
            this.cityDb.sort((a, b) => a.text.localeCompare(b.text));
        }
        var regex = new RegExp(query, "gi");
        let filteredList = this.cityDb.filter(x => x.text.match(regex));
        return new Promise(resolve => {
            setTimeout(() => {
                if (instance.widget.fetchAll) {
                    // return all filtered data at once
                    resolve(filteredList);
                } else {
                    // return paginated data
                    let data = filteredList.slice((page - 1) * pageSize, page * pageSize);
                    resolve(data);
                }
            }, 100);
        });
    }
}

export default (
    <cx>
        <div class="widgets" controller={PageController}>

            <div layout={LabelsLeftLayout}>
                <TextField
                    value:bind="$page.queryExecuted"
                    label="Query has been executed"
                    readOnly
                />
                <LookupField
                    records:bind="$page.selectedItems1"
                    label="Infinite Lookup and fetch all"
                    onQuery="onQuery"
                    infinite
                    fetchAll
                    multiple
                />
                <LookupField
                    records:bind="$page.selectedItems2"
                    label="Infinite Lookup"
                    onQuery="onQuery"
                    infinite
                    multiple
                />
                <LookupField
                    records:bind="$page.selectedItems3"
                    label="Fetch all"
                    onQuery="onQuery"
                    fetchAll
                    multiple
                />
                <LookupField
                    records:bind="$page.selectedItems4"
                    label="Fetch all, infinite scroll and cache all"
                    onQuery="onQuery"
                    infinite
                    fetchAll
                    cacheAll
                    multiple
                />
            </div>
        </div>
    </cx>
);
