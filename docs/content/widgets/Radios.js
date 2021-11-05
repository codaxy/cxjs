import { Content, Controller, LabelsLeftLayout } from 'cx/ui';
import { HtmlElement, Radio, Repeater } from 'cx/widgets';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';


import configs from './configs/Radio';

class RadioController extends Controller {
    init() {
        var options = Array.from({length: 20}).map((v, i) => ({id: i, text: `Option ${i + 1}`}));
        this.store.set('$page.options', options);
    }
}

export const Radios = <cx>
    <Md>
        # Radio

      <ImportPath path="import {Radio} from 'cx/widgets';" />

      Radio buttons are commonly used for making a single selection within a limited number of options.

        <CodeSplit>


            <div class="widgets">
                <div layout={LabelsLeftLayout}>
                    <Radio label="Native" value-bind="$page.option" option="0" text="Radio" native default />
                    <Radio label="Standard" value-bind="$page.option" option="1" text="Radio" />
                    <Radio label="Disabled" value-bind="$page.option" option="2" disabled text="Radio"/>
                </div>
                <div layout={LabelsLeftLayout}>
                    <Radio label="Required" value-bind="$page.option" option="4" required text="Radio"/>
                    <Radio label="Readonly" value-bind="$page.option" option="3" readOnly text="Radio"/>
                    <Radio label="Styled" value-bind="$page.option" option="5" inputStyle="color:red" text="Radio"/>
                </div>
            </div>

            <Content name="code">
                <CodeSnippet fiddle="w0Hk6JJo">{`
                <div layout={LabelsLeftLayout}>
                    <Radio label="Native" value-bind="$page.option" option="0" text="Radio" native default />
                    <Radio label="Standard" value-bind="$page.option" option="1" text="Radio"/>
                    <Radio label="Disabled" value-bind="$page.option" option="2" disabled text="Radio"/>
                </div>
                <div layout={LabelsLeftLayout}>
                    <Radio label="Required" value-bind="$page.option" option="4" required text="Radio"/>
                    <Radio label="Readonly" value-bind="$page.option" option="3" readOnly text="Radio"/>
                    <Radio label="Styled" value-bind="$page.option" option="5" inputStyle="color:red" text="Radio"/>
                </div>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## Examples

        <CodeSplit>

            ### Repeater example

            Radio is commonly combined with a `Repeater` when the list of choices is dynamic.

            <div class="widgets">
                <div controller={RadioController}>
                    <Repeater records-bind="$page.options">
                        <Radio value-bind="$page.option" option-bind="$record.id" text-bind="$record.text"
                            style={{float: 'left', width: '130px'}}/>
                    </Repeater>
                </div>
            </div>

            Please note that, in order to avoid multiple instances, controller should not be assigned to the Repeater.

            <Content name="code">
                <CodeSnippet fiddle="6Am2ggFS">
                {`
                    class RadioController extends Controller {
                        init() {
                            var options = Array.from({length: 20}).map((v, i) => ({ id: i, text: \`Option \${i + 1}\` }));
                            this.store.set('$page.options', options);
                        }
                    }
                    ...
                    <div controller={RadioController}>
                        <Repeater records-bind="$page.options">
                            <Radio value-bind="$page.option" option-bind="$record.id" text-bind="$record.text" style={{float: 'left', width: '130px'}} />
                        </Repeater>
                    </div>
                `}
                </CodeSnippet>
            </Content>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>
