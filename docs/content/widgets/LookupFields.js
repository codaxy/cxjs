import { HtmlElement, Repeater, LookupField } from 'cx/widgets';
import { Content, Controller, LabelsLeftLayout } from 'cx/ui';
import { Md } from '../../components/Md';
import { CodeSplit } from '../../components/CodeSplit';
import { CodeSnippet } from '../../components/CodeSnippet';
import { ConfigTable } from '../../components/ConfigTable';
import { ImportPath } from '../../components/ImportPath';

import { casual } from '../examples/data/casual';

import configs from './configs/LookupField';

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

export const LookupFields = <cx>
    <Md>
        <CodeSplit>

            # LookupField

            <ImportPath path="import {LookupField} from 'cx/widgets';" />

            The `LookupField` control offers selection from a list of available options.
            It is very similar to the well-known HTML `select` element, however it offers a few additional
            features such as:

            * Searching the list
            * Querying remote data
            * User-friendly multiple selection mode

            Most of these features were implemented following the excellent [select2 jQuery
            plugin](https://select2.github.io/).

            <div class="widgets" controller={PageController}>
                <div layout={LabelsLeftLayout}>
                    <LookupField
                        label="Select"
                        value:bind="$page.s5.id"
                        text:bind="$page.s5.text"
                        options:bind="$page.options5"
                        autoFocus
                    />
                    <LookupField
                        label="MultiSelect"
                        records:bind="$page.s10"
                        options:bind="$page.options10"
                        multiple />
                    <LookupField
                        label="Records"
                        values:bind="$page.s10ids"
                        options:bind="$page.options10"
                        multiple />
                </div>
                <div layout={LabelsLeftLayout}>
                    <LookupField
                        label="Remote Data"
                        records:bind="$page.selectedCities"
                        onQuery="query"
                        minQueryLength={2}
                        multiple />
                    <LookupField
                        label="Local Filter"
                        records:bind="$page.selectedCities2"
                        onQuery="query"
                        fetchAll
                        cacheAll
                        multiple
                        closeOnSelect={false} />
                    <LookupField
                        label="Icon"
                        value:bind="$page.s5.id"
                        text:bind="$page.s5.text"
                        icon="pencil"
                        options:bind="$page.options5" />
                </div>
            </div>

            Sometimes, available options are known or immediately available. In that case, it's enough to pass
            `options` to the control and search is done in the browser. This mode is similar to the functionality of
            the native `select` HTML element, because available options appear instantly. When there are just a few options,
            the search field is automatically hidden.

            Another, very common use case is when available options need to be fetched from the server.
            To achieve that, it's required to implement an `onQuery` callback for the widget.
            The result of the callback should be a list of options or a `Promise` which resolves the list.

            It's important to remember how to properly bind data to the `LookupField` widget. If `multiple` option is
            not specified (single selection mode), then it's required to bind `value` and `text` properties.

            In multiple selection mode, it's necessary to bind the `records` or `values` property. The `records`
            property will hold a list of the selected values.
            By default, only `id` and `text` properties are copied from the option to the selection;
            however, it's possible to provide a list of `bindings` which describes the mapping between options and value
            fields.

            The following table shows valid property combinations in different modes.

            <table style={{ width: '100%', textAlign: 'center' }}>
                <tbody>
                    <tr>
                        <th>Selection/Mode</th>
                        <th>Local (options)</th>
                        <th>Remote (onQuery)</th>
                    </tr>
                    <tr>
                        <td>Single</td>
                        <td><code>value</code> and/or <code>text</code></td>
                        <td><code>value</code> and <code>text</code></td>
                    </tr>
                    <tr>
                        <td>Multiple</td>
                        <td><code>values</code> and/or <code>records</code></td>
                        <td><code>records</code></td>
                    </tr>
                </tbody>
            </table>

            <CodeSnippet putInto="code" fiddle="y9CHlIUn">{`
            class PageController extends Controller {
                init() {
                   super.init();

                   this.store.set('$page.options5', Array.from({length: 5}).map((v, i)=>({ id: i, text: \`Option \${i+1}\`})));

                   this.store.set('$page.options10', Array.from({length: 10}).map((v, i)=>({ id: i, text: \`Option \${i+1}\`})));
                }

                query(q) {
                   //fake data
                   if (!this.cityDb)
                      this.cityDb = Array.from({ length: 100 }).map((_, i) => ({ id: i, text: casual.city }));

                   var regex = new RegExp(q, 'gi');
                   return new Promise((resolve) => {
                      setTimeout(()=> resolve(this.cityDb.filter(x=>x.text.match(regex))), 300);
                   });
                }
             }
             ...
            <div class="widgets" controller={PageController}>
                <div layout={LabelsLeftLayout}>
                    <LookupField
                        label="Select"
                        value:bind="$page.s5.id"
                        text:bind="$page.s5.text"
                        options:bind="$page.options5"
                        autoFocus
                    />
                    <LookupField
                        label="MultiSelect"
                        records:bind="$page.s10"
                        options:bind="$page.options10"
                        multiple/>
                    <LookupField
                        label="Records"
                        values:bind="$page.s10ids"
                        options:bind="$page.options10"
                        multiple/>
                </div>
                <div layout={LabelsLeftLayout}>
                    <LookupField
                        label="Remote Data"
                        records:bind="$page.selectedCities"
                        onQuery="query"
                        minQueryLength={2}
                        multiple/>
                    <LookupField
                        label="Local Filter"
                        records:bind="$page.selectedCities2"
                        onQuery="query"
                        fetchAll
                        cacheAll
                        multiple
                        icon="filter"
                        closeOnSelect={false} />
                    <LookupField
                        label="Icon"
                        value:bind="$page.s5.id"
                        text:bind="$page.s5.text"
                        icon="pencil"
                        options:bind="$page.options5"/>
                </div>
            </div>
            `}</CodeSnippet>

        </CodeSplit>

        ## Examples:

        - [Custom bindings](~/examples/form/custom-lookup-bindings) *- for passing additional options to the selection*
        - [Infinite lists](~/examples/form/infinite-lookup-list) *- for lookups with large number of options*

        ## Configuration

        <ConfigTable props={configs} />

    </Md>
</cx>
