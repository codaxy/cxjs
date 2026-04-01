import { Content, HtmlElement, Switch, Tab } from 'cx/widgets';
import { LabelsLeftLayout } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';


import configs from './configs/Switch';


export const Switches = <cx>
    <Md>
        # Switch

        <ImportPath path="import {Switch} from 'cx/widgets';" />

        `Switch` is a two-state toggle widget. `Switch` is often used instead of a `Checkbox`,
        as it offers the same functionality with addition of modern appearance.

        <CodeSplit>
            <div class="widgets">
                <div layout={LabelsLeftLayout}>
                    <Switch label="Default" on-bind="$page.check" text-expr="{$page.check} ? 'ON' : 'OFF'" />
                    <Switch label="Disabled" value-bind="$page.check" disabled/>
                    <Switch label="Read-only" off-bind="$page.check" readOnly/>
                    <Switch
                        label="Styled"
                        off-bind="$page.check"
                        handleStyle="background:white"
                        rangeStyle="background:lightsteelblue"
                    >
                        <span style="color:red">Label</span>
                    </Switch>
                </div>
            </div>
            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Switches" default/>
                <CodeSnippet fiddle="2kT3rmdr">{`
                    <div layout={LabelsLeftLayout}>
                        <Switch label="Default" on-bind="$page.check" text-expr="{$page.check} ? 'ON' : 'OFF'" />
                        <Switch label="Disabled" value-bind="$page.check" disabled/>
                        <Switch label="Read-only" off-bind="$page.check" readOnly/>
                        <Switch
                            label="Styled"
                            off-bind="$page.check"
                            handleStyle="background:white"
                            rangeStyle="background:lightsteelblue"
                        >
                            <span style="color:red">Label</span>
                        </Switch>
                    </div>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>

