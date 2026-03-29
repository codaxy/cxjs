import { Content, Tab, NumberField, LabeledContainer, DateField, TextField } from 'cx/widgets';
import { Md } from '../../components/Md';
import { CodeSplit } from '../../components/CodeSplit';
import { CodeSnippet } from '../../components/CodeSnippet';
import { ConfigTable } from '../../components/ConfigTable';
import { ImportPath } from '../../components/ImportPath';
import { Controller, LabelsTopLayout } from 'cx/ui';
import configs from "./configs/Formatting";

class FormattingController extends Controller {
    onInit() {
        this.store.set("$page.value", 3.14159);
        this.store.set("$page.person.name", "John");
        this.store.set("$page.person.dateOfBirth", new Date());
        this.store.set("$page.person.height", 180);
    }
}

export const Formatting = (
    <cx>
        <div controller={FormattingController}>
            <Md>
                # Formatting
                <ImportPath path="import { Format } from 'cx/util';" />

                Cx offers rich support for value formatting.

                You may use `Format.value(value, format)` function to format single values.

                Formats are supported in data expressions and string templates.

                <CodeSplit>
                    <div class="widgets">
                        <div>
                            <LabelsTopLayout columns={2}>
                                <NumberField value-bind="$page.value" label="Value" />
                                <div />
                                <LabeledContainer label="Max two decimals">
                                    <div text-tpl="{$page.value:n;0;2}" />
                                </LabeledContainer>
                                <LabeledContainer label="Compact (1M, 1k)">
                                    <div text-tpl="{$page.value:n;0;4;c}" />
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
                                <LabeledContainer label="Accounting format">
                                    <div text-tpl="{$page.value:currency;USD;1;2;+ac}" />
                                </LabeledContainer>
                                <LabeledContainer label="Percentage">
                                    <div text-tpl="{$page.value:p;0;2;}" />
                                </LabeledContainer>
                                <LabeledContainer label="Percentage sign">
                                    <div text-tpl="{$page.value:ps;0;2;}" />
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
                            <LabelsTopLayout columns={2} style="margin-top: -10px">
                                <LabelsTopLayout columns={1}>
                                    <TextField value-bind="$page.person.name" label="Enter your name" maxLength={20} />
                                    <div text-tpl='{[fmt({$page.person.name}, "prefix;Hi :suffix;. Nice to meet you!")]}' />
                                </LabelsTopLayout>
                                <LabelsTopLayout columns={1}>
                                    <NumberField value-bind="$page.person.height" label="Enter your height in cm" />
                                    <div text-tpl="Your height is {$page.person.height:suffix; cm.|N/A.}" />
                                </LabelsTopLayout>
                            </LabelsTopLayout>
                        </div>
                    </div>

                    <Content name="code">
                        <Tab value-bind="$page.code1.tab" mod="code" tab="controller" text="Controller" />
                        <Tab value-bind="$page.code1.tab" mod="code" tab="index" text="Widgets" default />

                        <CodeSnippet visible-expr="{$page.code1.tab}=='controller'">{`
                            // Number formatting
                            Format.value(7, 'n;2'); // Two decimals - "7.00"
                            Format.value(3.29, 'n;0'); // No decimals - "3"
                            Format.value(3.14159, 'n;1;3'); // Min 1, max 3 decimals - "3.142"
                            Format.value(462.31, 'currency;EUR;1'); // Currency EUR, one decimal - "€462.3"
                            Format.value(-5, 'currency;USD;1;2;a'); // Accounting format - "($5.0)"
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
                                    <LabeledContainer label="Compact (1M, 1k)">
                                        <div text-tpl="{$page.value:n;0;4;c}" />
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
                                    <LabeledContainer label="Accounting format">
                                        <div text-tpl="{$page.value:currency;USD;1;2;+ac}" />
                                    </LabeledContainer>
                                    <LabeledContainer label="Percentage">
                                        <div text-tpl="{$page.value:p;0;2;}" />
                                    </LabeledContainer>
                                    <LabeledContainer label="Percentage sign">
                                        <div text-tpl="{$page.value:ps;0;2;}" />
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
                                <LabelsTopLayout columns={2} style="margin-top: -10px">
                                    <LabelsTopLayout columns={1}>
                                        <TextField value-bind="$page.person.name" label="Enter your name" maxLength={20} />
                                        <div text-tpl='{[fmt({$page.person.name}, "prefix;Hi :suffix;. Nice to meet you!")]}' />
                                    </LabelsTopLayout>
                                    <LabelsTopLayout columns={1}>
                                        <NumberField value-bind="$page.person.height" label="Enter your height in cm" />
                                        <div text-tpl="Your height is {$page.person.height:suffix; cm.|N/A.}" />
                                    </LabelsTopLayout>
                                </LabelsTopLayout>
                            </div>
                        `}</CodeSnippet>
                    </Content>
                </CodeSplit>

                ### Formatting Rules

                Use `;` to delimit format parameters.

                Use `:` to use chain multiple formats. Formats are applied from left to right.

                Use `|` to provide null text. Default null text is empty string.

                ### Format Specifiers
                <ConfigTable props={configs} hideType header="Specifier" />

                ### Culture Sensitive Formatting
                <ImportPath path="import { enableCultureSensitiveFormatting } from 'cx/ui';" />

                Date, currency and number formats are dependent on an external library and must be enabled
                before use. This is slightly inconvenient but ensures small bundle sizes for applications that do
                not use this feature.

                <CodeSplit>
                    <CodeSnippet copy={false}>
                        enableCultureSensitiveFormatting();
                    </CodeSnippet>
                </CodeSplit>

                ### Custom Formats
                Custom formats may be defined using `Format.register` and `Format.registerFactory` methods.

                <CodeSplit>
                    `Format.register` can be used to register formats which do not need any parameters.
                    <CodeSnippet putInto="code" copy={false}>{`
                        Format.register('brackets', value => \`(\$\{value\})\`);
                        Format.value('test', 'brackets'); //'(test)'
                    `}</CodeSnippet>
                </CodeSplit>

                <CodeSplit>
                    `Format.registerFactory` can be used to define formats which take parameters.
                    <CodeSnippet putInto="code" copy={false}>{`
                        Format.registerFactory('suffix', (format, suffix) => value => value.toString() + suffix);
                        Format.value(10, 'suffix; kg'); //'10 kg'
                    `}</CodeSnippet>
                </CodeSplit>
            </Md>
        </div>
    </cx>
);
