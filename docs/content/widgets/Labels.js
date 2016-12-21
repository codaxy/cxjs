import { HtmlElement, TextField, Checkbox } from 'cx/widgets';
import { Content, LabelsLeftLayout } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';


import configs from './configs/Label';

export const Labels = <cx>
    <Md>
        # Labels

        <CodeSplit>

            Labels are usually simple texts, however, sometimes it's required to apply different
            styling or put additional content inside the label.

            <div class="widgets">
                <div layout={LabelsLeftLayout}>
                    <TextField label="Standard" value:bind="$page.text" autoFocus/>
                    <TextField label={{text: "Styled", style: "color:green;font-weight:bold"}} value:bind="$page.text" />
                    <TextField label="Asterisk" value:bind="$page.text" required asterisk />
                    <TextField
                        label={<Checkbox value:bind="$page.enabled">Enabled</Checkbox>}
                        value:bind="$page.text"
                        enabled:bind="$page.enabled"
                    />
                    <TextField
                        label={{
                            text: 'Tooltips',
                            tooltip: 'This tooltip is related to the label.'
                        }}
                        value:bind="$page.text"
                        tooltip="This tooltip is related to the field."
                    />
                </div>
            </div>

            <CodeSnippet putInto="code">{`
                <div layout={LabelsLeftLayout}>
                    <TextField label="Standard" value:bind="$page.text" autoFocus/>
                    <TextField label={{text: "Styled", style: "color:green;font-weight:bold"}} value:bind="$page.text" />
                    <TextField label="Asterisk" value:bind="$page.text" required asterisk />
                    <TextField
                        label={<Checkbox value:bind="$page.enabled">Enabled</Checkbox>}
                        value:bind="$page.text"
                        enabled:bind="$page.enabled"
                    />
                    <TextField
                        label={{
                            text: 'Tooltips',
                            tooltip: 'This tooltip is related to the label.'
                        }}
                        value:bind="$page.text"
                        tooltip="This tooltip is related to the field."
                    />
                </div>
            `}</CodeSnippet>

        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>