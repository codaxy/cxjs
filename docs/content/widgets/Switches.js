import { HtmlElement, Switch } from 'cx/widgets';
import { LabelsLeftLayout } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';


import configs from './configs/Slider';


export const Switches = <cx>
    <Md>
        # Switch

        <ImportPath path="import {Switch} from 'cx/widgets';" />

        The `Switch` widget ...

        <CodeSplit>
            <div class="widgets">
                <div layout={LabelsLeftLayout}>
                    <Switch label="Stepped" from:bind="$page.from" step={10} />
                </div>
            </div>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>

