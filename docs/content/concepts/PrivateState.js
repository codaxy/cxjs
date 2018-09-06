import {HtmlElement, Content, Checkbox, Repeater, Text, TextField, Button, FlexRow, FlexCol, Restate} from 'cx/widgets';
import {Svg} from "cx/svg";
import {Column, Chart, Gridlines, CategoryAxis, NumericAxis} from 'cx/charts';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {Controller, LabelsTopLayout, LabelsLeftLayout, createFunctionalComponent} from 'cx/ui';
import {ImportPath} from 'docs/components/ImportPath';
import {MethodTable} from '../../components/MethodTable';
import {computable, updateArray} from 'cx/data';
import {casual} from 'docs/content/examples/data/casual';

function delay(miliseconds) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, miliseconds);
    })
}

const UsageStats = createFunctionalComponent(({userId}) => {
    class WidgetController extends Controller {
        onInit() {
            // simmulate data fetching - this can be async
            let data = Array.from({length: userId}, (_, i) => ({
                x: casual.city,
                y: 10 + (i+1) / 30 * 40 + (Math.random() - 0.5) * 10
            }));   
            this.store.set("$page.data", data);
        }
    }

    return <cx>
        <div style="flex:1;" controller={WidgetController}>
            <FlexCol style="flex:1">
                <h3 text={"User Id: " + userId} style="margin-top: 0px;"/>
                <Svg style="flex:1; height:300px;">
                    <Chart offset="20 -20 -110 40" 
                        axes={{
                            x: { type: CategoryAxis, labelRotation: -90, labelDy: '0.4em', labelAnchor: "end" },
                            y: { type: NumericAxis, vertical: true } 
                        }}>
                        <Gridlines/>
                        <Repeater records-bind="$page.data" recordAlias="$point">
                            <Column 
                                colorIndex={computable("$point", point => userId - Math.round(point.y*6/50))}
                                width={0.8}
                                x-tpl="{$point.x:ellipsis;16}"
                                y-bind="$point.y"
                                tooltip-tpl="{$point.x} {$point.y:n;0}" 
                            />
                        </Repeater>
                    </Chart>
                </Svg>
            </FlexCol>
        </div>
    </cx>;
});

export const PrivateState = <cx>

    <Md>
        # Private State

        <CodeSplit>

            <ImportPath path="import { PrivateState } from 'cx/widgets';" />

            As usefuel as the global Store may be, sometimes it causes us trouble if some widgets 
            unintentionally overwrite each other's data, due to the same store paths.

            Consider the example below: we are using a simple UsageStats widget that loads and displays some user data.
            Data is stored under `$page.data`. Using more then one instance of the UsageStats widget on the same page
            will cause unpredictable and hard to discover bugs, due to unintended data mutation.

            <div class="widgets">
                <FlexRow style="width:100%;">
                    <UsageStats userId={10} />
                    <UsageStats userId={12} />
                </FlexRow>
            </div>

            Although we are passing different `userIds` to the UsageStats widget, they are both showing identical data. 

            <Content name="code">
                <CodeSnippet /* fiddle="F3RHqb0x" */>{`
                    const UsageStats = createFunctionalComponent(({userId}) => {
                        class WidgetController extends Controller {
                            onInit() {
                                // simmulate data fetching - this can be async
                                let data = Array.from({length: userId}, (_, i) => ({
                                    x: casual.city,
                                    y: 10 + (i+1) / 30 * 40 + (Math.random() - 0.5) * 10
                                }));   
                                this.store.set("$page.data", data);
                            }
                        }
                    
                        return <cx>
                            <div style="flex:1;" controller={WidgetController}>
                                <FlexCol style="flex:1">
                                    <h3 text={"User Id: " + userId} style="margin-top: 0px;"/>
                                    <Svg style="flex:1; height:300px;">
                                        <Chart offset="20 -20 -110 40" 
                                            axes={{
                                                x: { type: CategoryAxis, labelRotation: -90, labelDy: '0.4em', labelAnchor: "end" },
                                                y: { type: NumericAxis, vertical: true } 
                                            }}>
                                            <Gridlines/>
                                            <Repeater records-bind="$page.data" recordAlias="$point">
                                                <Column 
                                                    colorIndex={computable("$point", point => userId - Math.round(point.y*6/50))}
                                                    width={0.8}
                                                    x-tpl="{$point.x:ellipsis;16}"
                                                    y-bind="$point.y"
                                                    tooltip-tpl="{$point.x} {$point.y:n;0}" 
                                                />
                                            </Repeater>
                                        </Chart>
                                    </Svg>
                                </FlexCol>
                            </div>
                        </cx>;
                    });
                    ...
                    
                    <FlexRow style="width:100%;">
                        <UsageStats userId={10} />
                        <UsageStats userId={12} />
                    </FlexRow>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        To solve this problem, we can use `PrivateState` to isolate the parts of the Store that are used within a widget.
        This way we can have as many instances as we want, without worrying about Store pollution.

        ### Examples

        In the examples below we will explore the most common ways to use the Store in CxJS:
        - inside Controllers (store is available via `this.store`)n
        - through two-way data binding ([explained here](~/concepts/data-binding))
        - inside event handlers

      


        ## `get`

        The `get` method is used to read data from the Store. It takes any number of arguments or an array of strings
        representing paths and it returns the corresponding values.
        In the previous example, the `greet` method inside the controller is
        using the `Store.get` method to read the name from the Store.
        You will notice that we are able to directly access a nested property (`$page.name`) by using the `.` in our
        `path`
        string. Think of `path` as a property accessor.

        <CodeSplit>
            <div class="widgets">
                
            </div>
        </CodeSplit>
    </Md>
</cx>

