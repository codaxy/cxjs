import { Content, Controller, LabelsLeftLayout } from 'cx/ui';
import { HtmlElement, Checkbox, TextField, DateField, TextArea, Button, Repeater, FlexRow, Toast, Dropdown } from 'cx/widgets';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';

import configs from './configs/Dropdown';

export const Dropdowns = <cx>
    <Md>
        <CodeSplit>

            # Dropdown

            <ImportPath path="import { Dropdown } from 'cx/widgets';" />

            The `Dropdown` widget is commonly used in lookup fields, date fields, and menus, but it can also be used independently.

            <div class="widgets">
                <Button
                    onClick={(e, {store}) => {
                        store.toggle("$page.showDropdown")
                    }}
                >
                    Toggle Dropdown
                </Button>

                <Dropdown
                    visible-bind="$page.showDropdown"
                    arrow
                    offset={10}
                    placementOrder="down-right up-right"
                    style="padding: 20px;"
                    zIndex={1000}
                >
                    Dropdown placed next to the previous sibling (button).
                </Dropdown>

                <Button
                    onClick={(e, {store}) => {
                        store.toggle("$page.showParentDropdown")
                    }}
                >
                    Toggle Parent Dropdown
                </Button>

                <Dropdown
                    visible-bind="$page.showParentDropdown"
                    arrow
                    offset={10}
                    placement="up"
                    onResolveRelatedElement={el => el.parentElement}
                    style="padding: 20px; max-width: 300px"
                    zIndex={1000}
                >
                    Dropdown placed next to the element returned by the onResolveRelatedElement target.
                </Dropdown>

                <TextField value-bind="$page.query" focused-bind="$page.showSuggestions" trackFocus icon="search" />

                <Dropdown
                    visible-bind="$page.showSuggestions"
                    offset={1}
                    placementOrder="down-right up-right"
                    style="padding: 20px;"
                    zIndex={1000}
                    matchWidth
                >
                    Display search results here.
                </Dropdown>
            </div>

            <CodeSnippet putInto="code" fiddle="Hm36fwDX">{`
                <Button
                    onClick={(e, {store}) => {
                        store.toggle("$page.showDropdown")
                    }}
                >
                    Toggle Dropdown
                </Button>

                <Dropdown
                    visible-bind="$page.showDropdown"
                    arrow
                    offset={10}
                    placementOrder="down-right up-right"
                    style="padding: 20px;"
                    zIndex={1000}
                >
                    Dropdown placed next to the previous sibling (button).
                </Dropdown>

                <Button
                    onClick={(e, {store}) => {
                        store.toggle("$page.showParentDropdown")
                    }}
                >
                    Toggle Parent Dropdown
                </Button>

                <Dropdown
                    visible-bind="$page.showParentDropdown"
                    arrow
                    offset={10}
                    placement="up"
                    onResolveRelatedElement={el => el.parentElement}
                    style="padding: 20px; max-width: 300px"
                    zIndex={1000}
                >
                    Dropdown placed next to the element returned by the onResolveRelatedElement target.
                </Dropdown>

                <TextField value-bind="$page.query" focused-bind="$page.showSuggestions" trackFocus icon="search" />

                <Dropdown
                    visible-bind="$page.showSuggestions"
                    offset={1}
                    placementOrder="down-right up-right"
                    style="padding: 20px;"
                    zIndex={1000}
                    matchWidth
                >
                    Display search results here.
                </Dropdown>
            `}</CodeSnippet>
        </CodeSplit>

        Positioning of the dropdown is controlled by the `relatedElement` and the `placement` property. Default `relatedElement` is the element
        rendered prior to the dropdown. If neccessary, use the `onResolveRelatedElement` callback to find the proper element. Placement direction is determined
        by the available space on the screen and controlled by the `placement` and `placementOrders` props.

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>
