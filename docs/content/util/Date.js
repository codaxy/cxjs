import {HtmlElement, Content, Checkbox, Repeater, FlexBox, TextField, NumberField, Button, MsgBox} from 'cx/widgets';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {Controller, LabelsTopLayout, LabelsLeftLayout} from 'cx/ui';
import {ImportPath} from 'docs/components/ImportPath';
import {MethodTable} from '../../components/MethodTable';
import {computable, updateArray} from 'cx/data';
import * as util from 'cx/util';

export const DateUtil = <cx>
    <Md>
        # Date

        <ImportPath path="import * as util from 'cx/util';"/>

        Cx comes with a number of utility functions that are listed here together with short descriptions and examples, as needed.

        ## Color

        - parseColor
        - parseHexColor
        - parseRgbColor
        - parseHslColor
        - hslToRgb
        - rgbToHex
        - rgbToHsl


        ## Date

        - dateDiff
        - lowerBoundCheck
        - maxDate
        - minDate
        - monthStart
        - sameDate
        - upperBoundCheck
        - zeroTime

        ## DOM
        
        - findFirst
        - findFirstChild
        - closest
        - closestParent
        - isFocused
        - isFocuesdDeep
        - isFocusable
        - getFocusedElement
        - isDescendant
        - isSelfOrDescendant

        ## Format

        - value
        - parse
        - register
        - registerFactory

        ## Console
        ## Debug
        ## Format

        ## Misc

        - GlobalCacheIdentifier
        - KeyCode
        - SubscriberList
        - Timing
        - browserSupportsPassiveEventHandlers
        - cleanupFlag
        - closest
        - closestParent
        - dateDiff
        - debounce

        
        


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

        
    </Md>
</cx>

