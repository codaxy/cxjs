import { Content, Controller, LabelsLeftLayout } from 'cx/ui';
import { HtmlElement, Checkbox, TextField, DateField, TextArea, Button, Repeater, MsgBox } from 'cx/widgets';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {MethodTable} from '../../components/MethodTable';
import {ImportPath} from '../../components/ImportPath';



export const MsgBoxes = <cx>
   <Md>
      # MsgBox

      <ImportPath path="import {MsgBox} from 'cx/widgets';" />

      The `MsgBox` class provides utility methods for displaying alerts and confirmation windows.

      <CodeSplit>
         <div class="widgets">
            <Button onClick={ e => { MsgBox.alert({ message: 'This is an alert!' }) }}>Alert</Button>
            <Button onClick={ e => {
               MsgBox.yesNo({ message: 'Would you like to see another alert?' })
                  .then((btn) => { if (btn == 'yes') MsgBox.alert(`Here it is.`) });
            }}>
               Yes or No
            </Button>
         </div>

         <Content name="code">
            <CodeSnippet fiddle="g1Z5Q4QH">{`
               <Button onClick={ e => { MsgBox.alert({ message: 'This is an alert!' }) }}>Alert</Button>
               <Button type="button" onClick={ e => {
                  MsgBox.yesNo({ message: 'Would you like to see another alert?' })
                     .then((btn) => { if (btn == 'yes') MsgBox.alert('Here it is.') });
               }}>
                  Yes or No
               </Button>
            `}</CodeSnippet>
         </Content>

      </CodeSplit>

      ## Methods

      <MethodTable methods={[{
         signature: 'MsgBox.alert(options)',
         description: <cx><Md>
            Displays an alert window. `options` parameter may be a string or a configuration object with `message`, `title` and
            `store` properties. Result is a `Promise` which is resolved once the user clicks OK.
         </Md></cx>
         }, {
            signature: 'MsgBox.yesNo(options)',
            description: <cx><Md>
               Displays a confirmation window with two options (yes and no).
               `options` parameter may be a string or a configuration object with `message`, `title` and
               `store` properties. Result is a `Promise` which is resolved once the user clicks one of the options.
            </Md></cx>
         }]}/>

   </Md>
</cx>
