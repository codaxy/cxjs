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

