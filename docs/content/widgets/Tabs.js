import { HtmlElement, Tab, TextField, DateField, Checkbox } from 'cx/widgets';
import { Content, Controller } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';


import configs from './configs/Tab';


export const Tabs = <cx>
   <Md>
      # Tabs

      <ImportPath path="import {Tab} from 'cx/widgets';" />

      <CodeSplit>
          Tabs are commonly used to organize content into a single container. In Cx, tabs behave similarly
          to radio buttons. Tabs are selected on click and only one tab may be active at a time.

         <div class="widgets">
            <div style="margin:10px">
               <Tab tab="tab1" value-bind="$page.tab" default>Tab 1</Tab>
               <Tab tab="tab2" value-bind="$page.tab">Tab 2</Tab>
               <Tab tab="tab3" value-bind="$page.tab">Tab 3</Tab>
               <Tab tab="tab4" value-bind="$page.tab" disabled>Tab 4</Tab>
            </div>
            <div style="margin:10px">
               <Tab tab="tab1" value-bind="$page.tab" mod="line">Tab 1</Tab>
               <Tab tab="tab2" value-bind="$page.tab" mod="line">Tab 2</Tab>
               <Tab tab="tab3" value-bind="$page.tab" mod="line">Tab 3</Tab>
               <Tab tab="tab4" value-bind="$page.tab" mod="line" disabled>Tab 4</Tab>
            </div>
            <div style="margin:10px">
               <div style="padding-left:10px;white-space:nowrap;">
                  <Tab tab="tab1" value-bind="$page.tab" mod="classic">Tab 1</Tab>
                  <Tab tab="tab2" value-bind="$page.tab" mod="classic">Tab 2</Tab>
                  <Tab tab="tab3" value-bind="$page.tab" mod="classic">Tab 3</Tab>
                  <Tab tab="tab4" value-bind="$page.tab" mod="classic" disabled>Tab 4</Tab>
               </div>
               <div style="border: 1px solid lightgray; background: white; padding: 20px">
                  <div visible-expr="{$page.tab}=='tab1'">Tab 1</div>
                  <div visible-expr="{$page.tab}=='tab2'">Tab 2</div>
                  <div visible-expr="{$page.tab}=='tab3'">Tab 3</div>
                  <div visible-expr="{$page.tab}=='tab4'">Tab 4</div>
               </div>
            </div>
         </div>
         <Content name="code">
            <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Tabs" default/>
            <CodeSnippet fiddle="NK72YwmO">{`
               <div style="margin:10px">
                  <Tab tab="tab1" value-bind="$page.tab" default>Tab 1</Tab>
                  <Tab tab="tab2" value-bind="$page.tab">Tab 2</Tab>
                  <Tab tab="tab3" value-bind="$page.tab">Tab 3</Tab>
                  <Tab tab="tab4" value-bind="$page.tab" disabled>Tab 4</Tab>
               </div>
               <div style="margin:10px">
                  <Tab tab="tab1" value-bind="$page.tab" mod="line">Tab 1</Tab>
                  <Tab tab="tab2" value-bind="$page.tab" mod="line">Tab 2</Tab>
                  <Tab tab="tab3" value-bind="$page.tab" mod="line">Tab 3</Tab>
                  <Tab tab="tab4" value-bind="$page.tab" mod="line" disabled>Tab 4</Tab>
               </div>
               <div style="margin:10px">
                  <div style="padding-left:10px;white-space:nowrap;">
                     <Tab tab="tab1" value-bind="$page.tab" mod="classic">Tab 1</Tab>
                     <Tab tab="tab2" value-bind="$page.tab" mod="classic">Tab 2</Tab>
                     <Tab tab="tab3" value-bind="$page.tab" mod="classic">Tab 3</Tab>
                     <Tab tab="tab4" value-bind="$page.tab" mod="classic" disabled>Tab 4</Tab>
                  </div>
                  <div style="border: 1px solid lightgray; background: white; padding: 20px">
                     <div visible-expr="{$page.tab}=='tab1'">Tab 1</div>
                     <div visible-expr="{$page.tab}=='tab2'">Tab 2</div>
                     <div visible-expr="{$page.tab}=='tab3'">Tab 3</div>
                     <div visible-expr="{$page.tab}=='tab4'">Tab 4</div>
                  </div>
               </div>`}
            </CodeSnippet>
         </Content>

      </CodeSplit>

      ## Configuration

      <ConfigTable props={configs} />

   </Md>
</cx>
