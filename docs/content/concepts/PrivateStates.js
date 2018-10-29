import {HtmlElement, Content, Button, FlexRow, FlexCol, PrivateState} from 'cx/widgets';
import {Svg} from "cx/svg";
import {Chart, Gridlines, NumericAxis, LineGraph} from 'cx/charts';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {Controller, createFunctionalComponent} from 'cx/ui';
import {ImportPath} from 'docs/components/ImportPath';
import {MethodTable} from '../../components/MethodTable';

// TODO: create code sandbox example for this feature

let cache = {};
function getUserData(userId) {
    var y = 100 + Math.random() * 200;
    if (!cache[userId]) 
        cache[userId] = Array.from({length: userId}, (_, x) => ({
            x: x * 4,
            y: (y = y + Math.random() * 100 - 50)
        }));
    return cache[userId];
}

let UsageStats = createFunctionalComponent(({userId}) => {
    class WidgetController extends Controller {
        onInit() {
            // simmulate data fetching - this can be async
            let data = getUserData(userId);
            this.store.set("$page.data", data);
        }
    };

    return <cx>
        <div style="flex:1;" controller={WidgetController}>
            <FlexCol style="flex:1">
                <h3 text={"User Id: " + userId} style="margin-top: 0px;"/>
                <Svg style="flex:1; height:200px;">
                    <Chart offset="20 -20 -20 40" 
                        axes={{ x: { type: NumericAxis }, y: { type: NumericAxis, vertical: true } }}>
                        <Gridlines/>
                        <LineGraph data-bind="$page.data" colorIndex={userId} />
                    </Chart>
                </Svg>
            </FlexCol>
        </div>
    </cx>;
});

const IsolatedUsageStats = (props) => <cx>
    <PrivateState>
        <UsageStats {...props} />
    </PrivateState>
</cx>

export const PrivateStates = <cx>

    <Md>
        # Private State

        <CodeSplit>

            <ImportPath path="import { PrivateState } from 'cx/widgets';" />

            As usefuel as the global Store may be, sometimes it causes us trouble if some widgets 
            unintentionally overwrite each other's data, due to the same Store bindings.

            Consider the example below: we are using a simple UsageStats widget that loads and displays some user data 
            based on the `userId`.
            Data is stored under `$page.data`. Using more then one instance of the UsageStats widget on the same page
            will cause unpredictable and hard to discover bugs, due to unintended data mutation.

            <div class="widgets">
                <FlexRow style="width:100%;">
                    <UsageStats userId={6} />
                    <UsageStats userId={10} />
                </FlexRow>
            </div>

            Although we are passing different `userIds` to the UsageStats widgets, they are both showing identical graphs
            because both instances are using the same Store binding for the data - `$page.data`, and the widget that was loaded last
            simply overwrites the other data.

            <Content name="code">
                <CodeSnippet /* fiddle="F3RHqb0x" */>{`
                    let UsageStats = createFunctionalComponent(({userId}) => {
                        class WidgetController extends Controller {
                            onInit() {
                                // simmulate data fetching - this can be async
                                let data = getUserData(userId);
                                this.store.set("$page.data", data);
                            }
                        }
                    
                        return <cx>
                            <div style="flex:1;" controller={WidgetController}>
                                <FlexCol style="flex:1">
                                    <h3 text={"User Id: " + userId} style="margin-top: 0px;"/>
                                    <Svg style="flex:1; height:200px;">
                                        <Chart offset="20 -20 -20 40" 
                                            axes={{ x: { type: NumericAxis }, y: { type: NumericAxis, vertical: true } }}>
                                            <Gridlines/>
                                            <LineGraph data-bind="$page.data" colorIndex={userId} />
                                        </Chart>
                                    </Svg>
                                </FlexCol>
                            </div>
                        </cx>;
                    });
                    ...
                    
                    <FlexRow style="width:100%;">
                        <UsageStats userId={6} />
                        <UsageStats userId={10} />
                    </FlexRow>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        To solve this problem, we can use `PrivateState` to isolate the parts of the Store that are used within a widget.
        This way we can have as many instances as we want, without worrying about Store pollution.
                
        <CodeSplit>
            <div class="widgets">
                <FlexRow style="width:100%;">
                    <IsolatedUsageStats userId={6} />
                    <IsolatedUsageStats userId={10} />
                </FlexRow>
            </div>

            <Content name="code">
                <CodeSnippet /* fiddle="F3RHqb0x" */>{`
                    const IsolatedUsageStats = (props) => <cx>
                        <PrivateState>
                            <UsageStats {...props} />
                        </PrivateState>
                    </cx>
                    ...
                    
                    <FlexRow style="width:100%;">
                        <IsolatedUsageStats userId={6} />
                        <IsolatedUsageStats userId={10} />
                    </FlexRow>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ### Passing bindings to PrivateState

        Explain how to set `data` prop for `PrivateState`.



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

