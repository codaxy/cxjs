import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Content} from 'cx/ui/layout/Content';
import {MonthPicker} from 'cx/ui/form/MonthPicker';
import {LabelsLeftLayout} from 'cx/ui/layout/LabelsLeftLayout';

import configs from './configs/Calendar';

export const MonthPickers = <cx>
   <Md>
      # MonthPickers

      <CodeSplit>

         The `MonthPicker` widget is used for selecting months or month ranges.

         <div class="widgets">
            <MonthPicker value:bind="$page.date" />
            <MonthPicker range from:bind="$page.from" to:bind="$page.to" />
         </div>

         <CodeSnippet putInto="code">{``}</CodeSnippet>
      </CodeSplit>

      > Use `Enter` key to select a date. Use arrow keys, `Home`, `End`, `Page Up` and `Page Down` keys to navigate the calendar.

      ## Configuration

      <ConfigTable props={configs} />

   </Md>
</cx>
