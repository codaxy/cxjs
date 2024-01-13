import { Content, Checkbox, Repeater, Text, Tab } from 'cx/widgets';
import { Md } from '../../components/Md';
import { CodeSplit } from '../../components/CodeSplit';
import { CodeSnippet } from '../../components/CodeSnippet';
import { ImportPath } from '../../components/ImportPath';
import { ConfigTable } from '../../components/ConfigTable';
import configs from '../widgets/configs/Repeater';
import { Controller } from 'cx/ui';

import { enableFatArrowExpansion } from "cx/data";
enableFatArrowExpansion();

class PageController extends Controller {
    onInit() {
        this.store.set('intro.core.items', [
            {text: 'A', checked: false},
            {text: 'B', checked: false},
            {text: 'C', checked: false}
        ]);

        this.store.set('bank.transactions', [
            {
                accountId: 12345,
                transactions: [
                    { action: "send", to: 12346, amount: 250 },
                    { action: "receive", from: 12347, amount: 100 },
                    { action: "send", to: 12346, amount: 150 }
                ]
            },
            {
                accountId: 12346,
                transactions: [
                    { action: "receive", from: 12345, amount: 250 },
                    { action: "receive", from: 12345, amount: 150 }
                ]
            }
        ]);
    }
}

export const RepeaterPage = <cx>
    <div controller={PageController}>
        <Md>
            # Repeater
            <ImportPath path="import { Repeater } from 'cx/widgets';" />

            Repeater renders the content of each record from the assigned collection.
            Within Repeater, use the `$record` alias to access the record data.
            Element index is available by using the `$index` alias.

            <CodeSplit>
                <div class="widgets">
                    <div>
                        <Repeater records-bind="intro.core.items" >
                            <Checkbox value-bind="$record.checked" text-bind="$record.text"/>
                            <br/>
                        </Repeater>

                        You checked <Text value-expr='{intro.core.items}.filter(a => a.checked).length'/> item(s).
                    </div>
                </div>

                <Content name="code">
                    <Tab value-bind="$page.code1.tab" mod="code" tab="controller" text="Controller" />
                    <Tab value-bind="$page.code1.tab" mod="code" tab="code" text="Repeater" default />
                    <CodeSnippet visible-expr="{$page.code1.tab}=='controller'" fiddle="7lIpPr9A">{`
                        this.store.set('intro.core.items', [
                            { text: 'A', checked: false },
                            { text: 'B', checked: false },
                            { text: 'C', checked: false }
                        ]);
                    `}</CodeSnippet>
                    <CodeSnippet visible-expr="{$page.code1.tab}=='code'" fiddle="7lIpPr9A">{`
                        <Repeater records-bind="intro.core.items">
                            <Checkbox value-bind="$record.checked" text-bind="$record.text" />
                            <br/>
                        </Repeater>

                        You checked <Text value-expr="{intro.core.items}.filter(a => a.checked).length" /> item(s).
                    `}</CodeSnippet>
                </Content>
            </CodeSplit>

            ### Sorting

            <CodeSplit>
                If `sortField` is set, the collection will be sorted before output.
                By default, Repeater maintains the order of elements in the collection.
                Here is a modified version of the previous example with elements
                arranged in **descending** order:

                <div class="widgets">
                    <div>
                        <Repeater 
                            records-bind="intro.core.items" 
                            sortField="text"
                            sortDirection="DESC"
                        >
                            <Checkbox value-bind="$record.checked" text-bind="$record.text"/>
                            <br/>
                        </Repeater>

                        You checked <Text value-expr='{intro.core.items}.filter(a => a.checked).length'/> item(s).
                    </div>
                </div>

                <Content name="code">
                    <Tab value-bind="$page.code2.tab" mod="code" tab="code" text="Repeater" default />
                    <CodeSnippet visible-expr="{$page.code2.tab}=='code'" fiddle="tHGfWkWp">{`
                        <Repeater 
                            records-bind="intro.core.items" 
                            sortField="text"
                            sortDirection="DESC"    
                        >
                            <Checkbox value-bind="$record.checked" text-bind="$record.text" />
                            <br/>
                        </Repeater>

                        You checked <Text value-expr='{intro.core.items}.filter(a => a.checked).length' /> item(s).
                    `}</CodeSnippet>
                </Content>
            </CodeSplit>

            ### Nesting Repeater and usage of non-default aliases

            <CodeSplit>
                Sometimes it is useful to change the default record and index aliases (`$record` and `$index`),
                e.g. when nesting one Repeater inside another. This can be done by setting
                the `recordAlias` and `indexAlias` attributes.

                <div class="widgets">
                    <Repeater
                        records-bind="bank.transactions"
                        recordAlias="account"
                    >
                        <Text tpl="Account ID: {account.accountId}" />
                        <br/>
                        <Repeater
                            records-bind="account.transactions"
                            recordAlias="transaction"
                            indexAlias="transactionIndex"
                        >
                            <Text tpl="{transactionIndex} - {transaction.action} ${transaction.amount} " />
                            <Text tpl="to {transaction.to}" if-expr="{transaction.action} === 'send'" />
                            <Text tpl="from {transaction.from}" if-expr="{transaction.action} === 'receive'" />
                            <br />
                        </Repeater>
                        <br />
                    </Repeater>
                </div>

                <Content name="code">
                    <Tab value-bind="$page.code3.tab" mod="code" tab="controller" text="Controller" />
                    <Tab value-bind="$page.code3.tab" mod="code" tab="code" text="Repeater" default />
                    <CodeSnippet visible-expr="{$page.code3.tab}=='controller'" fiddle="UWBsgvFe">{`
                        this.store.set('bank.transactions', [
                            {
                                accountId: 12345,
                                transactions: [
                                    { action: "send", to: 12346, amount: 250 },
                                    { action: "receive", from: 12347, amount: 100 },
                                    { action: "send", to: 12346, amount: 150 }
                                ]
                            },
                            {
                                accountId: 12346,
                                transactions: [
                                    { action: "receive", from: 12345, amount: 250 },
                                    { action: "receive", from: 12345, amount: 150 }
                                ]
                            }
                        ]);
                    `}</CodeSnippet>
                    <CodeSnippet visible-expr="{$page.code3.tab}=='code'" fiddle="UWBsgvFe">{`
                        <Repeater
                            records-bind="bank.transactions"
                            recordAlias="account"
                        >
                            <Text tpl="Account ID: {account.accountId}" />
                            <br/>
                            <Repeater
                                records-bind="account.transactions"
                                recordAlias="transaction"
                                indexAlias="transactionIndex"
                            >
                                <Text tpl="{transactionIndex} - {transaction.action} ` + "$" + `{transaction.amount} " />
                                <Text tpl="to {transaction.to}" if-expr="{transaction.action} === 'send'" />
                                <Text tpl="from {transaction.from}" if-expr="{transaction.action} === 'receive'" />
                                <br />
                            </Repeater>
                            <br />
                        </Repeater>
                    `}</CodeSnippet>
                </Content>
            </CodeSplit>

            ### Configuration
            <ConfigTable props={configs} />
        </Md>
    </div>
</cx>
