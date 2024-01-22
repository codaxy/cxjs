import { Button, NumberField, DateField, Calendar, Tab, FlexRow, FlexCol } from 'cx/widgets';
import { Culture, Controller, Content } from 'cx/ui';
import { Md } from '../../components/Md';
import { CodeSplit } from '../../components/CodeSplit';
import { CodeSnippet } from '../../components/CodeSnippet';
import { ImportPath } from "../../components/ImportPath";
import { MethodTable } from "../../components/MethodTable";

function loadCulture(culture) {
    // Code-splitting - it's mandatory to use string constants so webpack can know how to prepare packages
    switch (culture) {
        case 'de-de':
            return import('cx/locale/de-de');
        case 'nl-nl':
            return import('cx/locale/nl-nl');
        case 'sr-latn-ba':
            return import('cx/locale/sr-latn-ba');
        default:
        case 'en-us':
            return import('cx/locale/en-us');
    }
}

function setCulture(culture, store) {
    store.set('$page.culture', culture);
    loadCulture(culture)
        .then(() => {
            Culture.setCulture(culture);
            store.notify(); // Force re-render
        });
}

class PageController extends Controller {
    onInit() {
        this.store.init('$page.number', 123456.78);
        this.store.init('$page.date', new Date().toISOString());
        this.store.init('$page.culture', 'en-us');
    }
}

export const LocalizationPage = <cx>
    <Md>
        <CodeSplit>

            # Localization

            Cx support different culture specific number, currency and date formatting based on `Intl` helpers provided
            by modern browsers. Besides that, Cx offers translation of standard messages to any language.

            <div class="widgets" controller={PageController}>
                <FlexCol vspacing="xlarge">
                    <FlexRow hspacing="small">
                        <Button
                            pressed:expr="{$page.culture} === 'de-de'"
                            onClick={(_e, { store }) => {
                                setCulture('de-de', store);
                            }}
                            text="de-de"
                        />
                        <Button
                            pressed:expr="{$page.culture} === 'nl-nl'"
                            onClick={(_e, { store }) => {
                                setCulture('nl-nl', store);
                            }}
                            text="nl-nl"
                        />
                        <Button
                            pressed:expr="{$page.culture} === 'en-us'"
                            onClick={(_e, { store }) => {
                                setCulture('en-us', store);
                            }}
                            text="en-us"
                        />
                        <Button
                            pressed:expr="{$page.culture} === 'sr-latn-ba'"
                            onClick={(_e, { store }) => {
                                setCulture('sr-latn-ba', store);
                            }}
                            text="sr-ba"
                        />
                    </FlexRow>
                    <FlexCol vspacing="medium" align="center">
                        <NumberField value-bind="$page.number" required />
                        <NumberField value-bind="$page.number" required format="currency" />
                        <DateField value-bind="$page.date" required readOnly />
                        <Calendar value-bind="$page.date" />
                    </FlexCol>
                </FlexCol>
            </div>
            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="controller" text="Controller" default />
                <Tab value-bind="$page.code.tab" mod="code" tab="widget" text="Widget" />
                <CodeSnippet visible-expr="{$page.code.tab}=='controller'">{`
                    function loadCulture(culture) {
                        switch (culture) {
                            case 'de-de':
                                return import('cx/locale/de-de');
                            default:
                            case 'en-us':
                                return import('cx/locale/en-us');
                        }
                    }

                    function setCulture(culture, store) {
                        store.set('$page.culture', culture);
                        loadCulture(culture)
                            .then(() => {
                                Culture.setCulture(culture);
                                store.notify(); // Force re-render
                            });
                    }

                    class PageController extends Controller {
                        onInit() {
                            this.store.init('$page.number', 123456.78);
                            this.store.init('$page.date', new Date().toISOString());
                            this.store.init('$page.culture', 'en-us');
                        }
                    }
                `}</CodeSnippet>
                <CodeSnippet visible-expr="{$page.code.tab}=='widget'">{`
                    <div class="widgets" controller={PageController}>
                        <FlexCol vspacing="xlarge">
                            <FlexRow hspacing="small">
                                <Button
                                    pressed:expr="{$page.culture} === 'de-de'"
                                    onClick={(_e, { store }) => {
                                        setCulture('de-de', store);
                                    }}
                                    text="de-de"
                                />
                                <Button
                                    pressed:expr="{$page.culture} === 'nl-nl'"
                                    onClick={(_e, { store }) => {
                                        setCulture('nl-nl', store);
                                    }}
                                    text="nl-nl"
                                />
                                <Button
                                    pressed:expr="{$page.culture} === 'en-us'"
                                    onClick={(_e, { store }) => {
                                        setCulture('en-us', store);
                                    }}
                                    text="en-us"
                                />
                                <Button
                                    pressed:expr="{$page.culture} === 'sr-latn-ba'"
                                    onClick={(_e, { store }) => {
                                        setCulture('sr-latn-ba', store);
                                    }}
                                    text="sr-ba"
                                />
                            </FlexRow>
                            <FlexCol vspacing="medium" align="center">
                                <NumberField value-bind="$page.number" required />
                                <NumberField value-bind="$page.number" required format="currency" />
                                <DateField value-bind="$page.date" required readOnly />
                                <Calendar value-bind="$page.date" />
                            </FlexCol>
                        </FlexCol>
                    </div>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## Culture
        <ImportPath path="import {Culture} from 'cx/ui';" />

        The `Culture` object provides methods for selecting UI cultures used for formatting and localizing messages.

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
                    Sets the default currency, which is otherwise `USD` by default.
                    https://en.wikipedia.org/wiki/ISO_4217
                </Md></cx>
            }, {
                signature: 'Culture.setNumberCulture(cultureCode)',
                description: <cx><Md>
                    Sets the number culture. Read more about available culture
                    codes [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).
                </Md></cx>
            }, {
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
                    Sets the function that will be used to encode dates for DateField, Calendar and other date/time related widgets.
                    The default encoding simply invokes the `toISOString` method which converts local time into UTC time.
                    Pass `encodeDateWithTimezoneOffset` to format dates in ISO 8601 format with timezone information preserved.

                    `Culture.setDefaultDateEncoding(encodeDateWithTimezoneOffset);`
                </Md></cx>
            }]} />
        </CodeSplit>

        ## Localization
        <ImportPath path="import {Localization} from 'cx/ui';" />

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
