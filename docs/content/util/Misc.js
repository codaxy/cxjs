import {HtmlElement} from 'cx/widgets';
import {Md} from 'docs/components/Md';
import {ImportPath} from 'docs/components/ImportPath';
import {ConfigTable} from '../../components/ConfigTable';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';

export const Misc = <cx>
    <Md>
        # Miscellaneous
        <ImportPath path="import * from 'cx/util';" />

        Cx util contains the following miscellaneous utility funcitons:
        - browserSupportsPassiveEventHandlers
        - debounce
        - escapeSpecialRegexCharacters
        - Event callback
            - stopPropagation
            - preventDefault
        - expandFatArrows
        - findScrollableParent
        - getScrollerBoundingClientRect
        - getSearchQueryPredicate
        - getVendorPrefix
        - innerTextTrim
        - isDigit
        - isNonEmptyArray
        - isPromise
        - Touch device
            - enableTouchEventDetection
            - isTouchDevice
            - isTouchEvent
        - KeyCode
        - parseStyle
        - quote
        - scrollElementIntoView
        - shallowEquals
        - throttle

        Use curly braces to import only certain util functions.
        
        ## browserSupportsPassiveEventHandlers
        `browserSupportsPassiveEventHandlers: () => boolean;`
        
        Returns `true` if the browser supports [passive event handlers](https://developers.google.com/web/updates/2016/06/passive-event-listeners).

        
        ## debounce
        `debounce: (callback: (...args: any[]) => void, delay: number) => (...args: any[]) => void;`

        `debounce` is used to postpone the invokation of the `callback` function, until the user finishes interaction, i.e. until 
        the `delay` amount of milliseconds has past since the last call.

        <ConfigTable header="Parameter" sort={false} props={{
            callback: {
                type: 'function',
                description: <cx><Md>
                    Function to be debounced.
                </Md></cx>
            },
            delay: {
                type: 'number',
                description: <cx><Md>
                    Delay in milliseconds.
                </Md></cx>
            }
        }} />

        Returns a function, that, as long as it continues to be invoked, will not
        trigger the `callback` function, until the `delay` amount of milliseconds has passed since the last call.
        All arguments are passed to the `callback` function.


        ## escapeSpecialRegexCharacters
        `escapeSpecialRegexCharacters: (regex: string) => string;`

        <ConfigTable header="Parameter" sort={false} props={{
            regex: {
                type: 'string',
                description: <cx><Md>
                    RegEx string.
                </Md></cx>
            }
        }} />

        Returns a new RegEx string with added `\` in front of special characters.

        
        ## stopPropagation
        `stopPropagation: (e: Event) => void;`

        <ConfigTable header="Parameter" sort={false} props={{
            e: {
                type: 'Event',
                description: <cx><Md>
                    Event object.
                </Md></cx>
            }
        }} />

        Prevents further propagation of the current event in the capturing and bubbling phases.

        ## preventDefault
        `preventDefault: (e: Event) => void;`

        <ConfigTable header="Parameter" sort={false} props={{
            e: {
                type: 'Event',
                description: <cx><Md>
                    Event object.
                </Md></cx>
            }
        }} />

        `preventDefault` tells the browser that if the event goes unhandled, its default action should not be taken as it normally would be.
        A typical example is to prevent form submission.


        ## expandFatArrows
        `expandFatArrows: (code: string) => string;`

        `expandFatArrows` is used to preprocess dynamic JavaScript evaluation to support ES6 arrow function 
        syntax without the use of babel or any other library.
        <CodeSplit>
            <ConfigTable header="Parameter" sort={false} props={{
                code: {
                    type: 'string',
                    description: <cx><Md>
                        JavaScript code to be evaluated.
                    </Md></cx>
                }
            }} />

            Returns a new string with fat arrows expanded to function expressions.

            <CodeSnippet putInto='code'>
                {`
                    expandFatArrows('a=>a.id');  // 'function(a) { return a.id }'
                `}
            </CodeSnippet>
        </CodeSplit>


        ## findScrollableParent
        `findScrollableParent: (sourceEl: Element, horizontal?: boolean) => Element;`

        <ConfigTable header="Parameter" sort={false} props={{
            sourceEl: {
                type: 'Element',
                description: <cx><Md>
                    DOM element.
                </Md></cx>
            },
            horizontal: {
                type: 'boolean',
                description: <cx><Md>
                    Optional. Set to `true` to look for horizontally scrollable parent element. Defaults to `false`.
                </Md></cx>
            }
        }} />

        Returns closest ancestor element that is vertically, i.e. horizontally scrollable.

        ## browserSupportsPassiveEventHandlers
        `browserSupportsPassiveEventHandlers: () => boolean;`
        <CodeSplit>
            <ConfigTable header="Parameter" sort={false} props={{
                d1: {
                    type: 'Date',
                    description: <cx><Md>
                        Date object representing the start date.
                    </Md></cx>
                },
                d2: {
                    type: 'Date',
                    description: <cx><Md>
                        Date object representing the end date.
                    </Md></cx>
                }
            }} />

            Returns the difference between two dates in miliseconds.
        
            <CodeSnippet putInto='code'>
                {`
                    dateDiff(new Date('2017-07-24'), new Date('2017-07-23'));  // 86400000
                `}
            </CodeSnippet>
        </CodeSplit>

    </Md>
</cx>

