import { HtmlElement, Calendar } from 'cx/widgets';
import { Content } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';


import configs from './configs/Calendar';

export const Calendars = <cx>
   <Md>
      # Calendar

      <ImportPath path="import {Calendar} from 'cx/widgets';" />

      <CodeSplit>

         Calendar is used for selecting dates.

         <div class="widgets">
               <Calendar value-bind="$page.date" />
               <Calendar value-bind="$page.date"
                         minValue="2016-05-10"
                         maxValue="2016-05-20"
                         maxExclusive
                         refDate="2016-05-08" />
         </div>

         <Content name="code">
            <CodeSnippet fiddle="op5dUaHh">{`
                <div class="widgets">
                   <Calendar value-bind="$page.date" />
                   <Calendar value-bind="$page.date"
                         minValue="2016-05-10"
                         maxValue="2016-05-20"
                         maxExclusive
                         refDate="2016-05-08" />
                </div>
            `}</CodeSnippet>
         </Content>
      </CodeSplit>

      > Use `Enter` key to select a date. Use arrow keys, `Home`, `End`, `Page Up` and `Page Down` keys to navigate the calendar.

      ## Configuration

      <ConfigTable props={configs} />

   </Md>
</cx>
