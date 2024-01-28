import { NumberField, DateField, Calendar, Tab, FlexCol, LookupField, FlexRow } from 'cx/widgets';
import { Culture, Controller, Content, LabelsLeftLayout } from 'cx/ui';
import { Md } from '../../components/Md';
import { CodeSplit } from '../../components/CodeSplit';
import { CodeSnippet } from '../../components/CodeSnippet';
import { ImportPath } from "../../components/ImportPath";
import { MethodTable } from "../../components/MethodTable";

function loadCulture(culture) {
    // Code-splitting - it's mandatory to use string
    // constants so webpack can know how to prepare packages
    switch (culture) {
        case 'de-de':
            return import('cx/locale/de-de');
        case 'es-es':
            return import('cx/locale/es-es');
        case 'fr-fr':
            return import('cx/locale/fr-fr');
        case 'nl-nl':
            return import('cx/locale/nl-nl');
        case 'pt-pt':
            return import('cx/locale/pt-pt');
        case 'sr-latn-ba':
            return import('cx/locale/sr-latn-ba');
        default:
        case 'en-us':
            return import('cx/locale/en-us');
    }
}

function setCulture(culture, store) {
    loadCulture(culture)
        .then(() => {
            Culture.setCulture(culture);
            store.notify(); // Force re-render
        });
}

function setCurrency(currencyCode, store) {
    Culture.setDefaultCurrency(currencyCode);
    store.notify(); // Force re-render
}

class PageController extends Controller {
    onInit() {
        this.store.init('$page.number', 123456.78);
        this.store.init('$page.date', new Date().toISOString());

        // Cultures
        this.store.set("$page.cultures", [
            { id: 0, text: 'DE-DE' }, { id: 1, text: 'EN-US' }, { id: 2, text: 'ES-ES' },
            { id: 3, text: 'FR-FR' }, { id: 4, text: 'NL-NL' }, { id: 5, text: 'PT-PT' },
            { id: 6, text: 'SR-LATN-BA' }
        ]);
        this.store.set("$page.culture", { id: 1, text: 'EN-US' });
        this.addTrigger("change-culture", ["$page.culture.text"], (text) =>
            setCulture(text.toLowerCase(), this.store)
        );

        // Currencies
        this.store.set("$page.currencies", [
            { id: 0, text: 'EUR' }, { id: 1, text: 'USD' },
            { id: 2, text: 'GBP' }, { id: 3, text: 'BAM' }
        ]);
        this.store.set("$page.currency", { id: 1, text: 'USD' });
        this.addTrigger("change-currency", ["$page.currency.text"], (text) =>
            setCurrency(text, this.store)
        );
    }
}

