import {HtmlElement} from 'cx/widgets';
import {Md} from 'docs/components/Md';
import {ImportPath} from 'docs/components/ImportPath';
import {ConfigTable} from '../../components/ConfigTable';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';

export const DomPage = <cx>
    <Md>
        # DOM Util

        Cx util contains the following DOM utility functions:

        - [closest](#closest)
        - [closestParent](#closestparent)
        - [findFirst](#findfirs)
        - [findFirstChild](#findfirstchild)
        - [getFocusedElement](#getfocusedelement)
        - [isDescendant](#isdescendant)
        - [isFocused](#isfocused)
        - [isFocusedDeep](#isfocuseddeep)
        - [isFocusable](#isfocusable)
        - [isSelfOrDescendant](#isselfordescendant)

        Use curly braces to import only certain util functions.
        
        ## closest
        `closest: (el: Element, condition: (el: Element) => boolean) => Element | null;`
    
        Find the closest element in DOM tree that satisfies the `condition`. The function first checks
        the element itself against the `condition`, and then goes up the tree checking the parent element.
        
        <ConfigTable header="Parameter" sort={false} props={{
            el: {
                type: 'Element',
                description: <cx><Md>
                    DOM element.
                </Md></cx>
            },
            condition: {
                type: 'function',
                description: <cx><Md>
                    Predicate function that accepts a DOM Element as an argument and returns a `boolean`.
                </Md></cx>
            }
        }} />

        Returns the first DOM Element that satisfies the `condition` or `null` if there was no match.


        ## closestParent
        `closestParent: (el: Element, condition: (el: Element) => boolean) => Element | null;`

        Find the closest parent element in DOM tree that satisfies the `condition`.
        The function starts with the parent element and continues up the tree until 
        the `condition` is satisfied or the root is reached.
        
        <ConfigTable header="Parameter" sort={false} props={{
            el: {
                type: 'Element',
                description: <cx><Md>
                    DOM element.
                </Md></cx>
            },
            condition: {
                type: 'function',
                description: <cx><Md>
                    Predicate function that accepts a DOM Element as an argument and returns a `boolean`.
                </Md></cx>
            }
        }} />

        Returns the first parent element that satisfies the `condition` or `null` if there was no match.


        ## findFirst
        `findFirst: (el: Element, condition: (el: Element) => boolean) => Element | null;`

        Find the closest element in DOM tree that satisfies the `condition`. The function first checks
        the element itself against the `condition`, and then goes down the tree checking the child element.

        <ConfigTable header="Parameter" sort={false} props={{
            el: {
                type: 'Element',
                description: <cx><Md>
                    DOM element.
                </Md></cx>
            },
            condition: {
                type: 'function',
                description: <cx><Md>
                    Predicate function that accepts a DOM Element as an argument and returns a `boolean`.
                </Md></cx>
            }
        }} />

        Returns the first element that satisfies the `condition` or `null` if there was no match.


        ## findFirstChild
        `findFirstChild: (el: Element, condition: (el: Element) => boolean) => Element | null;`

        Find the closest element in DOM tree that satisfies the `condition`.
        The function starts with the child element and continues down the tree until 
        the `condition` is satisfied or the last child is reached.

        <ConfigTable header="Parameter" sort={false} props={{
            el: {
                type: 'Element',
                description: <cx><Md>
                    DOM element.
                </Md></cx>
            },
            condition: {
                type: 'function',
                description: <cx><Md>
                    Predicate function that accepts a DOM Element as an argument and returns a `boolean`.
                </Md></cx>
            }
        }} />

        Returns the first element that satisfies the `condition` or `null` if there was no match.


        ## getFocusedElement
        `getFocusedElement: () => Element;`

        Returns the DOM element that has the focus.


        ## isDescendant
        `isDescendant: (el: Element, descEl: Element) => boolean;`

        <ConfigTable header="Parameter" sort={false} props={{
            el: {
                type: 'Element',
                description: <cx><Md>
                    Ancestor element.
                </Md></cx>
            },
            descEl: {
                type: 'Element',
                description: <cx><Md>
                    Descendant element.
                </Md></cx>
            }
        }} />

        Returns `true` if `descEl` is a descendant of `el`.


        ## isFocused
        `isFocused: (el: Element) => boolean;`

        <ConfigTable header="Parameter" sort={false} props={{
            el: {
                type: 'Element',
                description: <cx><Md>
                    DOM element.
                </Md></cx>
            }
        }} />

        Returns `true` if `el` has focus.

        
        ## isFocusedDeep
        `isFocusedDeep: (el: Element) => boolean;`

        <ConfigTable header="Parameter" sort={false} props={{
            el: {
                type: 'Element',
                description: <cx><Md>
                    DOM element.
                </Md></cx>
            }
        }} />

        Returns `true` if `el` or one of its descendants has focus.


        ## isFocusable
        `isFocusable: (el: Element) => boolean;`

        <ConfigTable header="Parameter" sort={false} props={{
            el: {
                type: 'Element',
                description: <cx><Md>
                    DOM element.
                </Md></cx>
            }
        }} />

        Returns `true` if `el` is focusable.
        

        ## isSelfOrDescendant
        `isSelfOrDescendant: (el: Element, descEl: Element) => boolean;`

        <ConfigTable header="Parameter" sort={false} props={{
            el: {
                type: 'Element',
                description: <cx><Md>
                    Ancestor element.
                </Md></cx>
            },
            descEl: {
                type: 'Element',
                description: <cx><Md>
                    Descendant element.
                </Md></cx>
            }
        }} />

        Returns `true` if `el` and `descEl` are the same element or `descEl` is a descendant of `el`.

    </Md>
</cx>

