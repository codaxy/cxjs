import {HtmlElement, Content, Checkbox, Repeater, FlexBox, TextField, NumberField, Button, MsgBox} from 'cx/widgets';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {Controller, LabelsTopLayout, LabelsLeftLayout} from 'cx/ui';
import {ImportPath} from 'docs/components/ImportPath';
import {MethodTable} from '../../components/MethodTable';
import {computable, updateArray} from 'cx/data';

class PageController extends Controller {
    onInit() {
        this.store.init('$page', {
            name: 'Jane',
            disabled: true,
            todoList: [
                {id: 1, text: 'Learn CxJS', done: true},
                {id: 2, text: "Feed the cat", done: false},
                {id: 3, text: "Take a break", done: false}
            ],
            count: 0
        });
    }

    greet() {
        let name = this.store.get('$page.name')
        MsgBox.alert(`Hello, ${name}!`);
    }
}

export const PrivateState = <cx>

    <Md>
        # Private State

        <ImportPath path="import { PrivateState } from 'cx/widgets';"/>

        It is very convenient to create reusable functional components by combining already existing Cx widgets. For example, let's 
        say we have a component that is in charge of fetching and displaying some data. Idealy, we would want to just pass the necessary 
        parameters and have the component do the rest. If we try to reuse this component elsewhere, it will polute
        the global Store with the data it uses. This can potentially cause a problem, since different parts of the application can edit
        each other's store data.

        `PrivateState`, as the name suggests, provides a private Store within a component, that can share only certain parts of the data
        with the global Store instance. This lets us enjoy the benefits of managing component data with Cx Store while allowing our 
        reusable components to have their own private state at the same time.


        ### Principles

        - The whole application state is stored in the object tree within a single Store.
        - The state is immutable. On every change, a new copy of the state is created containing the updated values.
        - The only way to change the state is through the use of two-way data binding or the Store methods.

        ### Store methods

        In order to simplify working with immutable data, the Store exposes a set of public methods that can be used to
        manage the application state.

        <MethodTable methods={[{
            signature: 'Store.init(path, value)',
            description: <cx><Md>
                Saves `value` in the Store under the given `path`.
                If the `path` is already taken, it returns `false` without overwriting the existing value.
                Otherwise, saves the `value` and returns `true`.
            </Md></cx>
        }, {
            signature: 'Store.set(path, value)',
            description: <cx><Md>
                Saves `value` in the Store under the given `path`.
                Any existing data stored under that `path` gets overwritten.
            </Md></cx>
        }, {
            signature: 'Store.get(path)',
            description: <cx><Md>
                The `get` method is used to read the data from the store under the given `path`.
                The method can take multiple arguments or an array of strings representing paths.
            </Md></cx>
        }, {
            signature: 'Store.delete(path)',
            description: <cx><Md>
                Removes data from the Store stored under the given `path`.
            </Md></cx>
        }, {
            signature: 'Store.update(path, updateFn, ...args)',
            description: <cx><Md>
                Applies the `updateFn` to the data stored under the given `path`. `args` can contain additional
                parameters that will be passed to the `updateFn`.
            </Md></cx>
        }, {
            signature: 'Store.toggle(path)',
            description: <cx><Md>
                Toggles the boolean value stored under the given `path`.
            </Md></cx>
        }, {
            signature: 'Store.copy(from, to)',
            description: <cx><Md>
                Copies the value stored under the `from` path and saves it under the `to` path.
            </Md></cx>
        }, {
            signature: 'Store.move(from, to)',
            description: <cx><Md>
                Copies the value stored under the `from` path and saves it under the `to` path.
                Afterwards, the `from` entry is deleted from the Store.
            </Md></cx>
        }, {
            signature: 'Store.getData()',
            description: <cx><Md>
                Returns a reference to the object representing the application state.
            </Md></cx>
        }, {
            signature: 'Store.notify(path)',
            description: <cx><Md>
                Notifies Store subscribers about the change. Usually, notifications cause the application to re-render.
                This method automatically occurs whenever a change is made.
                Optional `path` argument is provided to indicate where the change occurred.
            </Md></cx>
        }, {
            signature: 'Store.silently(callback)',
            description: <cx><Md>
                `silently` method is used to perform data changes without notifications.
                Changes made this way will not reflect in the UI until the application is rendered again.

                The Store instance is passed to the `callback` function.
            </Md></cx>
        }, {
            signature: 'Store.batch(callback)',
            description: <cx><Md>
                `batch` method is used to perform multiple Store operations silently and afterwards send
                a notification only once. This causes the application to be re-rendered only once even if multiple
                changes occurred.

                The Store instance is passed to the `callback` function.
            </Md></cx>
        }, {
            signature: 'Store.dispatch(action)',
            description: <cx><Md>
                `dispatch` method is used for dispatching actions.
                This method is available only if the application Store is based on a Redux store (See
                [cx-redux](https://www.npmjs.com/package/cx-redux) package).
            </Md></cx>
        }, {
            signature: 'Store.load(data)',
            description: <cx><Md>
                Loads `data` object into the Store. This method is used to restore the application state when doing Hot
                Module Replacement.
            </Md></cx>
        }]}/>

        ### Examples

        In the examples below we will explore the most common ways to use the Store in CxJS:
        - inside Controllers (store is available via `this.store`)n
        - through two-way data binding ([explained here](~/concepts/data-binding))
        - inside event handlers

        <CodeSplit>

            ## `init`

            The `init` method is typically used inside the Controller's `onInit` method to initialize the data.
            It takes two arguments, `path` and `value`. The `path` is a string which is used as a key for storing the
            `value`. If the `path` is already taken, the method returns `false` without overwriting the existing value.
            Otherwise, it saves the `value` and returns `true`.

            <Content name="code">
                <CodeSnippet fiddle="fMy6p8FB">{`
                    class PageController extends Controller {
                        onInit() {
                            this.store.init('$page', {
                                name: 'Jane',
                                disabled: true,
                                todoList: [
                                    { id: 1, text: 'Learn Cx', done: true }, 
                                    { id: 2, text: "Feed the cat", done: false },
                                    { id: 3, text: "Take a break", done: false }
                                ],
                                count: 0
                            });
                        }
                    
                        greet() {
                            let name = this.store.get('$page.name')
                            MsgBox.alert(\`Hello, \${name}!\`);
                        }
                    }
                    ...

                    <div layout={LabelsTopLayout} controller={PageController}>
                        <TextField label="Name" value:bind="$page.name" />
                        <Button onClick="greet">Greet</Button>
                    </div>
                `}
                </CodeSnippet>
            </Content>
        </CodeSplit>


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
                <div layout={LabelsTopLayout} controller={PageController}>
                    <TextField label="Name" value:bind='$page.name'/>
                    <Button onClick="greet">Greet</Button>
                </div>
            </div>
        </CodeSplit>

        ## `set`

        <CodeSplit>

            The `set` method is used to update data in the Store. It takes two arguments, `path` and `value`.
            Any existing data stored under the given `path` will be overwritten.
            In this example, we are accessing the Store from inside an event handler.
            In CxJS, all event handlers receive at least two arguments, `event` and `instance`.
            The `instance` represents the CxJS widget that triggered the event and we can use it to obtain the Store.

            <div class="widgets">
                <div layout={LabelsTopLayout}>
                    <TextField label="Name" value:bind="$page.name" disabled:bind="$page.disabled"/>
                    <Button onClick={(e, instance) => {
                        let {store} = instance;
                        store.set('$page.disabled', !store.get('$page.disabled'));
                    }}
                            text={computable('$page.disabled', (disabled) => disabled ? "Enable input" : "Disable input")}
                    />
                </div>
            </div>

            In this example, the [`computable`](~/concepts/data-binding#computables) function is used to dynamically
            calculate the button text, depending on the `$page.disabled` value.

            <Content name="code">
                <CodeSnippet fiddle="RzBoFq52">{`
                    <div layout={LabelsTopLayout} >
                        <TextField label="Name" value:bind="$page.name" disabled:bind="$page.disabled" />
                        <Button onClick={(e, instance) => {
                                let {store} = instance;
                                store.set('$page.disabled', !store.get('$page.disabled'));
                            }}
                            text={computable('$page.disabled', (disabled) => disabled ? "Enable input" : "Disable input")}   
                        />
                    </div>
                `}
                </CodeSnippet>
            </Content>

        </CodeSplit>

        <CodeSplit>

            ## `toggle`

            The `toggle` method is used for inverting boolean values inside the Store.
            Below is the same example, only this time done using `toggle`.

            <div class="widgets">
                <div layout={LabelsTopLayout}>
                    <TextField label="Name" value:bind="$page.name" disabled:bind="$page.disabled"/>
                    <Button
                        onClick={(e, {store}) => {
                            store.toggle('$page.disabled');
                        }}
                        text={computable('$page.disabled', (disabled) => disabled ? "Enable input" : "Disable input")}
                    />
                </div>
            </div>

            You can also make the code more compact by doing destructuring right inside the function declaration.

            <Content name="code">
                <CodeSnippet fiddle="tBnXbiZo">{`
                    <div layout={LabelsTopLayout} >
                        <TextField label="Name" value:bind="$page.name" disabled:bind="$page.disabled" />
                        <Button
                            onClick={(e, {store}) => {
                                store.toggle('$page.disabled');
                            }}
                            text={computable('$page.disabled', (disabled) => disabled ? "Enable input" : "Disable input")}   
                        />
                    </div>
                `}
                </CodeSnippet>
            </Content>

        </CodeSplit>

        ## `delete`

        <CodeSplit>

            The `delete` method is used to remove data from the Store. It takes a single parameter it being the `path`
            under which the value is stored.

            <div class="widgets">
                <div layout={LabelsTopLayout}>
                    <TextField value:bind="$page.name" label="Name"/>
                    <Button onClick={(e, {store}) =>
                        store.delete('$page.name')
                    }>
                        Clear
                    </Button>
                </div>
            </div>

            <Content name="code">
                <CodeSnippet fiddle="d8JViIoe">{`
                    <div layout={LabelsTopLayout}>
                        <TextField value:bind="$page.name" label="Name" />
                        <Button onClick={(e, {store}) =>
                            store.delete('$page.name')
                        }>
                            Clear
                        </Button>
                    </div>
                `}
                </CodeSnippet>
            </Content>

        </CodeSplit>

        ## `copy`

        <CodeSplit>

            The `copy` method is used to copy data from one path to another. It takes two parameters, the origin path
            and the destination path. Any existing data stored under the destination path is overwritten.

            <div class="widgets">
                <div layout={LabelsTopLayout}>
                    <TextField label="Text" value:bind="$page.name"/>
                    <TextField label="Copied text" value:bind="$page.copyDestination" placeholder="click Copy"/>
                    <Button onClick={(e, {store}) => {
                        store.copy('$page.name', '$page.copyDestination');
                    }}>Copy</Button>
                </div>
            </div>

            <Content name="code">
                <CodeSnippet fiddle="vKZrbYe4">{`
                    <div layout={LabelsTopLayout}>
                        <TextField label="Origin" value:bind="$page.name" />
                        <TextField label="Destination" value:bind="$page.copyDestination" placeholder="click Copy" />
                        <Button onClick={(e, {store}) => {
                            store.copy('$page.name', '$page.copyDestination');    
                        }}>Copy</Button>
                    </div>
                `}
                </CodeSnippet>
            </Content>

        </CodeSplit>

        ## `move`

        <CodeSplit>

            The `move` method is similar to the `copy` method. The only difference is that it removes the data
            from the Store after creating a copy. Any existing data stored under the destination path is overwritten.

            <div class="widgets">
                <div layout={LabelsTopLayout}>
                    <TextField label="Text" value:bind="$page.name"/>
                    <TextField label="Moved text" value:bind="$page.moveDestination" placeholder="click Move"/>
                    <Button onClick={(e, {store}) => {
                        store.move('$page.name', '$page.moveDestination');
                    }}>Move</Button>
                </div>
            </div>

            <Content name="code">
                <CodeSnippet fiddle="E4BOtF4S">{`
                    <div layout={LabelsTopLayout}>
                        <TextField label="Origin" value:bind="$page.name" />
                        <TextField label="Destination" value:bind="$page.moveDestination" placeholder="click Move" />
                        <Button onClick={(e, {store}) => {
                            store.move('$page.name', '$page.moveDestination'); 
                        }}>Move</Button>
                    </div>
                `}
                </CodeSnippet>
            </Content>

        </CodeSplit>

        ## `update`

        The `update` method is primarily used to perform an update that is dependant on the previous state.
        This simplifies use-cases where the developer would use the `get` method to read a value, perform
        calculation, and then use the `set` method to save the result to the Store.

        `update` method requires two parameters, `path` under which the value is stored and an update function
        `updateFn`. As an option any additional arguments will be passed over to the update function.

        <CodeSplit>

            The simplest example of when to use the `update` method is the counter widget. On click, the `update` method
            reads the current count from the Store, passes it to the `updateFn`, takes the returned value and writes
            it back to the Store.

            <div class="widgets">
                <div layout={LabelsTopLayout}>
                    <NumberField label="Count" value:bind="$page.count" style="width: 50px"/>
                    <Button onClick={(e, {store}) => {
                        store.update('$page.count', count => count + 1);
                    }}>+1</Button>
                </div>
            </div>

            `updateFn` receives the initial value as a first argument followed by any additional arguments that
            are provided by the developer. The function must return either the updated value, or the initial value if no
            changes are made.
            This helps the Store to determine the state changes more efficiently. It's important to note that `updateFn`
            should be a pure function, without any side effects, e.g. direct object or array mutations.

            <Content name="code">
                <CodeSnippet fiddle="t5fbQpxq">{`
                    <div layout={LabelsTopLayout}>
                        <NumberField label="Count" value:bind="$page.count" style="width: 50px"/>
                        <Button onClick={(e, {store}) => {
                            store.update('$page.count', count => count + 1); 
                        }}>+1</Button>
                    </div>
                `}
                </CodeSnippet>
            </Content>

        </CodeSplit>

        ## Update Functions

        <ImportPath path="import {updateArray, append, merge, filter, updateTree} from 'cx/data';"/>

        CxJS provides a set of commonly used update functions, which are listed below.
        We will be showing you an example for the `updateArray` function, as one of the most commonly used update
        functions.
        Other functions are listed in the table below.

        ### `updateArray`

        <CodeSplit>

            `updateArray` takes three arguments: `array` that needs to be updated, `updateCallback` and `itemFilter`
            functions.

            <div class="widgets">
                <div layout={LabelsLeftLayout}>
                    <strong>Todo List</strong>
                    <Repeater records:bind="$page.todoList">
                        <Checkbox value:bind="$record.done" text:bind="$record.text"/>
                        <br/>
                    </Repeater>
                    <Button
                        onClick={(e, {store}) => {
                            store.update(
                                "$page.todoList",
                                updateArray,
                                item => ({
                                    ...item,
                                    done: true
                                }),
                                item => !item.done
                            );
                        }}
                    >
                        Mark all as done
                    </Button>
                </div>
            </div>

            <Content name="code">
                <CodeSnippet fiddle="u89Crydo">{`
                    <div class="widgets">
                        <div layout={LabelsLeftLayout}>
                            <strong>Todo List</strong>
                            <Repeater records:bind="$page.todoList">
                                <Checkbox value:bind="$record.done" text:bind="$record.text" />
                                <br />
                            </Repeater>
                            <Button
                                onClick={(e, { store }) => {
                                    store.update(
                                        "$page.todoList",
                                        updateArray,
                                        item => ({
                                            ...item,
                                            done: true
                                        }),
                                        item => !item.done
                                    );
                                }}
                            >
                                Mark all as done
                            </Button>
                        </div>
                    </div>
                `}
                </CodeSnippet>
            </Content>

            Each item is passed through the `itemFilter` function, if one is provided.
            If `itemFilter` returns true, the item is than passed to the `updateCallback` function, which returns the
            updated value.
            Finally, `updateArray` function either creates the updated copy, or returns the original array, if no
            changes were made.

        </CodeSplit>

        <MethodTable methods={[{
            signature: 'merge(item, data)',
            description: <cx><Md>
                `merge` function takes two arguments, `item` and `data`, and merges them into a single object.
                The function returns the original object if no changes were made.
            </Md></cx>
        }, {
            signature: 'updateArray(array, updateCallback, itemFilter, removeFilter)',
            description: <cx><Md>
                `updateArray` function takes four arguments: `array` that needs to be updated, `updateCallback`,
                `itemFilter` and `removeFilter` functions. `itemFilter` is optional and it can be used to select
                elements that
                need to be updated. `removeFilter` is also optional and it can be used to filter out elements from the
                list.
                If no changes are made, the function will return the original array.
            </Md></cx>
        }, {
            signature: 'append(array, ...items)',
            description: <cx><Md>
                `append` function takes a number of arguments. First argument is the `array` to which all subsequent
                arguments will be appended.
            </Md></cx>
        }, {
            signature: 'filter(array, callback)',
            description: <cx><Md>
                `filter` function works just like the `Array.prototype.filter` function the difference being that it
                returns the original array if none of the items were filtered out.
            </Md></cx>
        }, {
            signature: 'updateTree(array, updateCallback, itemFilter, childrenProperty, removeFilter)',
            description: <cx><Md>
                `updateTree` is similar to `updateArray`, the difference being that it can be applied to tree
                structures on multiple levels. It basically applies the `updateArray` function to each item's children.
                `childrenProperty` specifies where child nodes are stored. Default value is `$children`.
                If no changes were made, the function returns the original array.
            </Md></cx>
        }, {
            signature: 'removeTreeNodes(array, criteria, childrenProperty)',
            description: <cx><Md>
                `removeTreeNodes` removes all tree nodes that satisfy the given criteria.
                `childrenProperty` specifies where child nodes are stored. Default value is `$children`.
            </Md></cx>
        }, {
            signature: 'findTreeNode(array, criteria, childrenProperty)',
            description: <cx><Md>
                `findTreeNode` scans the tree using the depth-first search algorithm until it finds
                a node that satisfies the given search criteria. `criteria` is a predicate function that takes a node object 
                as input and returns `true` or `false`, based on the search criteria.
                `childrenProperty` specifies where child nodes are stored. Default value is `$children`.
                `findTreeNode` returns the first node object that satisfies the search criteria.
            </Md></cx>
        }]}/>
    </Md>
</cx>

