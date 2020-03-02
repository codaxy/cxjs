import {HtmlElement, Tab, HScroller, Button} from 'cx/widgets';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';


import configs from './configs/HScroller';


export const Hscrollers = <cx>
    <Md>
        # HScroller

        <ImportPath path="import {HScroller} from 'cx/widgets';"/>

        <CodeSplit>
            Horizontal scrollers are commonly used with tabs, in scenarios when there are too many tabs to fit the screen.

            <div class="widgets" style="display: block">
                <HScroller scrollIntoViewSelector=".cxb-tab.cxs-active">
                    <Tab tab="tab1" value:bind="$page.tab" default>Tab 1</Tab>
                    <Tab tab="tab2" value:bind="$page.tab">Tab 2</Tab>
                    <Tab tab="tab3" value:bind="$page.tab">Tab 3</Tab>
                    <Tab tab="tab4" value:bind="$page.tab" disabled>Tab 4</Tab>
                    <Tab tab="tab5" value:bind="$page.tab">Tab 5</Tab>
                    <Tab tab="tab6" value:bind="$page.tab">Tab 6</Tab>
                    <Tab tab="tab7" value:bind="$page.tab">Tab 7</Tab>
                    <Tab tab="tab8" value:bind="$page.tab" disabled>Tab 8</Tab>
                    <Tab tab="tab9" value:bind="$page.tab">Tab 9</Tab>
                    <Tab tab="tab10" value:bind="$page.tab">Tab 10</Tab>
                    <Tab tab="tab11" value:bind="$page.tab">Tab 11</Tab>
                    <Tab tab="tab12" value:bind="$page.tab" disabled>Tab 12</Tab>
                    <Tab tab="tab13" value:bind="$page.tab">Tab 13</Tab>
                    <Tab tab="tab14" value:bind="$page.tab">Tab 14</Tab>
                    <Tab tab="tab15" value:bind="$page.tab">Tab 15</Tab>
                    <Tab tab="tab16" value:bind="$page.tab" disabled>Tab 16</Tab>
                </HScroller>
            </div>

            Use the `scrollIntoViewSelector` field to specify a
            [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) used to find an element which
            should be scrolled into view.

            <div class="widgets" style="display: block">
                <Button onClick={(e, {store}) => { store.set("$page.tab", "tab1")}}>Go to Tab 1</Button>
                <Button onClick={(e, {store}) => { store.set("$page.tab", "tab15")}}>Go to Tab 15</Button>
            </div>


            <CodeSnippet putInto="code" fiddle="NK72YwmO">{`
                <HScroller scrollIntoViewSelector=".cxb-tab.cxs-active">
                    <Tab tab="tab1" value:bind="$page.tab" default>Tab 1</Tab>
                    <Tab tab="tab2" value:bind="$page.tab">Tab 2</Tab>
                    <Tab tab="tab3" value:bind="$page.tab">Tab 3</Tab>
                    <Tab tab="tab4" value:bind="$page.tab" disabled>Tab 4</Tab>
                    <Tab tab="tab5" value:bind="$page.tab">Tab 5</Tab>
                    <Tab tab="tab6" value:bind="$page.tab">Tab 6</Tab>
                    <Tab tab="tab7" value:bind="$page.tab">Tab 7</Tab>
                    <Tab tab="tab8" value:bind="$page.tab" disabled>Tab 8</Tab>
                    <Tab tab="tab9" value:bind="$page.tab">Tab 9</Tab>
                    <Tab tab="tab10" value:bind="$page.tab">Tab 10</Tab>
                    <Tab tab="tab11" value:bind="$page.tab">Tab 11</Tab>
                    <Tab tab="tab12" value:bind="$page.tab" disabled>Tab 12</Tab>
                    <Tab tab="tab13" value:bind="$page.tab">Tab 13</Tab>
                    <Tab tab="tab14" value:bind="$page.tab">Tab 14</Tab>
                    <Tab tab="tab15" value:bind="$page.tab">Tab 15</Tab>
                    <Tab tab="tab16" value:bind="$page.tab" disabled>Tab 16</Tab>
                </HScroller>
                ...
                <Button onClick={(e, {store}) => { store.set("$page.tab", "tab1")}}>Go to Tab 1</Button>
                <Button onClick={(e, {store}) => { store.set("$page.tab", "tab15")}}>Go to Tab 15</Button>
            `}
            </CodeSnippet>

        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>
