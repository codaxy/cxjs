import {HtmlElement} from 'cx/widgets';
import {Md} from 'docs/components/Md';
import {ImportPath} from 'docs/components/ImportPath';
import {ConfigTable} from '../../components/ConfigTable';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';

export const DomUtil = <cx>
    <Md>
        # DOM Utils

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
        
        ## closest
        <ImportPath path="import {closest} from 'cx/util';"/>

        Find the closest element in DOM tree that sattisfies the `condition`. The function first checks
        the element itself against the `condition`, and then goes up the tree checking the parent element.
        
        ### Definition
        `closest: (el: Element, condition: (el: Element) => boolean) => Element | null;`

        ### Parameters
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

        ### Return value
        Returns the first DOM Element that sattisfies the `condition` or `null` if there was no match.


        ## closestParent
        <ImportPath path="import {closestParent} from 'cx/util';"/>

        Find the closest parent element in DOM tree that sattisfies the `condition`. 
        The function starts with the parent element and continues up the tree until 
        the `condition` is sattisfied or the root is reached.
        
        ### Definition
        `closestParent: (el: Element, condition: (el: Element) => boolean) => Element | null;`

        ### Parameters
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

        ### Return value
        Returns the first parent element that sattisfies the `condition` or `null` if there was no match.


        ## findFirst
        <ImportPath path="import {findFirst} from 'cx/util';"/>

        Find the closest element in DOM tree that sattisfies the `condition`. The function first checks
        the element itself against the `condition`, and then goes down the tree checking the child element.

        ### Definition
        `findFirst: (el: Element, condition: (el: Element) => boolean) => Element | null;`

        ### Parameters
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

        ### Return value
        Returns the first element that sattisfies the `condition` or `null` if there was no match.


        ## findFirstChild
        <ImportPath path="import {findFirstChild} from 'cx/util';"/>

        Find the closest element in DOM tree that sattisfies the `condition`. 
        The function starts with the child element and continues down the tree until 
        the `condition` is sattisfied or the last child is reached.

        ### Definition
        `findFirstChild: (el: Element, condition: (el: Element) => boolean) => Element | null;`

        ### Parameters
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

        ### Return value
        Returns the first element that sattisfies the `condition` or `null` if there was no match.


        ## getFocusedElement
        <ImportPath path="import {getFocusedElement} from 'cx/util';"/>

        ### Definition
        `getFocusedElement: () => Element;`

        ### Return value
        Returns the DOM element that has the focus.


        ## isDescendant
        <ImportPath path="import {isDescendant} from 'cx/util';"/>

        ### Definition
        `isDescendant: (el: Element, descEl: Element) => boolean;`

        ### Parameters
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

        ### Return value
        Returns `true` if `descEl` is a descendant of `el`.


        ## isFocused
        <ImportPath path="import {isFocused} from 'cx/util';"/>
        
        ### Definition
        `isFocused: (el: Element) => boolean;`

        ### Parameters
        <ConfigTable header="Parameter" sort={false} props={{
            el: {
                type: 'Element',
                description: <cx><Md>
                    DOM element.
                </Md></cx>
            }
        }} />

        ### Return value
        Returns `true` if `el` has focus.

        
        ## isFocusedDeep
        <ImportPath path="import {isFocusedDeep} from 'cx/util';"/>
        
        ### Definition
        `isFocusedDeep: (el: Element) => boolean;`

        ### Parameters
        <ConfigTable header="Parameter" sort={false} props={{
            el: {
                type: 'Element',
                description: <cx><Md>
                    DOM element.
                </Md></cx>
            }
        }} />

        ### Return value
        Returns `true` if `el` or one of its descendants has focus.


        ## isFocusable
        <ImportPath path="import {isFocusable} from 'cx/util';"/>
        
        ### Definition
        `isFocusable: (el: Element) => boolean;`

        ### Parameters
        <ConfigTable header="Parameter" sort={false} props={{
            el: {
                type: 'Element',
                description: <cx><Md>
                    DOM element.
                </Md></cx>
            }
        }} />

        ### Return value
        Returns `true` if `el` is focusable.
        

        ## isSelfOrDescendant
        <ImportPath path="import {isSelfOrDescendant} from 'cx/util';"/>

        ### Definition
        `isSelfOrDescendant: (el: Element, descEl: Element) => boolean;`

        ### Parameters
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

        ### Return value
        Returns `true` if `el` and `descEl` are the same element or `descEl` is a descendant of `el`.

    </Md>
</cx>

