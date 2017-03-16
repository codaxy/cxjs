import { HtmlElement, Content, Checkbox, Repeater, FlexBox, TextField, Button, MsgBox } from 'cx/widgets';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {Controller} from 'cx/ui';
import {ImportPath} from 'docs/components/ImportPath';
import {MethodTable} from '../../components/MethodTable';

import {store} from '../../app/store';

class PageController extends Controller {
    init() {
        super.init();
        this.store.set('dataset1.text', 'Text stored using "set"');
        this.store.init('dataset2', {
            name: 'Jane',
            list: ['item 1', 'item 2', 'item 3']
        });
    }

    greet() {
      MsgBox.alert(`Hello, ${store.get('dataset2.name')}!`);
    }

    deleteData() {
      store.delete('dataset2.name');
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
        
        <CodeSplit>
            
            - The state of the whole application is stored in an object tree within a single store.
            - The state is read-only. The only way to change the state is through store methods or with the use of
            two-way data binding.
            - The state is immutable. On every change, a new copy of the state is created containing the updated values.
            
        </CodeSplit>

        <CodeSplit>

        ### Store methods

        As Cx Controllers have direct access to the `store`, we will use one in our examples to demonstrate the use of Store methods. 

        ## `set`
           
        The `set` method is used to write data to the store. It takes two arguments, `path` and `value`. The `path` is a string 
        which is used as a key for storing the `value`. The same constraints apply to the path as to naming a JavaScript variable. 

        <div class="widgets">
            <div>
                <p><TextField value:bind="dataset1.text" /></p>
                <p>Any changes will be lost if you leave this page.</p>
            </div>
        </div>

        <Content name="code">
                <CodeSnippet>{`
                    class PageController extends Controller {
                        init() {
                            super.init();

                            // writes data to the store using 'set'
                            this.store.set('dataset1.text', 'Text stored using "set"');

                            // this is another way to write to the store
                            // note, this operation will cause another DOM update
                            this.store.init('dataset2', {
                                name: 'Jane',
                                list: ['item 1', 'item 2', 'item 3']
                            });
                        }
                    
                        greet() {
                            MsgBox.alert(\`Hello, \${store.get('dataset2.name')}!\`);
                        }
                    }

                    ...

                    <div class="widgets">
                        <div>
                           <TextField value:bind="dataset1.text" />
                           <p>Any changes will be lost if you leave this page.</p>
                        </div>
                    </div>
                `}
                </CodeSnippet>
            </Content>
        </CodeSplit>

        ## `init`
            
        The `init` method is another way to write data to the store. But unlike the `set` method, it does not overwrite the existing 
        value stored under the given `path`. In such cases it returns `false`. Otherwise it saves tha `value` and returns `true`.

        ## `get`

        The `get` method is used to read data from the store. It takes one parameter, the `path` under which the value is stored. 
        Notice how we are able to directly access a certain property by using the `.` in our `path` string. 
        
        <CodeSplit>
            <div class="widgets">
                <div controller={PageController}>
                    <TextField value:bind="dataset2.name" placeholder="enter your name" />
                    <Button onClick="greet">Greet</Button>
                    <p>Any changes will persist even if you leave this page.</p>
                </div>
            </div>

            <Content name="code">
                <CodeSnippet>{`
                    <div class="widgets">
                        <div controller={PageController}>
                            <TextField value:bind="dataset2.name" placeholder="enter your name" />
                            <Button onClick="greet">Greet</Button>
                            <p>Any changes will persist even if you leave this page.</p>
                        </div>
                    </div>
                `}
                </CodeSnippet>
            </Content>

        </CodeSplit>

        ## `delete`

        The `delet` method is used to remove data from the store. It takes one parameter, the `path` under which the value is stored.
        
        <CodeSplit>
            <div class="widgets">
                <div controller={PageController}>
                    <TextField value:bind="dataset2.name" placeholder="enter your name" />
                    <Button onClick="deleteData">Clear</Button>
                    <p>Any changes will persist even if you leave this page.</p>
                </div>
            </div>

            <Content name="code">
                <CodeSnippet>{`
                    <div class="widgets">
                        <div controller={PageController}>
                            <TextField value:bind="dataset2.name" placeholder="enter your name" />
                            <Button onClick="greet">Greet</Button>
                            <p>Any changes will persist even if you leave this page.</p>
                        </div>
                    </div>
                `}
                </CodeSnippet>
            </Content>

        </CodeSplit>

        <MethodTable methods={[{
            signature: 'Store.init(path, value)',
            description: <cx><Md>
               The `init` method, unlike the `set` method, does not overwrite the existing value stored under the given
               `path`. In such cases it returns `false`. Otherwise it saves tha `value` and returns `true`.
            </Md></cx>
         }, {
            signature: 'Store.set(path, value)',
            description: <cx><Md>
               `path` is a unique string used as a key for storing and later reading the `value` from the store. 
               This method overwrites any values previously stored under the given `path`.
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
         }]}/> 


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

