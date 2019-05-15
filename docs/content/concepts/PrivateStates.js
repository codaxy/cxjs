import {HtmlElement, Content, Button, FlexRow, FlexCol, PrivateState, LookupField, Repeater} from 'cx/widgets';
import {Svg} from "cx/svg";
import {Chart, Gridlines, NumericAxis, LineGraph} from 'cx/charts';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {Controller, createFunctionalComponent, LabelsTopLayout} from 'cx/ui';
import {ImportPath} from 'docs/components/ImportPath';
import {MethodTable} from '../../components/MethodTable';
import {casual} from 'docs/content/examples/data/casual';
import { isBinding } from 'cx/src/data/Binding';

// TODO: create code sandbox example for this feature
// generate user list
function getUsers() {
    let ids = [6, 14];
    return ids.map(id => {
        let user = getUserData(id);
        return {
            id,
            name: user.name
        }
    });
}

class PageController extends Controller {
    onInit() {
        this.loadUsers();
    }

    loadUsers() {
        let users = getUsers();
        this.store.set("$page.users", users);
    }
}

let cache = {};
function getUserData(userId) {
    if (!userId) return;
    var y = 100 + Math.random() * 200;
    if (!cache[userId]) 
        cache[userId] = {
            id: userId,
            name: casual.full_name,
            data: Array.from({length: 10}, (_, x) => ({
                x: x * 4,
                y: (y = y + Math.random() * 100 - 50)
            }))
        };

    return cache[userId];
}

let UserStats = createFunctionalComponent(({userId}) => {
    
    class WidgetController extends Controller {
        onInit() {
            this.loadData();
        }
        loadData() {
            let id = this.store.get(userId.bind);
            if (!id) return;
            // simmulate data fetching
            let user = getUserData(id);
            this.store.set("$page.user", user);
        }
    };

    return <cx>
        <div style="flex:1;" controller={WidgetController}>
            <h3 text-tpl="User: {$page.user.name}" style="margin-top: 0px; display: inline-block;"/>
            <Svg style="flex:1; height: 200px; width: 325px;">
                <Chart offset="20 -20 -20 40" axes={{ x: { type: NumericAxis }, y: { type: NumericAxis, vertical: true } }}>
                    <Gridlines/>
                    <LineGraph data-bind="$page.user.data" colorIndex={userId} />
                </Chart>
            </Svg>
            <div style="margin-top: 10px; display: flex; justify-content: center;">
                <Button text="Load data" onClick="loadData" />
            </div>
        </div>
    </cx>;
});

let IsolatedUserStats = createFunctionalComponent(({userId}) => {

    class WidgetController extends Controller {
        onInit() {
            this.addTrigger("loadData", ["userId"], () => this.loadData(), true);
        }
        loadData() {
            // simmulate data fetching
            let userId = this.store.get("userId");
            let user = getUserData(userId);
            this.store.set("user", user);
        }
    };

    return <cx>
        <PrivateState data={{ userId: userId }}>
            <div style="flex:1;" controller={WidgetController}>
                <h3 text-tpl="User: {user.name}" style="margin-top: 0px; display: inline-block;"/>
                <Svg style="flex:1; height: 200px; width: 325px;">
                    <Chart offset="20 -20 -20 40" axes={{ x: { type: NumericAxis }, y: { type: NumericAxis, vertical: true } }}>
                        <Gridlines/>
                        <LineGraph data-bind="user.data" colorIndex-bind="userId" />
                    </Chart>
                </Svg>
                <div style="margin-top: 10px; display: flex; justify-content: center;">
                    <Button text="Load data" onClick="loadData" />
                </div>
            </div>
        </PrivateState>
    </cx>;
});

export const PrivateStates = <cx>

    <Md>
        # Private State

        <CodeSplit>

            <ImportPath path="import { PrivateState } from 'cx/widgets';" />

            As usefuel as the global Store may be, sometimes it causes us trouble if some widgets 
            unintentionally overwrite each other's data, due to the same Store bindings.

            Consider the example below: we are using a simple UserStats widget that loads and displays some user data 
            based on the `userId`.
            Data is stored under `$page.data`. Using more then one instance of the UserStats widget on the same page
            will cause unpredictable and hard to discover bugs, due to unintended data mutation.

            <div class="widgets" style="display:flex;" controller={PageController}>
                <Repeater
                    records-bind="$page.users"
                >
                    <UserStats userId-bind="$record.id" />
                </Repeater>
            </div>

            Although we are passing different `userIds` to the UserStats widgets, they are both showing identical graphs
            because both instances are using the same Store binding for the data - `$page.data`, and the widget that was loaded last
            simply overwrites the other data.

            <Content name="code">
                <CodeSnippet /* fiddle="F3RHqb0x" */>{`
                    let UserStats = createFunctionalComponent(({userId}) => {
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
                    
                    <FlexRow style="width:100%;" spacing>
                        <UserStats userId={6} />
                        <UserStats userId={10} />
                    </FlexRow>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        To solve this problem, we can use `PrivateState` to isolate the parts of the Store that are used within a widget.
        This way we can have as many instances as we want, without worrying about Store pollution.
                
        <CodeSplit>
            <div class="widgets" style="display:flex;">
                <IsolatedUserStats userId={6} />
                <IsolatedUserStats userId={10} />
            </div>

            <Content name="code">
                <CodeSnippet /* fiddle="F3RHqb0x" */>{`
                    const IsolatedUserStats = (props) => <cx>
                        <PrivateState>
                            <UserStats {...props} />
                        </PrivateState>
                    </cx>
                    ...
                    
                    <FlexRow style="width:100%;" spacing>
                        <IsolatedUserStats userId={6} />
                        <IsolatedUserStats userId={10} />
                    </FlexRow>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ### Passing bindings to PrivateState

        In the example above we hardcoded the `userId` values that were passed to the `IsolatedUserStats` widgets.
        Normally we will use data from the store, so we will need to pass the `userId` as a Store binding.

        <CodeSplit>
            <div class="widgets" style="display: flex; flex-direction: column;" >
                <LabelsTopLayout>
                    <LookupField 
                        label="Select user" 
                        value-bind="$page.userId"
                        options-bind="$page.users" 
                        optionTextField="name" 
                    >
                        <div text-tpl="{$option.name} "/><span style="font-size: 0.8em;" text-tpl="(id: {$option.id})" />
                    </LookupField>
                </LabelsTopLayout>
                <IsolatedUserStats userId-bind="$page.userId" />
            </div>
        </CodeSplit>

        Explain how to set `data` prop for `PrivateState`.



        ## `get`

        The `get` method is used to read data from the Store. It takes any number of arguments or an array of strings
        representing paths and it returns the corresponding values.
        In the previous example, the `greet` method inside the controller is
        using the `Store.get` method to read the name from the Store.
        You will notice that we are able to directly access a nested property (`$page.name`) by using the `.` in our
        `path`
        string. Think of `path` as a property accessor.

        
    </Md>
</cx>

