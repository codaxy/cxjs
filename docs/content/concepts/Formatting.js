import { Content, Tab, NumberField, LabeledContainer, DateField } from 'cx/widgets';
import { Md } from '../../components/Md';
import { CodeSplit } from '../../components/CodeSplit';
import { CodeSnippet } from '../../components/CodeSnippet';
import { ConfigTable } from '../../components/ConfigTable';
import { ImportPath } from '../../components/ImportPath';
import { LabelsTopLayout } from 'cx/ui';

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

        Use `;` to delimit format parameters.

        Use `:` to use chain multiple formats. Formats are applied from left to right.

        Use `|` to provide null text. Default null text is empty string.

        <CodeSplit>
            <div class="widgets">
                <div>
                    <LabelsTopLayout columns={2}>
                        <NumberField value-bind="$page.value" label="Value" />
                        <div />
                        <LabeledContainer label="Max two decimals">
                            <div text-tpl="{$page.value:n;0;2}" />
                        </LabeledContainer>
                        <LabeledContainer label="Currency (default)">
                            <div text-tpl="{$page.value:currency}" />
                        </LabeledContainer>
                        <LabeledContainer label="Currency USD, two decimals">
                            <div text-tpl="{$page.value:currency;USD;2}" />
                        </LabeledContainer>
                        <LabeledContainer label="Currency EUR, no decimals">
                            <div text-tpl="{$page.value:currency;EUR;0}" />
                        </LabeledContainer>
                        <LabeledContainer label="Percentage (1M, 1k)">
                            <div text-tpl="{$page.value:p;0;2;}" />
                        </LabeledContainer>
                        <LabeledContainer label="Percentage sign (1M, 1k)">
                            <div text-tpl="{$page.value:ps;0;2;}" />
                        </LabeledContainer>
                        <LabeledContainer label="Compact (1M, 1k)">
                            <div text-tpl="{$page.value:n;0;4;c}" />
                        </LabeledContainer>
                    </LabelsTopLayout>
                    <hr />
                    <LabelsTopLayout columns={2}>
                        <DateField value-bind="$page.person.dateOfBirth" label="Date of Birth" />
                        <div />
                        <LabeledContainer label="MM/dd/yyyy format (default)">
                            <div text-tpl="{$page.person.dateOfBirth:d}" />
                        </LabeledContainer>
                        <LabeledContainer label="M/d/yy format">
                            <div text-tpl="{$page.person.dateOfBirth:d;yyMd}" />
                        </LabeledContainer>
                        <LabeledContainer label="Short day name, M/d/yyyy">
                            <div text-tpl="{$page.person.dateOfBirth:d;DDDyyyyMd}" />
                        </LabeledContainer>
                        <LabeledContainer label="Full day name, MMM dd, yyyy">
                            <div text-tpl="{$page.person.dateOfBirth:d;DDDDyyyyMMMdd}" />
                        </LabeledContainer>
                        <LabeledContainer label="Full day name, MMMM dd, yyyy">
                            <div text-tpl="{$page.person.dateOfBirth:d;DDDDyyyyMMMMdd}" />
                        </LabeledContainer>
                    </LabelsTopLayout>
                    <hr />
                    <LabelsTopLayout columns={1}>
                        <NumberField
                            value-bind="$page.person.height"
                            label="Enter your height in cm"
                        />
                        <div text-tpl="Your height is: {$page.person.height:suffix; cm|N/A}" />
                    </LabelsTopLayout>
                </div>
            </div>

            <Content name="code">
                <Tab value-bind="$page.code1.tab" mod="code" tab="controller" text="Usage in controller" default/>
                <Tab value-bind="$page.code1.tab" mod="code" tab="index" text="Usage in widgets" default/>

                <CodeSnippet visible-expr="{$page.code1.tab}=='controller'">{`
                    // Number formatting
                    Format.value(7, 'n;2'); // Two decimals - "7.00"
                    Format.value(3.29, 'n;0'); // No decimals - "3"
                    Format.value(3.14159, 'n;1;3'); // Min 1, max 3 decimals - "3.142"
                    Format.value(462.31, 'currency;EUR;1'); // Currency EUR, one decimal - "€462.3"
                    Format.value(30.258, 'ps;0;2'); // Percentage sign, max 2 decimals - "30.26%"

                    // Date formatting
                    const date = new Date("2023-02-01");
                    Format.value(date, "d;yyMd"); // "2/1/23"
                    Format.value(date, "d;yyMMdd"); // "02/01/23"
                    Format.value(date, "d;yyyyMMdd"); // "02/01/2023"
                    Format.value(date, "d;yyyyMMMd"); // "Feb 1, 2023"
                    Format.value(date, "d;yyyyMMMMdd"); // "February 01, 2023"
                    Format.value(date, "d;DDyyyyMMMMd"); // "Wed, February 1, 2023"
                    Format.value(date, "d;DDDDyyyyMMMMd"); // "Wednesday, February 01, 2023"

                    // String template
                    StringTemplate.format('Date: {0:d}', new Date('2016-9-2')); // "Date: 9/2/2016"

                    // Multiple formats
                    Format.value(5, 'n;2:wrap;(;)'); // "(5.00)"
                    Format.value(null, 'n;2:wrap;(;)'); // ""

                    // null
                    Format.value(null, 'n;2:wrap;(;)|N/A'); // "N/A"
                `}</CodeSnippet>
                <CodeSnippet visible-expr="{$page.code1.tab}=='index'" fiddle="cZyeRDSw">{`
                    <div>
                        <LabelsTopLayout columns={2}>
                            <NumberField value-bind="$page.value" label="Value" />
                            <div />
                            <LabeledContainer label="Max two decimals">
                                <div text-tpl="{$page.value:n;0;2}" />
                            </LabeledContainer>
                            <LabeledContainer label="Currency (default)">
                                <div text-tpl="{$page.value:currency}" />
                            </LabeledContainer>
                            <LabeledContainer label="Currency USD, two decimals">
                                <div text-tpl="{$page.value:currency;USD;2}" />
                            </LabeledContainer>
                            <LabeledContainer label="Currency EUR, no decimals">
                                <div text-tpl="{$page.value:currency;EUR;0}" />
                            </LabeledContainer>
                            <LabeledContainer label="Percentage (1M, 1k)">
                                <div text-tpl="{$page.value:p;0;2;}" />
                            </LabeledContainer>
                            <LabeledContainer label="Percentage sign (1M, 1k)">
                                <div text-tpl="{$page.value:ps;0;2;}" />
                            </LabeledContainer>
                            <LabeledContainer label="Compact (1M, 1k)">
                                <div text-tpl="{$page.value:n;0;4;c}" />
                            </LabeledContainer>
                        </LabelsTopLayout>
                        <hr />
                        <LabelsTopLayout columns={2}>
                            <DateField value-bind="$page.person.dateOfBirth" label="Date of Birth" />
                            <div />
                            <LabeledContainer label="MM/dd/yyyy format (default)">
                                <div text-tpl="{$page.person.dateOfBirth:d}" />
                            </LabeledContainer>
                            <LabeledContainer label="M/d/yy format">
                                <div text-tpl="{$page.person.dateOfBirth:d;yyMd}" />
                            </LabeledContainer>
                            <LabeledContainer label="Short day name, M/d/yyyy">
                                <div text-tpl="{$page.person.dateOfBirth:d;DDDyyyyMd}" />
                            </LabeledContainer>
                            <LabeledContainer label="Full day name, MMM dd, yyyy">
                                <div text-tpl="{$page.person.dateOfBirth:d;DDDDyyyyMMMdd}" />
                            </LabeledContainer>
                            <LabeledContainer label="Full day name, MMMM dd, yyyy">
                                <div text-tpl="{$page.person.dateOfBirth:d;DDDDyyyyMMMMdd}" />
                            </LabeledContainer>
                        </LabelsTopLayout>
                        <hr />
                        <LabelsTopLayout columns={1}>
                            <NumberField
                                value-bind="$page.person.height"
                                label="Enter your height in cm"
                            />
                            <div text-tpl="Your height is: {$page.person.height:suffix; cm|N/A}" />
                        </LabelsTopLayout>
                    </div>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ### Format Specifiers
        <ConfigTable props={formats} sort={false} hideType header="Specifier"/>

        ### Culture Sensitive Formatting
        <ImportPath path="import { enableCultureSensitiveFormatting } from 'cx/ui';"/>

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
