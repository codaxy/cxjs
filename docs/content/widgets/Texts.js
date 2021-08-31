import { Content, LabelsLeftLayout } from 'cx/ui';
import { Tab, Text, TextField } from 'cx/widgets';
import { CodeSnippet } from '../../components/CodeSnippet';
import { CodeSplit } from '../../components/CodeSplit';
import { ConfigTable } from '../../components/ConfigTable';
import { ImportPath } from '../../components/ImportPath';
import { Md } from '../../components/Md';
import configs from './configs/Text';



const style = { 
    backgroundColor: "darkseagreen",
    color: "white",
    minHeight: 24,
    padding: 5,
    textAlign: "center"
};

export const Texts = <cx>
   <Md>
      # Text

      <ImportPath path="import {Text} from 'cx/widgets';" />

      The `Text` is used to dynamically render pure text content (without a container element).

      <CodeSplit>
         <div class="widgets" layout={LabelsLeftLayout}>
            <TextField label="User name" value={{bind: '$page.username', defaultValue: "Jane" }} />
            
            <div style={style} text-tpl="Hello, {$page.username|guest}!">
                Other static content (this will not get rendered).
            </div>
            
            <div style={style} >
                <Text tpl='Hello, {$page.username|guest}!' />
                <br/>
                Other static content.
            </div>
         </div>

            <Content name="code">
            <div>
            <Tab value-bind="$page.code.tab" tab="style" mod="code">
                <code>Style</code>
            </Tab>

            <Tab value-bind="$page.code.tab" tab="text" mod="code" default>
                <code>Text</code>
            </Tab>
            </div>
        <CodeSnippet visible-expr="{$page.code.tab}=='style'" fiddle="qgxBwygW" >{`
            const style = { 
                backgroundColor: "darkseagreen",
                color: "white",
                minHeight: 24,
                padding: 5,
                textAlign: "center"
            };

            `}</CodeSnippet>

             <CodeSnippet visible-expr="{$page.code.tab}=='text'" fiddle="qgxBwygW" >{`
            <TextField label="User name" value={{bind: '$page.username', defaultValue: "Jane" }} />
            
            <div style={style} text-tpl="Hello, {$page.username|guest}!">
                Other static content (this will not get rendered).
            </div>
            
            <div style={style} >
                <Text tpl='Hello, {$page.username|guest}!' />
                <br/>
                Other static content.
            </div>
         `}</CodeSnippet>
            </Content>
      </CodeSplit>

      A common use-case is when we want to define inner text content of an element that also contains other child components.
      In such cases we cannot use the `text` property as it would override any child elements.

      ## Configuration

      <ConfigTable props={{...configs, mod: false}} />

   </Md>
</cx>

