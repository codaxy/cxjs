import { HtmlElement, ProgressBar, Slider } from 'cx/widgets';
import { LabelsLeftLayout, bind } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';


import configs from './configs/ProgressBar';

export const ProgressBars = <cx>
   <Md>
      # ProgressBar

      <ImportPath path="import {ProgressBar} from 'cx/widgets';" />

      The `ProgressBar` accepts values between `0` and `1` to indicate the state of progress.

      <CodeSplit>
         <div class="widgets">
            <ProgressBar text:tpl="{$page.value:p;0}" value:bind='$page.value' />
            <Slider value:bind='$page.value' maxValue={1} />
         </div>

         <CodeSnippet putInto="code" >{`
            <ProgressBar text:tpl="{$page.value:p;0}" value:bind='$page.value' />
            <Slider value:bind='$page.value' maxValue={1} />
         `}</CodeSnippet>
      </CodeSplit>

      ## Configuration

      <ConfigTable props={{...configs, mod: false}} />

   </Md>
</cx>

