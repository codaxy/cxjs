import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {MethodTable} from '../../components/MethodTable';
import {Content} from 'cx/ui/layout/Content';
import {ImportPath} from '../../components/ImportPath';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Checkbox} from 'cx/ui/form/Checkbox';
import {TextField} from 'cx/ui/form/TextField';
import {DateField} from 'cx/ui/form/DateField';
import {TextArea} from 'cx/ui/form/TextArea';
import {Controller} from 'cx/ui/Controller';
import {Button} from 'cx/ui/Button';
import {Repeater} from 'cx/ui/Repeater';
import {LabelsLeftLayout} from 'cx/ui/layout/LabelsLeftLayout';

import {MsgBox} from 'cx/ui/overlay/MsgBox';

export const MsgBoxes = <cx>
   <Md>
      # MsgBox

      <ImportPath path={"import \{MsgBox\} from 'cx/ui/overlay/MsgBox';"}></ImportPath>

      The `MsgBox` class provides utility methods for displaying alerts and confirmation windows.

      <CodeSplit>
         <div class="widgets">
            <button type="button" onClick={ e => { MsgBox.alert({ message: 'This is an alert!' }) }}>Alert</button>
            <button type="button" onClick={ e => {
               MsgBox.yesNo({ message: 'Would you like to see another alert?' })
                  .then((btn) => { if (btn == 'yes') MsgBox.alert(`Here it is.`) });
            }}>
               Yes or No
            </button>
         </div>

         <Content name="code">
            <CodeSnippet>{`
               <button type="button" onClick={ e => { MsgBox.alert({ message: 'This is an alert!' }) }}>Alert</button>
               <button type="button" onClick={ e => {
                  MsgBox.yesNo({ message: 'Would you like to see another alert?' })
                     .then((btn) => { if (btn == 'yes') MsgBox.alert('Here it is.') });
               }}>
                  Yes or No
               </button>
            `}</CodeSnippet>
         </Content>

      </CodeSplit>

      ## Methods

      <MethodTable methods={[{
         signature: 'MsgBox.alert(options)',
         description: <cx><Md>
            Displays an alert window. `options` parameter may be a string or a configuration object with `message` and
            `title` properties. Result is a `Promise` which is resolved once the user clicks OK.
         </Md></cx>
         }, {
            signature: 'MsgBox.yesNo(options)',
            description: <cx><Md>
               Displays a confirmation window with two options (yes and no).
               `options` parameter may be a string or a configuration object with `message` and
               `title` properties. Result is a `Promise` which is resolved once the user clicks one of the options.
            </Md></cx>
         }]}/>

   </Md>
</cx>