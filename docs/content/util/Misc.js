import {HtmlElement} from 'cx/widgets';
import {Md} from 'docs/components/Md';
import {ImportPath} from 'docs/components/ImportPath';
import {ConfigTable} from '../../components/ConfigTable';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';

export const MiscPage = <cx>
    <Md>
        # Miscellaneous
        <ImportPath path="import * from 'cx/util';" />

        Cx util contains the following miscellaneous utility functions:
        - [browserSupportsPassiveEventHandlers](#browsersupportspassiveeventhandlers)
        - [debounce](#debounce)
        - [escapeSpecialRegexCharacters](#escapespecialregexcharacters)
        - Event callback
            - [stopPropagation](#stoppropagation)
            - [preventDefault](#preventdefault)
        - [expandFatArrows](#expandfatarrows)
        - [findScrollableParent](#findscrollableparent)
        - [getScrollerBoundingClientRect](#getscrollerboundingclientRect)
        - [getSearchQueryPredicate](#getsearchquerypredicate)
        - [getVendorPrefix](#getvendorprefix)
        - [innerTextTrim](#innertexttrim)
        - [isDigit](#isdigit)
        - [isNonEmptyArray](#isnonemptyarray)
        - [isPromise](#ispromise)
        - Touch device
            - [enableTouchEventDetection](#enabletoucheventdetection)
            - [isTouchDevice](#istouchdevice)
            - [isTouchEvent](#istouchevent)
        - [KeyCode](#keycode)
        - [parseStyle](#parsestyle)
        - [quote](#quote)
        - [scrollElementIntoView](#scrollelementintoview)
        - [shallowEquals](#shallowequals)
        - [throttle](#throttle)

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


        ## getScrollerBoundingClientRect
        `getScrollerBoundingClientRect: (scrollEl: Element) => ClientRect;`

        <CodeSplit>
            <ConfigTable header="Parameter" sort={false} props={{
                scrollEl: {
                    type: 'Element',
                    description: <cx><Md>
                        DOM element.
                    </Md></cx>
                }
            }} />

            Returns a `ClientRect` object containing the size of an element and its position relative to the viewport.

             <CodeSnippet putInto='code'>
                {`
                    getScrollerBoundingClientRect(document.documentElement);  
                    // {left: 0, top: 0, right: 1920, bottom: 950, width: 1920, height: 950}
                `}
            </CodeSnippet>
        </CodeSplit>


        ## getSearchQueryPredicate
        `getSearchQueryPredicate: (query: string, options?: any) => (text?: string) => boolean;`

        <ConfigTable header="Parameter" sort={false} props={{
            query: {
                type: 'string',
                description: <cx><Md>
                    String of regular expressions separated by spaces.
                </Md></cx>
            },
            options: {
                type: 'object',
                description: <cx><Md>
                    Optional. Not yet implemented.
                </Md></cx>
            }
        }} />

        Returns a predicate function that takes a `text` parameter and matches it against the `query`.


        ## getVendorPrefix
        `getVendorPrefix: (type: 'dom' | 'lowercase' | 'css' | 'js') => string;`
        <CodeSplit>
            <ConfigTable header="Parameter" sort={false} props={{
                type: {
                    type: 'string',
                    description: <cx><Md>
                        Type of vendor prefix. Can be `dom`, `lowercase`, `css` or `js`.
                    </Md></cx>
                }
            }} />

            Returns a vendor prefix string.

            <CodeSnippet putInto='code'>
                {`
                    getVendorPrefix('dom');  // "WebKit"
                    getVendorPrefix('lowercase');  // "webkit"
                    getVendorPrefix('css');  // "-webkit-"
                    getVendorPrefix('js');  // "Webkit"
                `}
            </CodeSnippet>
        </CodeSplit>


        ## innerTextTrim
        `innerTextTrim: (str: string) => string;`
        <CodeSplit>
            <ConfigTable header="Parameter" sort={false} props={{
                str: {
                    type: 'string',
                    description: <cx><Md>
                        Inner text.
                    </Md></cx>
                }
            }} />

            Returns a new string with removed tabs, line breaks and spaces from the beginning and from the end of each line.

            <CodeSnippet putInto='code'>
                {`
                    innerTextTrim('			Hello World!		   	 ');
                    // "Hello World!"
                `}
            </CodeSnippet>
        </CodeSplit>


        ## isDigit
        `isDigit: (x: any) => boolean;`
        <CodeSplit>
            <ConfigTable header="Parameter" sort={false} props={{
                x: {
                    type: 'any',
                    description: <cx><Md>
                        Input to be evaluated.
                    </Md></cx>
                }
            }} />

            Returns `true` if `x` is a single digit number or a string whose first character is a digit.

            <CodeSnippet putInto='code'>
                {`
                    isDigit('4'); // true
                    isDigit(5); // true
                    isDigit('e') // false
                `}
            </CodeSnippet>
        </CodeSplit>


        ## isNonEmptyArray
        `isNonEmptyArray: (x: any) => boolean;`

        <ConfigTable header="Parameter" sort={false} props={{
            x: {
                type: 'any',
                description: <cx><Md>
                    Input to be evaluated.
                </Md></cx>
            }
        }} />

        Returns `true` if `x` is a non-empty array.


        ## isPromise
        `isPromise: (x: any) => boolean;`

        <ConfigTable header="Parameter" sort={false} props={{
            x: {
                type: 'any',
                description: <cx><Md>
                    Input to be evaluated.
                </Md></cx>
            }
        }} />

        Returns `true` if `x` is a `Promise`.


        ## enableTouchEventDetection
        `enableTouchEventDetection: () => void;`

        Enables touch event detection. 


        ## isTouchDevice
        `isTouchDevice: () => boolean;`

        Returns `true` if using a touch device.


        ## isTouchEvent
        `isTouchEvent: () => boolean;`

        Returns `true` if a touch event fired within a last second.

        <CodeSplit>
            ## KeyCode

            `KeyCode` is used as a mapping between keyboard keys and their key codes.

             <CodeSnippet putInto='code'>
                {`
                    console.log(KeyCode.enter); // 13
                    console.log(KeyCode.pageDown); // 34
                `}
            </CodeSnippet>
        </CodeSplit>


        ## parseStyle
        `parseStyle: (str: string) => object;`

        <CodeSplit>
            <ConfigTable header="Parameter" sort={false} props={{
                str: {
                    type: 'string',
                    description: <cx><Md>
                        String to be parsed.
                    </Md></cx>
                }
            }} />

            Returns an object whose keys are camelCased version of the CSS property names, and whose values are
            valid CSS values stored as strings.

            <CodeSnippet putInto='code'>
                {`
                    parseStyle("margin-top: 0; display: flex;"); // {marginTop: "0", display: "flex"}
                `}
            </CodeSnippet>
        </CodeSplit>


        ## quote
        `quote: (str: string) => string;`

        <ConfigTable header="Parameter" sort={false} props={{
                str: {
                    type: 'string',
                    description: <cx><Md>
                        Input string.
                    </Md></cx>
                }
            }} />

        Returns the same string surrounded with single quotes.


        ## scrollElementIntoView
        `scrollElementIntoView: (el: Element) => void;`

        <ConfigTable header="Parameter" sort={false} props={{
                el: {
                    type: 'Element',
                    description: <cx><Md>
                        DOM element.
                    </Md></cx>
                }
            }} />

        Scrolls `el` into view.


        ## shallowEquals
        `shallowEquals: (v1: any, v2: any) => boolean;`

        Shallowly compares two values. Commonly used to perform shallow comparison of arrays and objects.

        <ConfigTable header="Parameter" sort={false} props={{
                v1: {
                    type: 'any',
                    description: <cx><Md>
                        First value.
                    </Md></cx>
                },
                v2: {
                    type: 'any',
                    description: <cx><Md>
                        Second value.
                    </Md></cx>
                }
            }} />

        Shallowly compares two values. Commonly used to perform shallow comparison of arrays and objects.
        Returns `true` if all elements of two arrays or all own properties of two objects are equal.


        ## throttle
        `throttle: (callback: (...args: any[]) => void, delay: number) => (...args: any[]) => void;`

        `throttle` is used to set the minimum amount of time that has to pass before the same funciton can be called again.
        
        <ConfigTable header="Parameter" sort={false} props={{
            callback: {
                type: 'function',
                description: <cx><Md>
                    Function to be throttled.
                </Md></cx>
            },
            delay: {
                type: 'number',
                description: <cx><Md>
                    Delay in milliseconds.
                </Md></cx>
            }
        }} />

        Returns a function, that, after it is invoked, will trigger the `callback` function, 
        after the `delay` amount of milliseconds has passed. During that time, all subsequent calls are
        ignored. All arguments are passed to the `callback` function.

    </Md>
</cx>

