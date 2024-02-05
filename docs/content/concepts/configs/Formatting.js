import { Md } from "../../../components/Md";

export default {
    "string": {
        key: true,
        alias: 's',
        description: <cx><Md>
            Default format. Convert any value to string using the `toString()` method.
        </Md></cx>
    },
    "number": {
        key: true,
        alias: "n",
        description: <cx><Md>
            Number formatting.

            `n;decimalPrecision`

            `n;minPrecision;maxPrecision`

            `n;minPrecision;maxPrecision;+`
            Displays a plus sign for positive numbers.

            `n;minPrecision;maxPrecision;c`
            Used for compact number formatting, e.g. **105000** will be formatted as **105K**.

            `n;minPrecision;maxPrecision;+c`
            Combines previous formats.
        </Md></cx>
    }, currency: {
        key: true,
        description: <cx><Md>
            Currency formatting. Formatting is done using the
            [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat)
            class provided by the browser. It's required to use a polyfill if
            your browser doesn't support `Intl` (e.g. older versions of Safari).

            `currency;currencyCode;decimalPrecision`

            `currency;currencyCode;minPrecision;maxPrecision`

            `currency;currencyCode;minPrecision;maxPrecision;+`
            Displays a plus sign for positive numbers.

            `currency;currencyCode;minPrecision;maxPrecision;a`
            Accounting format.

            `currency;currencyCode;minPrecision;maxPrecision;c`
            Used for compact number formatting, e.g. **105000** will be formatted as **105K**.

            `currency;currencyCode;minPrecision;maxPrecision;+ac`
            Combines previous formats.
        </Md></cx>
    },
    percentage: {
        key: true,
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
        key: true,
        alias: 'd',
        description: <cx><Md>
            Short date format.
        </Md></cx>
    },
    "time": {
        key: true,
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
        key: true,
        description: <cx><Md>
            Converts text to the lower case.
        </Md></cx>
    },
    "uppercase": {
        key: true,
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
    }
};