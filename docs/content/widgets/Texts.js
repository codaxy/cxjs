import { HtmlElement, Text, TextField } from 'cx/widgets';
import { LabelsLeftLayout, bind } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';


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

         <CodeSnippet putInto="code" >{`
            const style = { 
                backgroundColor: "darkseagreen",
                color: "white",
                minHeight: 24,
                padding: 5,
                textAlign: "center"
            };
            ...
            
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
      </CodeSplit>

      A common use-case is when we want to define inner text content of an element that also contains other child components.
      In such cases we cannot use the `text` property as it would override any child elements.

      ## Configuration

      <ConfigTable props={{...configs, mod: false}} />

   </Md>
</cx>

