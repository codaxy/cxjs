import { HtmlElement, Content, Checkbox, Repeater, FlexBox, TextField, Button } from 'cx/widgets';
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
        this.store.set('pageData', { 
            text: 'Stored text',
            list: ['item 1', 'item 2', 'item 3']            
        })
    }

    setData(input) {
      this.store.set('pageData.text', input);
    }
    getData() {
      return this.store.get('pageData.text');
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

        ### Store methods

        As Cx Controllers have direct access to the `store`, we will use one in our examples to demonstrate the use of Store methods. 

        ## `set`

        <CodeSplit>
            
            - The `set` method is used to write data to the store. It takes two arguments, `path` and `value`. The `path` is a string 
            which is used as a key for storing the `value`. The same constraints apply to the path as to naming a JavaScript variable. 
        
            <div class="widgets">
                <div controller={PageController}>
                    <TextField value:bind="page.input" />
                    <Button onClick={(e, {controller})=>{ controller.setData(store.get('page.input'));}}>Store data</Button>
                </div>
            </div>

            <Content name="code">
                <CodeSnippet>{`
                class PageController extends Controller {
                    init() {
                        super.init();
                        this.store.set('pageData', { 
                            text: 'Stored text',
                            list: ['item 1', 'item 2', 'item 3']            
                        })
                    }
                }
                ...
                <div controller={PageController}>
                    <TextField value={store.get('pageData.text')} />
                </div>
            `}
                </CodeSnippet>
            </Content>
        </CodeSplit>

        ## `get`

        <CodeSplit>
            
            - The `get` method is used to read data from the store. It takes one parameter, the `path` under which the value is stored. 
            Notice how we are able to directly access a certain property by using the `.` in our `path` string. 
        
            <div class="widgets">
                <div controller={PageController}>
                    <TextField value:bind="page.output" placeholder="stored text" readOnly />
                </div>
            </div>

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