export const LocalizationPage = <cx>
    <Md>
        <CodeSplit>
            # Localization

            Cx supports different culture-specific number, currency and date formatting based on `Intl` helpers
            provided by modern browsers. Besides that, Cx offers translation of standard messages to any language.

            <div class="widgets" controller={PageController}>
                <FlexCol vspacing="large">
                    <LabelsLeftLayout>
                        <LookupField
                            label="Select a culture:"
                            value-bind="$page.culture.id"
                            text-bind="$page.culture.text"
                            options-bind="$page.cultures"
                            required
                        />
                        <LookupField
                            label="Select a currency:"
                            value-bind="$page.currency.id"
                            text-bind="$page.currency.text"
                            options-bind="$page.currencies"
                            required
                        />
                    </LabelsLeftLayout>
                    <FlexCol vspacing="medium" align="center">
                        <FlexRow hspacing="xlarge">
                            <FlexCol vspacing="medium">
                                <NumberField value-bind="$page.number" required />
                                <NumberField value-bind="$page.number" required format="currency" />
                                <DateField value-bind="$page.date" required readOnly />
                            </FlexCol>
                            <Calendar value-bind="$page.date" />
                        </FlexRow>
                    </FlexCol>
                </FlexCol>
            </div>

            <Content name="code">
                <Tab value-bind="$page.code1.tab" mod="code" tab="controller" text="Controller" default />
                <Tab value-bind="$page.code1.tab" mod="code" tab="widget" text="Widget" />

                <CodeSnippet visible-expr="{$page.code1.tab}=='controller'">{`
                    function loadCulture(culture) {
                        // Code-splitting - it's mandatory to use string
                        // constants so webpack can know how to prepare packages
                        switch (culture) {
                            case 'de-de':
                                return import('cx/locale/de-de');
                            case 'es-es':
                                return import('cx/locale/es-es');
                            case 'fr-fr':
                                return import('cx/locale/fr-fr');
                            case 'nl-nl':
                                return import('cx/locale/nl-nl');
                            case 'pt-pt':
                                return import('cx/locale/pt-pt');
                            case 'sr-latn-ba':
                                return import('cx/locale/sr-latn-ba');
                            default:
                            case 'en-us':
                                return import('cx/locale/en-us');
                        }
                    }

                    function setCulture(culture, store) {
                        loadCulture(culture)
                            .then(() => {
                                Culture.setCulture(culture);
                                store.notify(); // Force re-render
                            });
                    }

                    function setCurrency(currencyCode, store) {
                        Culture.setDefaultCurrency(currencyCode);
                        store.notify(); // Force re-render
                    }

                    class PageController extends Controller {
                        onInit() {
                            this.store.init('$page.number', 123456.78);
                            this.store.init('$page.date', new Date().toISOString());

                            // Cultures
                            this.store.set("$page.cultures", [
                                { id: 0, text: 'DE-DE' }, { id: 1, text: 'EN-US' }, { id: 2, text: 'ES-ES' },
                                { id: 3, text: 'FR-FR' }, { id: 4, text: 'NL-NL' }, { id: 5, text: 'PT-PT' },
                                { id: 6, text: 'SR-LATN-BA' }
                            ]);
                            this.store.set("$page.culture", { id: 1, text: 'EN-US' });
                            this.addTrigger("change-culture", ["$page.culture.text"], (text) =>
                                setCulture(text.toLowerCase(), this.store)
                            );

                            // Currencies
                            this.store.set("$page.currencies", [
                                { id: 0, text: 'EUR' }, { id: 1, text: 'USD' },
                                { id: 2, text: 'GBP' }, { id: 3, text: 'BAM' }
                            ]);
                            this.store.set("$page.currency", { id: 1, text: 'USD' });
                            this.addTrigger("change-currency", ["$page.currency.text"], (text) =>
                                setCurrency(text, this.store)
                            );
                        }
                    }
                `}</CodeSnippet>
                <CodeSnippet visible-expr="{$page.code1.tab}=='widget'">{`
                    <div class="widgets" controller={PageController}>
                        <FlexCol vspacing="large">
                            <LabelsLeftLayout>
                                <LookupField
                                    label="Select a culture:"
                                    value-bind="$page.culture.id"
                                    text-bind="$page.culture.text"
                                    options-bind="$page.cultures"
                                    required
                                />
                                <LookupField
                                    label="Select a currency:"
                                    value-bind="$page.currency.id"
                                    text-bind="$page.currency.text"
                                    options-bind="$page.currencies"
                                    required
                                />
                            </LabelsLeftLayout>
                            <FlexCol vspacing="medium" align="center">
                                <FlexRow hspacing="xlarge">
                                    <FlexCol vspacing="medium">
                                        <NumberField value-bind="$page.number" required />
                                        <NumberField value-bind="$page.number" required format="currency" />
                                        <DateField value-bind="$page.date" required readOnly />
                                    </FlexCol>
                                    <Calendar value-bind="$page.date" />
                                </FlexRow>
                            </FlexCol>
                        </FlexCol>
                    </div>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## Culture
        <ImportPath path="import { Culture } from 'cx/ui';" />

        The `Culture` object provides methods for selecting UI cultures used for formatting and localizing
        messages. It is even possible to combine different cultures at the same time, one for number
        formatting and another for datetime formatting, using the methods described below.

        <CodeSplit>
            <MethodTable methods={[{
                key: true,
                signature: 'Culture.setCulture(cultureCode)',
                description: <cx><Md>
                    Sets the current culture. Read more about available culture
                    codes [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).
                </Md></cx>
            }, {
                key: true,
                signature: 'Culture.setDefaultCurrency(currencyCode)',
                description: <cx><Md>
                    Sets the default currency, which is otherwise `USD` by default. Read
                    more about currencies [here](https://en.wikipedia.org/wiki/ISO_4217).
                </Md></cx>
            }, {
                key: true,
                signature: 'Culture.setNumberCulture(cultureCode)',
                description: <cx><Md>
                    Sets the number culture. Read more about available culture
                    codes [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).
                </Md></cx>
            }, {
                key: true,
                signature: 'Culture.setDateTimeCulture(cultureCode)',
                description: <cx><Md>
                    Sets the datetime culture. Read more about available culture
                    codes [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).
                </Md></cx>
            }, {
                signature: 'Culture.getDefaultDateEncoding()',
                description: <cx><Md>
                    Returns a function that is used to encode dates.
                    That function expects a Date and returns a string or a number.
                </Md></cx>
            }, {
                signature: 'Culture.setDefaultDateEncoding(encoding)',
                description: <cx><Md>
                    Sets the function that will be used to encode dates for DateField, Calendar
                    and other date/time related widgets. The default encoding simply invokes the
                    `toISOString` method which converts local time into UTC time.
                    Pass `encodeDateWithTimezoneOffset` to format dates in ISO 8601 format with
                    timezone information preserved.

                    `Culture.setDefaultDateEncoding(encodeDateWithTimezoneOffset);`
                </Md></cx>
            }]} />
        </CodeSplit>

        ## Localization
        <ImportPath path="import { Localization } from 'cx/ui';" />

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
            }]} />

            <CodeSnippet putInto="code" copy={false}>{`
                // Register widget for localization
                Localization.registerPrototype('cx/widgets/TextField', TextField);

                // Localize widget
                Localization.localize('de', 'cx/widgets/TextField', {
                   validationErrorText: 'Ungültige Eingabe.',
                   minLengthValidationErrorText: 'Bitte tragen Sie noch {[{0}-{1}]} Zeichen ein.',
                   maxLengthValidationErrorText: 'Benutzen Sie {0} oder weniger Zeichen.'
                });
            `}</CodeSnippet>
        </CodeSplit>
    </Md>
</cx>
