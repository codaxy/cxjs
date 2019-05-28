import { HtmlElement, Button, NumberField, DateField, Calendar } from 'cx/widgets';
import { Culture, Controller, LabelsLeftLayout } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from "../../components/ImportPath";
import {MethodTable} from "../../components/MethodTable";

function loadCulture(culture) {
    //code-splitting - it's mandatory to use string constants so webpack can know how to prepare packages
    switch (culture) {
        case 'de-de':
            return import('cx/locale/de-de');
        case 'nl-nl':
            return import('cx/locale/nl-nl');
        default:
        case 'en-us':
            return import('cx/locale/en-us');
    }
}

function setCulture(culture, store) {
    loadCulture(culture)
        .then(() => {
            Culture.setCulture(culture);
            store.notify();//force re-render
        });
}

class PageController extends Controller {
    init() {
        super.init();

        this.store.init('$page.number', 123456.78);
        this.store.init('$page.date', new Date().toISOString());
    }
}

export const LocalizationPage = <cx>
    <Md>
        <CodeSplit>

            # Localization

            Cx support different culture specific number, currency and date formatting based on `Intl` helpers provided
            by modern browsers. Besides that, Cx offers translation of standard messages to any language.

            <div class="widgets" controller={PageController}>
                <div preserveWhitespace>
                    <Button onClick={(e, {store}) => {setCulture('de-de', store)}}>de-de</Button>
                    <Button onClick={(e, { store }) => { setCulture('nl-nl', store) }}>nl-nl</Button>
                    <Button onClick={(e, {store}) => {setCulture('en-us', store)}}>en-us</Button>
                </div>
                <div layout={LabelsLeftLayout}>
                    <NumberField value:bind="$page.number" required />
                    <DateField value:bind="$page.date" required />
                    <NumberField value:bind="$page.number" required format="currency"/>
                    <Calendar value:bind="$page.date" />
                </div>
            </div>

            <CodeSnippet putInto="code">{`
            function loadCulture(culture) {
                //code-splitting - it's mandatory to use string constants so webpack can know how to prepare packages
                switch (culture) {
                    case 'de-de':
                        return import('cx/locale/de-de');

                    default:
                    case 'en-us':
                        return import('cx/locale/en-us');
                }
            }

            function setCulture(culture, store) {
                loadCulture(culture)
                    .then(() => {
                        Culture.setCulture(culture);
                        store.notify();//force re-render
                    });
            }

            class PageController extends Controller {
                init() {
                    super.init();

                    this.store.init('$page.number', 123456.78);
                    this.store.init('$page.date', new Date().toISOString());
                }
            }
            ...
            <div class="widgets" controller={PageController}>
                <div preserveWhitespace>
                    <Button onClick={(e, {store}) => {setCulture('de-de', store)}}>de-de</Button>
                    <Button onClick={(e, {store}) => {setCulture('en-us', store)}}>en-us</Button>
                </div>
                <div layout={LabelsLeftLayout}>
                    <NumberField value:bind="$page.number" required />
                    <DateField value:bind="$page.date" required />
                    <NumberField value:bind="$page.number" required format="currency"/>
                    <Calendar value:bind="$page.date" />
                </div>
            </div>
            `}</CodeSnippet>
        </CodeSplit>

        ## Culture
        <ImportPath path="import {Culture} from 'cx/ui';"/>

        The `Culture` object provides methods for selecting a UI culture used for formatting and localizing messages.

        <CodeSplit>
            <MethodTable methods={[{
                signature: 'Culture.setCulture(cultureCode)',
                description: <cx><Md>
                    Sets the current culture. Read more about available culture
                    codes [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).
                </Md></cx>
            }, {
                signature: 'Culture.setDefaultCurrency(currencyCode)',
                description: <cx><Md>
                    Sets default currency, which is otherwise `USD`.
                    https://en.wikipedia.org/wiki/ISO_4217
                </Md></cx>
            }, {
                signature: 'Culture.getDefaultDateEncoding()',
                description: <cx><Md>
                    Returns a function that is used to encode dates.
                    The function expects a Date and returns a string or a number;
                </Md></cx>
            }, {
                signature: 'Culture.setDefaultDateEncoding(encoding)',
                description: <cx><Md>
                    Sets the function that will be used to encode dates for DateField, Calendar and other date/time related widgets.
                    The default encoding simply invokes the `toISOString` method which converts local time into UTC time.
                    Pass `encodeDateWithTimezoneOffset` to format dates in ISO 8601 format with timezone information preserved.

                    `Culture.setDefaultDateEncoding(encodeDateWithTimezoneOffset);`
                </Md></cx>
            }]}/>
        </CodeSplit>

        ## Localization
        <ImportPath path="import {Localization} from 'cx/ui';"/>

        The `Localization` object offers methods for providing errors messages and other texts that appear in widgets
        in different languages.

        <CodeSplit>
            <MethodTable methods={[{
                signature: 'Localization.registerPrototype(name, componentType)',
                description: <cx><Md>
                    Registers component type for localization.
                </Md></cx>
            }, {
                signature: 'Localization.localize(cultureCode, name, values)',
                description: <cx><Md>
                    Override prototype properties for a given culture and component name.
                </Md></cx>
            }, {
                signature: 'Localization.override(name, values)',
                description: <cx><Md>
                    Override prototype properties for a given component name. Used for changing defaults and
                    theme adjustments.
                </Md></cx>
            }]}/>


            <CodeSnippet putInto="code">{`
                //register widget for localization
                Localization.registerPrototype('cx/widgets/TextField', TextField);

                //localize widget
                Localization.localize('de', 'cx/widgets/TextField', {
                   validationErrorText: 'Ungültige Eingabe.',
                   minLengthValidationErrorText: 'Bitte tragen Sie noch {[{0}-{1}]} Zeichen ein.',
                   maxLengthValidationErrorText: 'Benutzen Sie {0} oder weniger Zeichen.'
                });
            `}</CodeSnippet>
        </CodeSplit>
    </Md>
</cx>
