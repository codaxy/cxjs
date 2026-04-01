import { Content, Slider, Tab } from 'cx/widgets';
import { Rescope, DataProxy, computable, LabelsTopLayout } from 'cx/ui';
import { Md } from '../../components/Md';
import { CodeSplit } from '../../components/CodeSplit';
import { CodeSnippet } from '../../components/CodeSnippet';
import { ImportPath } from '../../components/ImportPath';
import { ConfigTable } from '../../components/ConfigTable';
import dataProxyConfig from './configs/DataProxy';

import { enableFatArrowExpansion } from "cx/data";
enableFatArrowExpansion();

export const DataProxyPage = <cx>
    <Md>
        <Rescope bind="$page">
            <CodeSplit>
                # DataProxy
                <ImportPath path="import { DataProxy } from 'cx/ui';" />

                The simplest use case for `DataProxy` is when we want to create an alias for a certain store binding.
                In the example below, `level` binding is also made available as `$level`.
                This creates a simple two-way mapping between the two store values. Moving one slider will affect the other.

                <div class="widgets flex-row">
                    <LabelsTopLayout>
                        <Slider value-bind="level" label="Level" />
                    </LabelsTopLayout>  
                    <DataProxy
                        value-bind="level"
                        alias="$level"
                    >
                        <LabelsTopLayout>
                            <Slider value-bind="$level" label="Level alias" />
                        </LabelsTopLayout>
                    </DataProxy>
                </div>

                <Content name="code">
                    <Tab value-bind="$page.code1.tab" mod="code" tab="code" text="DataProxy" default />
                    <CodeSnippet fiddle="YwPbwL8u">{`
                        <div class="widgets flex-row">
                            <LabelsTopLayout>
                                <Slider value-bind="level" label="Level" />
                            </LabelsTopLayout>  
                            <DataProxy
                                value-bind="level"
                                alias="$level"
                            >
                                <LabelsTopLayout>
                                    <Slider value-bind="$level" label="Level alias" />
                                </LabelsTopLayout>
                            </DataProxy>
                        </div>
                    `}</CodeSnippet>
                </Content>
            </CodeSplit>
        </Rescope>

        ### Defining multiple aliases

        `data` property is used to define multiple mappings. `data` is an object whose property names serve as aliases,
        and their values are objects with `expr` and `set` properties that define custom getter and setter logic:

        <Rescope>
            <CodeSplit>
                - `expr` defines a getter logic and can be a Cx computable or an expression,
                - `set` is a function that receives the alias value and the `instance` object as parameters. The `store` can be accessed directly
                    with destructuring assignment syntax. Note that the setter function needs to call the `store.set` method explicitly
                    in order to set the `level` value, as opposed to just returning the calculated value.
                    This is because we can use any number of store values to calculate the alias,
                    and it's up to us to define the setter logic correctly.

                Omitting the `set` property will make the alias itself a read-only. Attempting to change its value will log
                an error to the console, so the UI should not allow it.

                <div class="widgets flex-row flex-start">  
                    <LabelsTopLayout>
                        <Slider value-bind="level" label="Level" />
                    </LabelsTopLayout>
                    <DataProxy
                        data={{
                            $invertedLevel: {
                                expr: computable("level", v => 100 - v),
                                set: (value, {store}) => {
                                    store.set("level", 100 - value);
                                }
                            },
                            // read-only
                            $level: {
                                expr: "{level}"
                            }
                        }}
                    >
                        <div class="flex-column">
                            <Slider value-bind="$invertedLevel" label="Inverted level" />
                            <Slider value-bind="$level" label="Level (read-only)" />
                        </div>
                    </DataProxy>
                </div>

                <Content name="code">
                    <Tab value-bind="$page.code2.tab" mod="code" tab="code" text="DataProxy" default />
                    <CodeSnippet fiddle="o5C83HBH">{`
                        <FlexRow spacing="xlarge" align="start">
                            <LabelsTopLayout>
                                <Slider value-bind="level" label="Level" />
                            </LabelsTopLayout>
                            <DataProxy
                                data={{
                                    $invertedLevel: {
                                        expr: computable("level", (v) => 100 - v),
                                        set: (value, { store }) => {
                                            store.set("level", 100 - value);
                                        }
                                    },
                                    $level: {
                                        expr: "{level}"
                                    }
                                }}
                            >
                                <FlexCol>
                                    <Slider value-bind="$invertedLevel" label="Inverted level" />
                                    <Slider value-bind="$level" label="Level (read-only)" />
                                </FlexCol>
                            </DataProxy>
                        </FlexRow>
                    `}</CodeSnippet>
                </Content>
            </CodeSplit>
        </Rescope>

        If mapping is done in both directions (both getter and setter are used), it is important that both operations are reversible, without any data loss. 
        This means, for any alias value, we should be able to get back all of the store values that were used to calculate it. 
        Failing to do so will cause bugs that are hard to detect.

        **Note**: It is good practice to prefix the alias name with a `$` sign in order to avoid unintentional name shadowing 
        which will cause an infinite get-set loop and a `Maximum call stack exceeded` error.

        ### Advanced example
        [Exposing currently selected Grid record](~/examples/grid/form-edit) for real time editing is a common use case for `DataProxy`.

        ### Configuration
        <ConfigTable props={dataProxyConfig} />
    </Md>
</cx>
