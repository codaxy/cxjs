import { Content, HtmlElement, Checkbox, TextField, Select, Option, Radio, Repeater, Sandbox, Text } from 'cx/widgets';
import { LabelsLeftLayout, Rescope } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ImportPath} from '../../components/ImportPath';
import {ConfigTable} from '../../components/ConfigTable';

import configs from '../widgets/configs/Repeater';

import {store} from '../../app/store';

import {enableFatArrowExpansion} from "cx/data";
enableFatArrowExpansion();

store.set('intro.core.items', [
    {text: 'A', checked: false},
    {text: 'B', checked: false},
    {text: 'C', checked: false}
]);

export const DataViews = <cx>

    <Md>
        # Data Views

        Having all data in a single object makes it difficult to access a particular object or property.
        The purpose of data views is to simplify this.

        <CodeSplit>

            ## Repeater

            <ImportPath path="import { Repeater } from 'cx/widgets';" />

            Repeater renders its content for each record of the assigned collection.
            Within the Repeater, use the `$record` alias to access the record data.
            Element index is available by using the `$index` alias.

            <div class="widgets">
                <div>
                    <Repeater records:bind="intro.core.items" >
                        <Checkbox value:bind="$record.checked" text:bind="$record.text"/>
                        <br/>
                    </Repeater>

                    You checked <Text value:expr='{intro.core.items}.filter(a=>a.checked).length'/> item(s).
                </div>
            </div>

            <Content name="code">
                <CodeSnippet fiddle="F3RHqb0x">{`
                    store.set('intro.core.items', [
                        { text: 'A', checked: false },
                        { text: 'B', checked: false },
                        { text: 'C', checked: false }
                    ]);
                    ...
                    <Repeater records:bind="intro.core.items">
                        <Checkbox value:bind="$record.checked" text:bind="$record.text" />
                        <br/>
                    </Repeater>

                    You checked <Text value:expr='{intro.core.items}.filter(a=>a.checked).length' /> item(s).
                `}</CodeSnippet>
            </Content>
        </CodeSplit>
        
        <CodeSplit>
            Sometimes it is useful to change the default record and index aliases (`$record` and `$index`), e.g. if nesting one 
            Repeater inside another. This can be done by setting the `recordAlias` and `indexAlias` attributes.
            
            If `sortField` is set, the collection will be sorted before output.
            By default, Repeater maintains the order of the collection. Here is the above example, but in **descending** order:

            <div class="widgets">
                <div>
                    <Repeater 
                        records:bind="intro.core.items" 
                        sortField="text"
                        sortDirection="DESC"
                    >
                        <Checkbox value:bind="$record.checked" text:bind="$record.text"/>
                        <br/>
                    </Repeater>

                    You checked <Text value:expr='{intro.core.items}.filter(a=>a.checked).length'/> item(s).
                </div>
            </div>

            <Content name="code">
                <CodeSnippet >{`
                    <Repeater 
                        records:bind="intro.core.items" 
                        sortField="text"
                        sortDirection="DESC"    
                    >
                        <Checkbox value:bind="$record.checked" text:bind="$record.text" />
                        <br/>
                    </Repeater>

                    You checked <Text value:expr='{intro.core.items}.filter(a=>a.checked).length' /> item(s).
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        <ConfigTable props={configs} />

        <CodeSplit>

            ## Sandbox

            <ImportPath path="import { Sandbox } from 'cx/widgets';" />

            The `Sandbox` control works as a data multiplexer. It selects a value pointed by the `key` from the
            `storage` object and exposes it as a new property (`$page`).

            <div class="widgets">
                <div>
                    <div preserveWhitespace>
                        <Radio value={{bind: "$page.place", defaultValue: "winner"}} option="winner">1st Place</Radio>
                        <Radio value:bind="$page.place" option="second">2nd Place</Radio>
                        <Radio value:bind="$page.place" option="third">3rd Place</Radio>
                    </div>
                    <hr/>
                    <Sandbox key:bind="$page.place" storage:bind="$page.results" recordAlias="$contestant">
                        <div layout={LabelsLeftLayout}>
                            <TextField value:bind="$contestant.firstName" label="First Name"/>
                            <TextField value:bind="$contestant.lastName" label="Last Name"/>
                        </div>
                    </Sandbox>
                </div>
                <div style="width:200px">
                    <strong>Results</strong>
                    <Rescope bind="$page.results">
                        <div>
                            1. <Text tpl="{winner.firstName} {winner.lastName}" />
                        </div>
                        <div>
                            2. <Text tpl="{second.firstName} {second.lastName}" />
                        </div>
                        <div>
                            3. <Text tpl="{third.firstName} {third.lastName}" />
                        </div>
                    </Rescope>
                </div>
            </div>

            <CodeSnippet putInto="code" fiddle="110OL8gu">{`
                <div>
                    <div preserveWhitespace>
                        <Radio value={{bind: "$page.place", defaultValue: "winner"}} option="winner">1st Place</Radio>
                        <Radio value:bind="$page.place" option="second">2nd Place</Radio>
                        <Radio value:bind="$page.place" option="third">3rd Place</Radio>
                    </div>
                    <hr/>
                    <Sandbox key:bind="$page.place" storage:bind="$page.results" recordAlias="$contestant">
                        <div layout={LabelsLeftLayout}>
                            <TextField value:bind="$contestant.firstName" label="First Name"/>
                            <TextField value:bind="$contestant.lastName" label="Last Name"/>
                        </div>
                    </Sandbox>
                </div>
                <div style="width:200px">
                    <strong>Results</strong>
                    <Rescope bind="$page.results">
                        <div>
                            1. <Text tpl="{winner.firstName} {winner.lastName}" />
                        </div>
                        <div>
                            2. <Text tpl="{second.firstName} {second.lastName}" />
                        </div>
                        <div>
                            3. <Text tpl="{third.firstName} {third.lastName}" />
                        </div>
                    </Rescope>
                </div>
            `}</CodeSnippet>

            `Sandbox` is commonly used in single page applications to isolate data belonging to
            different pages being identified by the URL address. For the list of configuration properties, see the [Router docs](~/concepts/router#sandbox).

        </CodeSplit>

        ## Rescope

        <ImportPath path="import { Rescope } from 'cx/ui';" />

        The `Rescope` widget enables shorter data binding paths by selecting a common prefix.
        Check out the previous example to see how `Rescope` is used to display results.

        Within the scope, outside data may be accessed by using the `$root.` prefix. For example,
        `winner` and `$root.$page.results.winner` point to the same object.
    </Md>
</cx>

