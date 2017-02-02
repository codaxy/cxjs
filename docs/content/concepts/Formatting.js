import { Content, HtmlElement, Checkbox, TextField, Select, Option, Repeater, Text } from 'cx/widgets';
import { Controller } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {MethodTable} from '../../components/MethodTable';
import {ImportPath} from '../../components/ImportPath';

const formats = [{
    signature: <cx><Md>
        string

        s
    </Md></cx>,
    description: <cx><Md>
        Default format. Convert any value to string using the `toString()` method.
    </Md></cx>
}, {
    signature: <cx><Md>
        number

        n

        n;decimalPrecision

        n;minPrecision;maxPrecision
    </Md></cx>,
    description: <cx><Md>
        Number formatting.
    </Md></cx>
}, {
    signature: <cx><Md>
        currency,

        currency;currencyCode;decimalPrecision

        currency;currencyCode;minPrec;maxPrec
    </Md></cx>,
    description: <cx><Md>
        Currency formatting. Formatting is done using the
        [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat) class provided
        by the browser. It's required to use a polyfill if your browser doesn't support `Intl` (Safari).
    </Md></cx>
}, {
    signature: <cx><Md>
        percentage

        p
    </Md></cx>,
    description: <cx><Md>
        Percentage. Please note that the given number will be multiplied with 100.
    </Md></cx>
}, {
    signature: <cx><Md>
        percentSign

        ps
    </Md></cx>,
    description: <cx><Md>
        Percentage sign. Only percentage sign will be appended to the give number.
    </Md></cx>
}, {
    signature: <cx><Md>
        date

        d
    </Md></cx>,
    description: <cx><Md>
        Short date format.
    </Md></cx>
}, {
    signature: <cx><Md>
        time

        t
    </Md></cx>,
    description: <cx><Md>
        Time of the day formatting.
    </Md></cx>
}, {
    signature: <cx><Md>
        datetime

        datetime;options
    </Md></cx>,
    description: <cx><Md>
        Options are used for custom date formatting.
        Please check out the [intl-io](https://github.com/mstijak/intl-io) project for more info.
    </Md></cx>
}, {
    signature: <cx><Md>
        wrap;prefix;suffix
    </Md></cx>,
    description: <cx><Md>
        Wraps the given value with into the provided prefix and suffix strings.
    </Md></cx>
}, {
    signature: <cx><Md>
        prefix;text
    </Md></cx>,
    description: <cx><Md>
        Prefixes the given value with the provided text.
    </Md></cx>
}, {
    signature: <cx><Md>
        suffix;text
    </Md></cx>,
    description: <cx><Md>
        Appends the provided text to the given value.
    </Md></cx>
}, {
    signature: <cx><Md>
        lowercase
    </Md></cx>,
    description: <cx><Md>
        Converts text to the lower case.
    </Md></cx>
}, {
    signature: <cx><Md>
        uppercase
    </Md></cx>,
    description: <cx><Md>
        Converts text to the upper case.
    </Md></cx>
}, {
    signature: <cx><Md>
        urlencode
    </Md></cx>,
    description: <cx><Md>
        Encodes the given value using the `encodeURIComponent` function. Useful in URL templates.
    </Md></cx>
}];

export const Formatting = <cx>

    <Md>
        <CodeSplit>
            # Formatting

            <ImportPath path="import { Format } from 'cx/util';" />

            Cx offers rich support for value formatting. Formats are supported in data expressions and string templates.

            You may use `Format.value(value, format)` function to format single values.

            Use `;` to delimit format parameters.

            Use `:` to use chain multiple formats. Formats are applied left to right.

            Use `|` to provide null text; Default null text is empty string.

            <CodeSnippet putInto="code">{`
                //single value
                Format.value(2, 'n;2'); //"2.00"

                //string template
                StringTemplate.format('Date: {0:d}', new Date('2016-9-2')); //"Date: 9/2/2016"

                //multiple formats
                Format.value(5, 'n;2:wrap;(;)'); //"(5.00)"
                Format.value(null, 'n;2:wrap;(;)'); //""

                //null
                Format.value(null, 'n;2:wrap;(;)|N/A'); //"N/A"
            `}</CodeSnippet>

            ### Format Specifiers

            <MethodTable methods={formats} sort={false} />
        </CodeSplit>
    </Md>

</cx>;

