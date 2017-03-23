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
                {id: 1, text: 'Learn Cx', done: true},
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

export const Store = <cx>

    <Md>
        # Store

        <ImportPath path="import { Store } from 'cx/data';"/>

        Cx widgets are tightly connected to a central data repository called `Store`.

        - Widgets access stored data to calculate data required for rendering (data binding process).
        - Widgets react on user inputs and update the Store either directly (two-way bindings) or by dispatching
        actions which are translated into new application state.
        - Store sends change notifications which produce a new rendering of the widget tree and DOM update.

        ### Principles

        - The state of the whole application is stored in an object tree within a single Store.
        - The state is immutable. On every change, a new copy of the state is created containing the updated values.
        - The only way to change the state is through Store methods or with the use of two-way data binding.

        ### Store methods

        The Store instantiation is already shown on our [Step by Step](~/intro/step-by-step#application-entry-point)
        page, so it will be omitted here.
        In order to enforce the proclaimed principles, the Store exposes a set of public methods that can be used to
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
                The `get` method can take any number of arguments or an array of strings representing paths,
                and returns the corresponding values.
            </Md></cx>
        }, {
            signature: 'Store.delete(path)',
            description: <cx><Md>
                Removes data from the Store, stored under the given `path`.
            </Md></cx>
        }, {
            signature: 'Store.update(path, updateFn, ...args)',
            description: <cx><Md>
                Applies the `updateFn` to the data stored under the given `path`. `args` can contain additional
                parameters used by the `updateFn`.
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
                This method is automatically called whenever a change is made.
                Optional `path` argument can be provided to indicate where the change occurred.
            </Md></cx>
        }, {
            signature: 'Store.silently(callback)',
            description: <cx><Md>
                `silently` method can be used to perform data changes which do not fire notifications, that is, cause re-render.
                The Store instance is passed to the `callback` function.
            </Md></cx>
        }, {
            signature: 'Store.batch(callback)',
            description: <cx><Md>
                `batch` method can be used to perform multiple Store operations silently and re-render the application
                only once afterwards.
                The Store instance is passed to the `callback` function.
            </Md></cx>
        }, {
            signature: 'Store.dispatch(action)',
            description: <cx><Md>
                `dispatch` method is useful if the Store is used in combination with Redux. This method is available
                only if application Store is based on a Redux store (See [cx-redux](https://www.npmjs.com/package/cx-redux) package).
            </Md></cx>
        }, {
            signature: 'Store.load(data)',
            description: <cx><Md>
                Loads `data` object into the Store. This method is used to restore the application state when doing Hot
                Module Replacement.
            </Md></cx>
        }]}/>

        ### Examples

        In the examples below we'll explore the most common ways to use the Store in Cx:
        - inside Controllers (store is available via `this.store`)
        - through two-way data binding ([explained here](~/concepts/data-binding))
        - inside event handlers

        <CodeSplit>

            ## `init`

            The `init` method is typically used inside the Controller's `onInit` method to initialize the data.
            It takes two arguments, `path` and `value`. The `path` is a string which is used as a key for storing the
            `value`. If the `path` is already taken, the method returns `false` without overwriting the existing value.
            Otherwise it saves the `value` and returns `true`.

            <Content name="code">
                <CodeSnippet fiddle="fMy6p8FB">{`
                    class PageController extends Controller {
                        onInit() {
                            this.store.init('$page', {
                                name: 'Jane',
                                disable: true,
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
                `}
                </CodeSnippet>
            </Content>
        </CodeSplit>


        ## `get`

        The `get` method is used to read data from the Store. It takes any number of arguments or an array of strings
        representing paths,
        and returns the corresponding values. In the previous example, the `greet` method inside the controller is
        invoking the `Store.get` method to read the name from the Store.
        Notice how we are able to directly access a certain property (`$page.name`) by using the `.` in our `path`
        string.

        **Note on `path`:** Think of `path` as a property accessor of our data object.

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
            Any existing data stored under the given `path` gets overwritten.
            In this example, we are accesing the Store from inside an event handler.
            In Cx, all event handlers are passed at least two arguments, `event` and `instance`.
            `instance` represents the Cx widget that fired the event, and we are using it to obtain the access to the
            Store.

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
            We are also using the [`computable`](~/concepts/data-binding#computables) function to dynamically change the
            button text, depending on the `$page.disabled` value.

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

            Toggling boolean values inside the Store is quite common, and the `toggle` method provides a more practical
            way to do it.
            Below is the same example, only this time done using `toggle`.

            <div class="widgets">
                <div layout={LabelsTopLayout}>
                    <TextField label="Name" value:bind="$page.name" disabled:bind="$page.disabled"/>
                    <Button onClick={(e, {store}) => {
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
                        <Button onClick={(e, {store}) => {
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

            The `delete` method is used to remove data from the Store. It takes one parameter, the `path` under which
            the value is stored.

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
            and the destination path.
            Any existing data stored under the destination path is overwritten.

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

            The `move` method is similar to the `copy` method, with the difference that it removes the data
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

        The `update` method is primarily used to perform Store updates that are dependant on the previous state.
        This simplifies use-cases where we would typically use the `get` method to read a value, perform some
        calculation on it, and than use the `set` method to save the new value to the Store.
        `update` method requires two parameters, `path` under which the value is stored and an update function
        `updateFn`.
        Optionally, additional arguments can be provided, that are used by the update function.

        <CodeSplit>

            The simplest example of when to use the `update` method is the counter widget. On click, the `update` method
            reads the current
            count from the Store, passes it to the `updateFn`, takes the returned value and writes it back to the Store.

            <div class="widgets">
                <div layout={LabelsTopLayout}>
                    <NumberField label="Count" value:bind="$page.count" style="width: 50px"/>
                    <Button onClick={(e, {store}) => {
                        store.update('$page.count', count => count + 1);
                    }}>+1</Button>
                </div>
            </div>

            `updateFn` should receive the initial value as a first argument followed by any additional arguments that
            are
            provided, and should return **either the updated value, or the initial value, if no changes were made**.
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

        Cx provides a set of commonly used update functions, which are listed below.
        We will go through an example for the `updateArray` function, as one of the most commonly used update functions.
        Other functions can be looked up in the table below.

        ### `updateArray`

        <CodeSplit>

            `updateArray` takes three arguments: `array` that needs to be updated, `updateCallback` and `itemFilter`
            functions.

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
            signature: 'updateArray(array, updateCallback, itemFilter)',
            description: <cx><Md>
                `updateArray` function takes three arguments: `array` that needs to be updated, `updateCallback` and
                `itemFilter` functions. `itemFilter` is optional. 
                It returns the original array if no changes were made. Otherwise, a new array is returned.
            </Md></cx>
        }, {
            signature: 'merge(item, data)',
            description: <cx><Md>
                `merge` function takes two arguments, `item` and `data`, and attempts to merge `data` with the `item`
                object. It returns the original object if no changes were made. Otherwise, a new object is returned.
            </Md></cx>
        }, {
            signature: 'updateTree(array, updateCallback, itemFilter, childrenProperty)',
            description: <cx><Md>
                `updateTree` is similar to `updateArray`, with the difference that it can be applied to array tree
                structures multiple levels deep. It basically applies `updateArray` function to each item's children.
                If no changes were made, it returns the original array. Otherwise, a new array is returned.
            </Md></cx>
        }, {
            signature: 'append(array, ...items)',
            description: <cx><Md>
                `append` function takes any number of arguments. First argument is the `array` to which all subsequent
                arguments will be appended.
                If no changes were made, it returns the original array. Otherwise, a new array is returned.
            </Md></cx>
        }, {
            signature: 'filter(array, callback)',
            description: <cx><Md>
                `filter` function works just like the `Array.prototype.filter` function with the difference that it
                returns the original array if none of the items were filtered out.
            </Md></cx>
        }]}/>
    </Md>
</cx>

