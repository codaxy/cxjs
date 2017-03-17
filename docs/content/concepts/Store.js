import { HtmlElement, Content, Checkbox, Repeater, FlexBox, TextField, Button, MsgBox } from 'cx/widgets';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {Controller, LabelsTopLayout} from 'cx/ui';
import {ImportPath} from 'docs/components/ImportPath';
import {MethodTable} from '../../components/MethodTable';
import { computable } from 'cx/data';

//import {store} from '../../app/store';

class PageController extends Controller {
    init() {
        super.init();
        this.store.init('$page', {
            name: 'Jane',
            disableInput: true,
            list: ['item 1', 'item 2', 'item 3'],
            origin: "Text data"
        });
    }

    greet() {
        MsgBox.alert(`Hello, ${this.store.get('$page.name')}!`);
    }
}

export const Store = <cx>

    <Md>
        # Store

        <ImportPath path="import { Store } from 'cx/data';" />

        Widgets rely on central data repository called `store`.

        - Widgets use stored data to calculate data required for rendering (data binding process).
        - Widgets react on user inputs and update the store either directly (two-way bindings) or by dispatching
        actions which are translated into new application state (see Redux).
        - Store sends change notifications which produce a new rendering of the widget tree and DOM update.

        ### Principles
                    
        - The state of the whole application is stored in an object tree within a single store.
        - The state is immutable. On every change, a new copy of the state is created containing the updated values.
        - The only way to change the state is through store methods or with the use of two-way data binding.

        ### Store methods
        
        The Store instantiation is already shown on our [Step by Step](~/intro/step-by-step#application-entry-point) page, so it will be omitted here.
        In order to enforce the proclaimed principles, the Store exposes a set of public methods that can be used to manage the application state. 
            

        <MethodTable methods={[{
           signature: 'Store.init(path, value)',
           description: <cx><Md>
              Saves `value` to the store under the given `path`. 
              If the `path` is already taken, returns `false` without overwriting the existing value. 
              Otherwise, saves the `value` and returns `true`.
           </Md></cx>
        }, {
           signature: 'Store.set(path, value)',
           description: <cx><Md>
              Saves `value` to the store under the given `path`. 
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
              Removes data from the store, stored under the given `path`.
           </Md></cx>
        }, {
           signature: 'Store.update(path, updateFn, ...args)',
           description: <cx><Md>
              Applies the `updateFn` to the data stored under the given `path`. `args` can contain additional parameters
              used by the `updateFn`.
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
              Afterwards, the `from` entry is deleted from the store.
           </Md></cx>
        }, {
           signature: 'Store.getData()',
           description: <cx><Md>
              Returns a reference to the object tree representing the application state. 
              It is typically used for debugging and Hot Module Replacement.
           </Md></cx>
        }]}/>
         
        ### Examples
        
        In the examples below we'll explore the most common ways to use the Store in Cx:
        - inside Controllers (they have direct access to the Store via `this.store`)
        - through two-way data binding (explained [here](~/concepts/data-binding))
        - inside event handlers
        
        <CodeSplit>

            ## `init`      

            The `init` method is typically used inside the Controller's `init` method to initilize the data on first page load.
            It takes two arguments, `path` and `value`. The `path` is a string which is used as a key for storing the `value`. 
            If the `path` is already taken, the method returns `false` without overwriting the existing value. 
            Otherwise it saves the `value` and returns `true`.

            <Content name="code">
                <CodeSnippet>{`
                    class PageController extends Controller {
                        init() {
                            super.init();
                            this.store.init('$page', {
                                name: 'Jane',
                                disableInput: true,
                                list: ['item 1', 'item 2', 'item 3'],
                                origin: "Text data"
                            });
                        }
                    
                        greet() {
                            MsgBox.alert(\`Hello, \${this.store.get('$page.name')}!\`);
                        }
                    }

                    ...

                    <div class="widgets">
                        <div>
                           <TextField value:bind="dataset1.text" />
                        </div>
                    </div>
                `}
                </CodeSnippet>
            </Content>
        </CodeSplit>


        ## `get`

        The `get` method is used to read data from the Store. It takes one parameter, the `path` under which the value is stored. 
        In the previous example, the `greet` method inside the controller is invoking the `Store.get` method to read the name from the Store.
        Notice how we are able to directly access a certain property (`$page.name`) by using the `.` in our `path` string. 

        **Note on `path`:** Think of `path` as a property accessor of our data object. 
        Infact, paths containing dots are mapped to the corresponding object tree structures inside the store. This is also used in two-way data binding.
        The `$` prefix is not obligatory, it's more of a convention, indicating that this data is only used on the current page. 
        
        <CodeSplit>
            <div class="widgets">
                <div layout={LabelsTopLayout} controller={PageController}>
                    <TextField label="Name" value:bind='$page.name' readOnly />
                    <Button onClick="greet">Greet</Button>
                </div>
            </div>
        </CodeSplit>

        ## `set`

        <CodeSplit>

            The `set` method is typically used to update data in the Store. It takes two arguments, `path` and `value`. Any existing data stored
            under the given `path` gets overwritten. 
            In this example, we are accesing the Store from inside an event handler. In Cx, all event handlers are passed two arguments, `event` and `instance`.
            `instance` represents the Cx widget that fired the event, and we are using it to obtain the access to the Store instance.      
        
            <div class="widgets">
                <div layout={LabelsTopLayout} >
                    <TextField label="Name" value:bind="$page.name" disabled:bind="$page.disableInput" />
                    <Button onClick={(e, instance) => {
                            let {store} = instance;
                            store.set('$page.disableInput', !store.get('$page.disableInput'));
                        }}
                        text={computable('$page.disableInput', (disableInput) => disableInput ? "Enable input" : "Disable input")}   
                    />
                </div>
            </div>
            We are also using the [`computable`](~/concepts/data-binding#computables) function to dynamically change the button text, 
            depending on the `$page.disableInput` value.

            <Content name="code">
                <CodeSnippet>{`
                    <div layout={LabelsTopLayout} >
                        <TextField label="Name" value:bind="$page.name" disabled:bind="$page.disableInput" />
                        <Button onClick={(e, instance) => {
                                let {store} = instance;
                                store.set('$page.disableInput', !store.get('$page.disableInput'));
                            }}
                            text={computable('$page.disableInput', (disableInput) => disableInput ? "Enable input" : "Disable input")}   
                        />
                    </div>
                `}
                </CodeSnippet>
            </Content>

        </CodeSplit>

        <CodeSplit>

            ## `toggle`      

            Toggling boolean values inside the Store is quite common, and the `toggle` method provides a more practical way to do it.
            Below is the same example, only this time done using `toggle`.
        
            <div class="widgets">
                <div layout={LabelsTopLayout} >
                    <TextField label="Name" value:bind="$page.name" disabled:bind="$page.disableInput" />
                    <Button onClick={(e, instance) => {
                            let {store} = instance;
                            store.toggle('$page.disableInput');
                        }}
                        text={computable('$page.disableInput', (disableInput) => disableInput ? "Enable input" : "Disable input")}   
                    />
                </div>
            </div>

            <Content name="code">
                <CodeSnippet>{`
                    <div layout={LabelsTopLayout} >
                        <TextField label="Name" value:bind="$page.name" disabled:bind="$page.disableInput" />
                        <Button onClick={(e, instance) => {
                                let {store} = instance;
                                store.toggle('$page.disableInput');
                            }}
                            text={computable('$page.disableInput', (disableInput) => disableInput ? "Enable input" : "Disable input")}   
                        />
                    </div>
                `}
                </CodeSnippet>
            </Content>

        </CodeSplit>

        ## `delete`

        <CodeSplit>

            The `delete` method is used to remove data from the store. It takes one parameter, the `path` under which the value is stored.
        
            <div class="widgets">
                <div layout={LabelsTopLayout}>
                    <TextField value:bind="$page.name" label="Name" />
                    <Button onClick={(e, {store}) =>
                        store.delete('$page.name')
                    }>
                        Clear
                    </Button>
                </div>
            </div>

            <Content name="code">
                <CodeSnippet>{`
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

            The `copy` method is used to copy data from one path to another. It takes two parameters, the origin path and the destination path.
            Any existing data stored under the destination path is overwritten.
        
            <div class="widgets">
                <div layout={LabelsTopLayout}>
                    <TextField label="Origin" value:bind="$page.origin" placeholder="original data" />
                    <TextField label="Destination" value:bind="$page.copyDestination" placeholder="copied data" />
                    <Button onClick={(e, {store}) => {
                        store.copy('$page.origin', '$page.copyDestination');    
                    }}>Copy</Button>
                </div>
            </div>

            <Content name="code">
                <CodeSnippet>{`
                    <div layout={LabelsTopLayout}>
                        <TextField label="Origin" value:bind="$page.origin" placeholder="original data" />
                        <TextField label="Destination" value:bind="$page.copyDestination" placeholder="copied data" />
                        <Button onClick={(e, {store}) => {
                            store.copy('$page.origin', '$page.copyDestination');    
                        }}>Copy</Button>
                    </div>
                `}
                </CodeSnippet>
            </Content>

        </CodeSplit>

        ## `move`

        <CodeSplit>

            The `move` method is simmilar to the `copy` method, with the difference that it removes the original data
            from the Store after creating a copy. Any existing data stored under the destination path is overwritten.
        
            <div class="widgets">
                <div layout={LabelsTopLayout}>
                    <TextField label="Origin" value:bind="$page.origin" placeholder="original data" />
                    <TextField label="Destination" value:bind="$page.moveDestination" placeholder="moved data" />
                    <Button onClick={(e, {store}) => {
                        store.move('$page.origin', '$page.moveDestination'); 
                    }}>Move</Button>
                </div>
            </div>

            <Content name="code">
                <CodeSnippet>{`
                    <div layout={LabelsTopLayout}>
                        <TextField label="Origin" value:bind="$page.origin" placeholder="original data" />
                        <TextField label="Destination" value:bind="$page.moveDestination" placeholder="moved data" />
                        <Button onClick={(e, {store}) => {
                            store.move('$page.origin', '$page.moveDestination'); 
                        }}>Move</Button>
                    </div>
                `}
                </CodeSnippet>
            </Content>

        </CodeSplit>


         ## Updating arrays

         <ImportPath path="import { updateArray } from 'cx/data';" />      

         `updateArray` function can be used for updating array data structures inside the `store`. 
         The function either creates the updated copy, or returns the original array, if no changes were made.

         <MethodTable methods={[{
            signature: 'updateArray(array, updateCallback, itemFilter)',
            description: <cx><Md>
                `updateArray` function takes three arguments: `array` that needs to be updated, `updateCallback` and `itemFilter` functions.
                `itemFilter` is optional.
            </Md></cx>
         }]}/>

        
    </Md>
</cx>

