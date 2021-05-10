import { HtmlElement, LookupField, Repeater, PureContainer, TextField, NumberField } from 'cx/widgets';
import { Controller, LabelsTopLayout, UseParentLayout } from 'cx/ui';
import { Md } from '../../../components/Md';
import { CodeSplit } from '../../../components/CodeSplit';
import { CodeSnippet } from '../../../components/CodeSnippet';

import { casual } from '../data/casual';

class PageController extends Controller {

    onQuery({ query, pageSize, page }) {
        //fake database
        if (!this.cityDb) {
            this.cityDb = Array.from({ length: 10000 }).map((_, i) => ({
                id: i,
                text: casual.city
            }));
            this.cityDb.sort((a, b) => a.text.localeCompare(b.text));
        }

        //filtering
        var regex = new RegExp(query, "gi");
        let filteredList = this.cityDb.filter(x => x.text.match(regex));
        let data = filteredList.slice((page - 1) * pageSize, page * pageSize);

        //simulated network latency
        return new Promise(resolve => {
            setTimeout(
                () => resolve(data),
                150
            );
        });
    }
}

export const InfiniteLookupList = <cx>
    <Md controller={PageController}>

        # Infinite Lookup List

        <CodeSplit>

            Sometimes, the list in the lookup is long that it's not possible to load all options and display them at once.
            In that situation, it's best to use the `infinite` flag. When `infinite` is set, the `LookupField` changes the
            behavior slightly. The `onQuery` method receives additional parameters such as `page` and `pageSize`. The
            scroll is monitored so that additional pages are loaded once it reaches near the end.

            Options such as `pageSize`, `queryDelay` and `minQueryLength` can be used to additionally tweak the behavior towards the server.

            <div class="widgets" style="align-items: start">
                <div layout={{ type: LabelsTopLayout, vertical: true }}>
                    <LookupField
                        label="Infinite Lookup List"
                        records:bind="$page.selectedCities"
                        onQuery="onQuery"
                        multiple
                        infinite
                        pageSize={100}
                        queryDelay={200}
                        minQueryLength={2}
                    />
                </div>
            </div>

            <CodeSnippet putInto="code">{`

            class PageController extends Controller {
                onQuery({ query, pageSize, page }) {
                    //fake database
                    if (!this.cityDb) {
                        this.cityDb = Array.from({ length: 10000 }).map((_, i) => ({
                            id: i,
                            text: casual.city
                        }));
                        this.cityDb.sort((a, b) => a.text.localeCompare(b.text));
                    }

                    //filtering
                    var regex = new RegExp(query, "gi");
                    let filteredList = this.cityDb.filter(x => x.text.match(regex));
                    let data = filteredList.slice((page - 1) * pageSize, page * pageSize);

                    //simulated network latency
                    return new Promise(resolve => {
                        setTimeout(
                            () => resolve(data),
                            150
                        );
                    });
                }
            }

            ...

            <LookupField
                label="Infinite Lookup List"
                records:bind="$page.selectedCities"
                onQuery="onQuery"
                multiple
                infinite
                pageSize={100}
                queryDelay={200}
                minQueryLength={2}
            />

            `}</CodeSnippet>
        </CodeSplit>

    </Md>
</cx>
