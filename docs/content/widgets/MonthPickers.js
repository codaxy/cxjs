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

        The `MonthPicker` widget is used for selecting months or month ranges.

        <CodeSplit>
            <div class="widgets">
                <MonthPicker range from:bind="$page.from" to:bind="$page.to"/>
                <MonthPicker value:bind="$page.date"/>
            </div>

            <CodeSnippet putInto="code">{`
                <MonthPicker range from:bind="$page.from" to:bind="$page.to" />
                <MonthPicker value:bind="$page.date" />
            `}</CodeSnippet>
        </CodeSplit>

        > Use `Enter` key to select a date. Use arrow keys, `Home`, `End`, `Page Up` and `Page Down` keys to navigate
        the calendar.

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>
