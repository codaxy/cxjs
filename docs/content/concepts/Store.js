import { HtmlElement, Content, Checkbox, Repeater, FlexBox } from 'cx/widgets';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {Controller} from 'cx/ui';
import {ImportPath} from 'docs/components/ImportPath';
import {MethodTable} from '../../components/MethodTable';

import {store} from '../../app/store';

store.set('store-itemsA', [
   { text: 'A', checked: false },
   { text: 'B', checked: false },
   { text: 'C', checked: false },
   { text: 'D', checked: false },
   { text: 'E', checked: false },
   { text: 'F', checked: false }
]);

store.copy('store-itemsA', 'store.itemsB');

store.move('store-itemsA', 'store.itemsC');

class StController extends Controller {
    init() {
        super.init();
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
        
            <div class="widgets">
                <div controller={StController}>
                    
                </div>
            </div>

            <Content name="code">
                <CodeSnippet>{`
                import { Store } from 'cx/data';
                const store = new Store();
                store.init('appdata', 'some data');
            `}
                </CodeSnippet>
            </Content>
        </CodeSplit>

        ### Store methods

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

