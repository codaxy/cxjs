import { Content, HtmlElement, Checkbox, TextField, Select, Option, Radio, Repeater, Sandbox, Text } from 'cx/widgets';
import { LabelsLeftLayout, Rescope, Controller } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';

import {store} from '../../app/store';

store.set('intro.core.items', [
    {text: 'A', checked: false},
    {text: 'B', checked: false},
    {text: 'C', checked: false}
]);

export const DataViews = <cx>

    <Md>
        # Data Views

        Having all data in a single object means that sometimes it's hard to access a particular object or a property.
        The purpose of data views it to simplify that.

        <CodeSplit>

            ## Repeater

            One of the most commonly used data views is the `ExposedRecordView` used
            by `Repeater` and `Grid` controls. It exposes a single element from an array as a separate store property
            (`$record`) and also the element's index under the `$index` property.

            <div class="widgets">
                <div>
                    <Repeater records:bind="intro.core.items">
                        <div>
                            <Checkbox value:bind="$record.checked" text:bind="$record.text"/>
                        </div>
                    </Repeater>

                    You checked <Text value:expr='{intro.core.items}.filter(a=>a.checked).length'/> item(s).
                </div>
            </div>

            <Content name="code">
                <CodeSnippet>{`
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

            ## Sandbox

            The `Sandbox` control works as a data multiplexer. It selects a value pointed by the `key` from the
            `storage` object and exposes it as a new property (`$page`).

            <div class="widgets">
                <div>
                    <div preserveWhitespace>
                        <Radio value={{bind: "$page.place", defaultValue: "winner"}} option="winner">Winner</Radio>
                        <Radio value:bind="$page.place" option="second">2nd Place</Radio>
                        <Radio value:bind="$page.place" option="third">3rd Place</Radio>
                    </div>
                    <hr/>
                    <Sandbox key:bind="$page.place" storage:bind="$page.results" recordName="$contestant">
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

            <CodeSnippet putInto="code">{`
                <div>
                    <div preserveWhitespace>
                        <Radio value={{bind:"$page.place", defaultValue:"winner"}} option="winner">Winner</Radio>
                        <Radio value:bind="$page.place" option="second">2nd Place</Radio>
                        <Radio value:bind="$page.place" option="third">3rd Place</Radio>
                    </div>
                    <hr/>
                    <Sandbox key:bind="$page.place" storage:bind="$page.results" recordName="$info">
                        <div layout={LabelsLeftLayout}>
                            <TextField value:bind="$info.firstName" label="First Name" />
                            <TextField value:bind="$info.lastName" label="Last Name" />
                        </div>
                    </Sandbox>
                </div>
                <div>
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
            different pages identified by the URL address.

        </CodeSplit>

        ## Rescope

        The `Rescope` widgets enables shorter data binding paths by selecting a common prefix.
        Check the previous example to see how `Rescope` was used for displaying results.

        Within the scope, outside data may be accessed by using the `$root.` prefix,
        e.g. `winner` and `$root.$page.results.winner` point to the same object.

    </Md>
</cx>

