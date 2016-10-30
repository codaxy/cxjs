import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Content} from 'cx/ui/layout/Content';
import {MsgBox} from 'cx/ui/overlay/MsgBox';

import {Button} from 'cx/ui/Button';

import configs from './configs/Button';

export const Buttons = <cx>
    <Md>
      # Buttons

      <ImportPath path={"import {Button} from 'cx/ui/Button';"} />

      Buttons are commonly used UI elements.

      <CodeSplit>

         <div class="widgets">
            <Button onClick={()=>{MsgBox.alert('Regular')}}>Regular</Button>
            <Button disabled onClick={()=>{MsgBox.alert('Disabled')}}>Disabled</Button>
            <Button mod="primary" onClick={()=>{MsgBox.alert('Primary')}}>Primary</Button>
            <Button mod="danger" confirm="You clicked the danger button. Are you sure that you want to proceed?"
                    onClick={()=>{MsgBox.alert('Danger')}}>
                Danger
            </Button>
         </div>
         <CodeSnippet putInto="code">{`
            <Button onClick={()=>{MsgBox.alert('Regular')}}>Regular</Button>
            <Button disabled onClick={()=>{MsgBox.alert('Disabled')}}>Disabled</Button>
            <Button mod="primary" onClick={()=>{MsgBox.alert('Primary')}}>Primary</Button>
            <Button mod="danger" confirm="You clicked the danger button. Are you sure that you want to proceed?"
                    onClick={()=>{MsgBox.alert('Danger')}}>
                Danger
            </Button>
         `}</CodeSnippet>
      </CodeSplit>


      ## Configuration

      <ConfigTable props={configs} />

   </Md>
</cx>
