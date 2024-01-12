import { Content, TextField, Radio, Sandbox, Text, Tab } from 'cx/widgets';
import { LabelsLeftLayout, Rescope } from 'cx/ui';
import { Md } from '../../components/Md';
import { CodeSplit } from '../../components/CodeSplit';
import { CodeSnippet } from '../../components/CodeSnippet';
import { ImportPath } from '../../components/ImportPath';

import { enableFatArrowExpansion } from "cx/data";
enableFatArrowExpansion();

export const SandboxPage = <cx>
    <Md>
        <CodeSplit>
            # Sandbox
            <ImportPath path="import { Sandbox } from 'cx/widgets';" />

            The `Sandbox` control works as a data multiplexer. It selects a value pointed by the `key` from the
            `storage` object and exposes it as a new property (`$page`).

            <div class="widgets">
                <div>
                    <div preserveWhitespace>
                        <Radio value={{bind: "$page.place", defaultValue: "winner"}} option="winner">1st Place</Radio>
                        <Radio value-bind="$page.place" option="second">2nd Place</Radio>
                        <Radio value-bind="$page.place" option="third">3rd Place</Radio>
                    </div>
                    <hr/>
                    <Sandbox key-bind="$page.place" storage-bind="$page.results" recordAlias="$contestant">
                        <div layout={LabelsLeftLayout}>
                            <TextField value-bind="$contestant.firstName" label="First Name"/>
                            <TextField value-bind="$contestant.lastName" label="Last Name"/>
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
            <Content name="code">
                <Tab value-bind="$page.code1.tab" mod="code" tab="code" text="Sandbox" default />
                <CodeSnippet fiddle="110OL8gu">{`
                    <div>
                        <div preserveWhitespace>
                            <Radio value={{bind: "$page.place", defaultValue: "winner"}} option="winner">1st Place</Radio>
                            <Radio value-bind="$page.place" option="second">2nd Place</Radio>
                            <Radio value-bind="$page.place" option="third">3rd Place</Radio>
                        </div>
                        <hr/>
                        <Sandbox key-bind="$page.place" storage-bind="$page.results" recordAlias="$contestant">
                            <div layout={LabelsLeftLayout}>
                                <TextField value-bind="$contestant.firstName" label="First Name"/>
                                <TextField value-bind="$contestant.lastName" label="Last Name"/>
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
            </Content>       

            `Sandbox` is commonly used in single page applications to isolate data
            belonging to different pages being identified by the URL address.
            For the list of configuration properties, see the [Router docs](~/concepts/router#sandbox).
        </CodeSplit>
    </Md>
</cx>
