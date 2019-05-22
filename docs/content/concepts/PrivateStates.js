import {HtmlElement, Content, Button, FlexRow, FlexCol, PrivateState, LookupField, Repeater, Rescope, TextField, Label, Icon} from 'cx/widgets';
import {Svg} from "cx/svg";
import {Chart, Gridlines, NumericAxis, LineGraph} from 'cx/charts';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {Controller, createFunctionalComponent, LabelsTopLayout, bind, LabelsLeftLayout, UseParentLayout} from 'cx/ui';
import {ImportPath} from 'docs/components/ImportPath';
import {MethodTable} from '../../components/MethodTable';
import {casual} from 'docs/content/examples/data/casual';
import { isBinding } from 'cx/src/data/Binding';

// simulate network latency
function delay(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}

let users = Array.from({length: 10}).map((_, i) => ({
    id: i,
    name: casual.full_name,
    phone: casual.phone,
    city: casual.city
}));
async function getUsers() {
    return users;
}
async function getUser(id) {
    await delay(300);
    return users.find(u => u.id === id);
}

class PageController extends Controller {
    onInit() {
        this.loadUsers();
        this.store.init("$page.senderId", 0);
        this.store.init("$page.receiverId", 1);
    }

    async loadUsers() {
        let users = await getUsers();
        this.store.set("$page.users", users);
    }
}

const UserData = ({userId}) => (
    <cx>
        <PrivateState
            data={{
                userId: userId
            }}
            controller={{ 
                onInit() {
                    this.addTrigger("loadUser", ["userId"], () => this.loadData(), true);
                },
                async loadData() {
                    this.store.set("loading", true);
                    let id = this.store.get("userId");
                    let user = await getUser(id);
                    this.store.set("user", user);
                    this.store.set("loading", false);
                }
            }}
            layout={UseParentLayout}
        >   
            <strong>User data <Icon name="loading" visible-bind="loading"/></strong>
            <TextField label="Name" value-bind="user.name" />
            <TextField label="Phone" value-bind="user.phone" />
            <TextField label="City" value-bind="user.city" />
        </PrivateState>
    </cx>
);

export const PrivateStates = <cx>

    <Md>
        # Private State

        <CodeSplit>

            <ImportPath path="import { PrivateState } from 'cx/widgets';" />

            The `PrivateState` widget allows a part of the widget tree to work with a separate data store. 
            Data shared beetween the parent store and the child store must be explicitely defined through the `data` property.

            In the example below `UserData` component is used to display user details based on the `userId` property.
            `data` property takes initial store values that can either be primitive values or store bindings from the parent store.
            Each value will be made available within the `PrivateState` under the corresponding property name.

            <Content name="code">
                <CodeSnippet /* fiddle="F3RHqb0x" */>{`
                    const UserData = ({userId}) => (
                        <cx>
                            <PrivateState
                                data={{
                                    userId: userId
                                }}
                                controller={{ 
                                    onInit() {
                                        this.addTrigger("loadUser", ["userId"], () => this.loadData(), true);
                                    },
                                    async loadData() {
                                        this.store.set("loading", true);
                                        let id = this.store.get("userId");
                                        let user = await getUser(id);
                                        this.store.set("user", user);
                                        this.store.set("loading", false);
                                    }
                                }}
                                layout={UseParentLayout}
                            >   
                                <strong>User data <Icon name="loading" visible-bind="loading"/></strong>
                                <TextField label="Name" value-bind="user.name" />
                                <TextField label="Phone" value-bind="user.phone" />
                                <TextField label="City" value-bind="user.city" />
                            </PrivateState>
                        </cx>
                    );
                    ...
                    <LabelsLeftLayout>
                        <LookupField label="Sender" value-bind="$page.senderId" options-bind="$page.users" optionTextField="name" />
                        <UserData userId-bind="$page.senderId" />
                    </LabelsLeftLayout>
                    <LabelsLeftLayout>
                        <LookupField label="Receiver" value-bind="$page.receiverId" options-bind="$page.users" optionTextField="name" />
                        <UserData userId-bind="$page.receiverId" />
                    </LabelsLeftLayout>
                `}</CodeSnippet>
            </Content>


            <div class="widgets"
               // style="display: flex;"
                controller={PageController}   
            >   
                <LabelsLeftLayout>
                    <LookupField label="Sender" value-bind="$page.senderId" options-bind="$page.users" optionTextField="name" />
                    <UserData userId-bind="$page.senderId" />
                </LabelsLeftLayout>
                <LabelsLeftLayout>
                    <LookupField label="Receiver" value-bind="$page.receiverId" options-bind="$page.users" optionTextField="name" />
                    <UserData userId-bind="$page.receiverId" />
                </LabelsLeftLayout>
            </div>

            In the example above, `userId` bindings within the `UserData` instances represent parent store's `$page.senderId` and `$page.receiverId` values
            respectivly.

    
            
            Parent (global) Store values for `$page.userId1` and `$page.userId2` are available within the `PrivateStore` simply as `userId`.

            We define the `data` property as a configuration object where any number of global store bindings are listed that will be 
            available within the PrivateStore under the the corresponding property name. 
            For example, we pass an outer binding ()
            
            we are passing different `userIds` to the UserStats widgets, they are both showing identical graphs
            because both instances are using the same Store binding for the data - `$page.userData`, and the widget that was loaded last
            simply overwrites the existing data.

        </CodeSplit>

        To solve this problem, we can use `PrivateState` to isolate the parts of the Store that are used within a widget.
        This way we can have as many instances as we want, without worrying about Store pollution.
                

        ### Passing bindings to PrivateState

        In the example above we hardcoded the `userId` values that were passed to the `UserStats` widgets.
        Normally we will use data from the store, so we will need to pass the `userId` as a Store binding.

       

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

