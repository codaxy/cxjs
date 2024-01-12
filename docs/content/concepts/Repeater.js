import { Content, Checkbox, Repeater, Text, Tab } from 'cx/widgets';
import { Md } from '../../components/Md';
import { CodeSplit } from '../../components/CodeSplit';
import { CodeSnippet } from '../../components/CodeSnippet';
import { ImportPath } from '../../components/ImportPath';
import { ConfigTable } from '../../components/ConfigTable';
import configs from '../widgets/configs/Repeater';
import { store } from '../../app/store';

import { enableFatArrowExpansion } from "cx/data";
enableFatArrowExpansion();

store.set('intro.core.items', [
    {text: 'A', checked: false},
    {text: 'B', checked: false},
    {text: 'C', checked: false}
]);

export const RepeaterPage = <cx>
    <Md>
        <CodeSplit>
            # Repeater
            <ImportPath path="import { Repeater } from 'cx/widgets';" />

            Repeater renders its content for each record of the assigned collection.
            Within the Repeater, use the `$record` alias to access the record data.
            Element index is available by using the `$index` alias.

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
                <Tab value-bind="$page.code1.tab" mod="code" tab="controller" text="Controller" default />
                <Tab value-bind="$page.code1.tab" mod="code" tab="code" text="Repeater" default />
                <CodeSnippet visible-expr="{$page.code1.tab}=='controller'" fiddle="F3RHqb0x">{`
                    store.set('intro.core.items', [
                        { text: 'A', checked: false },
                        { text: 'B', checked: false },
                        { text: 'C', checked: false }
                    ]);
                `}</CodeSnippet>
                <CodeSnippet visible-expr="{$page.code1.tab}=='code'" fiddle="F3RHqb0x">{`
                    <Repeater records-bind="intro.core.items">
                        <Checkbox value-bind="$record.checked" text-bind="$record.text" />
                        <br/>
                    </Repeater>

                    You checked <Text value-expr='{intro.core.items}.filter(a => a.checked).length' /> item(s).
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        <CodeSplit>
            Sometimes it is useful to change the default record and index aliases (`$record` and `$index`), e.g. when nesting 
            one Repeater inside another. This can be done by setting the `recordAlias` and `indexAlias` attributes.

            If `sortField` is set, the collection will be sorted before output.
            By default, Repeater maintains the order of the collection. Here is the above example, but in **descending** order:

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

                    You checked <Text value-expr='{intro.core.items}.filter(a=>a.checked).length'/> item(s).
                </div>
            </div>

            <Content name="code">
            <Tab value-bind="$page.code2.tab" mod="code" tab="code" text="Repeater" default />
                <CodeSnippet visible-expr="{$page.code2.tab}=='code'" fiddle="wQzsdIx1">{`
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

        <ConfigTable props={configs} />
    </Md>
</cx>
