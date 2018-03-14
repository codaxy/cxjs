import {Content, HtmlElement, Checkbox, TextField, Select, Option, Repeater, Text} from 'cx/widgets';
import {Controller} from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';

const formats = {
    "string": {
        alias: 's',
        description: <cx><Md>
            Default format. Convert any value to string using the `toString()` method.
        </Md></cx>
    },
    "number": {
        alias: "n",
        description: <cx><Md>
            Number formatting.

            `n;decimalPrecision`

            `n;minPrecision;maxPrecision`


        </Md></cx>
    }, currency: {
        description: <cx><Md>
            Currency formatting. Formatting is done using the
            [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat)
            class provided
            by the browser. It's required to use a polyfill if your browser doesn't support `Intl` (e.g. older versions of Safari).

            `currency;currencyCode;decimalPrecision`

            `currency;currencyCode;minPrec;maxPrec`
        </Md></cx>
    },
    percentage: {
        alias: 'p',
        description: <cx><Md>
            Percentage. Please note that the given number will be multiplied with 100.
        </Md></cx>
    },
    "percentSign": {
        alias: 'ps',
        description: <cx><Md>
            Percentage sign. Only percentage sign will be appended to the give number.
        </Md></cx>
    },
    "date": {
        alias: 'd',
        description: <cx><Md>
            Short date format.
        </Md></cx>
    },
    "time": {
        alias: 't',
        description: <cx><Md>
            Time of the day formatting.
        </Md></cx>
    },
    "datetime": {
        description: <cx><Md>
            Options are used for custom date formatting.

            `datetime;options`

            Please check out the [intl-io](https://github.com/mstijak/intl-io) project for more info.
        </Md></cx>
    },
    "wrap": {
        description: <cx><Md>
            Wraps the given value with into the provided prefix and suffix strings.

            `wrap;prefix;suffix`
        </Md></cx>
    },
    "prefix": {
        description: <cx><Md>
            Prefixes the given value with the provided text.

            `prefix;text`
        </Md></cx>
    },
    "suffix": {
        description: <cx><Md>
            Appends the provided text to the given value.

            `suffix;text`
        </Md></cx>
    },
    "lowercase": {
        description: <cx><Md>
            Converts text to the lower case.
        </Md></cx>
    },
    "uppercase": {
        description: <cx><Md>
            Converts text to the upper case.
        </Md></cx>
    },
    "urlencode": {
        description: <cx><Md>
            Encodes the given value using the `encodeURIComponent` function. Useful in URL templates.
        </Md></cx>
    },
    "ellipsis": {
        description: <cx><Md>
            Shortens long texts.

            `ellipsis;maxLength;position`

            `position` defines ellipsis position and can be either `start`, `end` or `middle`. Default position is `end`.
        </Md></cx>
    },
};

export const Formatting = <cx>

    <Md>
        # Formatting

        <ImportPath path="import { Format } from 'cx/util';"/>

        Cx offers rich support for value formatting.

        You may use `Format.value(value, format)` function to format single values.

        Formats are supported in data expressions and string templates.

        ### Formatting Rules

        <CodeSplit>
            Use `;` to delimit format parameters.

            Use `:` to use chain multiple formats. Formats are applied from left to right.

            Use `|` to provide null text; Default null text is empty string.

            <CodeSnippet putInto="code">{`
                //single value
                Format.value(2, 'n;2'); //"2.00"

                //string template
                StringTemplate.format('Date: {0:d}', new Date('2016-9-2')); //"Date: 9/2/2016"

                //string template assigned to a widget property
                <span text:tpl="{person.height:suffix; cm|N/A}" />

                //multiple formats
                Format.value(5, 'n;2:wrap;(;)'); //"(5.00)"
                Format.value(null, 'n;2:wrap;(;)'); //""

                //null
                Format.value(null, 'n;2:wrap;(;)|N/A'); //"N/A"
            `}</CodeSnippet>

            ### Format Specifiers

            <ConfigTable props={formats} sort={false} hideType header="Specifier"/>
        </CodeSplit>

        ### Culture Sensitive Formatting
        <ImportPath path="import { enableCultureSensitiveFormatting() } from 'cx/ui';"/>

        Date, currency and number formats are dependent on an external library and must be enabled
        before use. This is slightly inconvenient but ensures small bundle sizes for applications that do
        not use this feature.

        <CodeSplit>
            <CodeSnippet>
                enableCultureSensitiveFormatting();
            </CodeSnippet>
        </CodeSplit>

        ### Custom Formats

        Custom formats may be defined using `Format.register` and `Format.registerFactory` methods.

        <CodeSplit>
            `Format.register` can be used to register formats which do not need any parameters.

            <CodeSnippet putInto="code">{`
                Format.register('brackets', value => \`(\$\{value\})\`);
                Format.value('test', 'brackets'); //'(test)'
            `}</CodeSnippet>
        </CodeSplit>

        <CodeSplit>
            `Format.registerFactory` can be used to define formats which take parameters.

            <CodeSnippet putInto="code">{`
                Format.registerFactory('suffix', (format, suffix) => value => value.toString() + suffix);
                Format.value(10, 'suffix; kg'); //'10 kg'
            `}</CodeSnippet>
        </CodeSplit>
    </Md>

</cx>;

