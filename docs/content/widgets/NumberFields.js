import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';

import {Content} from 'cx/ui/layout/Content';
import {HtmlElement} from 'cx/ui/HtmlElement';
import {NumberField} from 'cx/ui/form/NumberField';
import {LabelsLeftLayout} from 'cx/ui/layout/LabelsLeftLayout';

import configs from './configs/NumberField';

export const NumberFields = <cx>
    <Md>
        # Number Field

      <ImportPath path={"import {NumberField} from 'cx/ui/form/NumberField';"}></ImportPath>

      The `NumberField` control is used for numeric inputs, including currencies and percentages.

        <CodeSplit>


            <div class="widgets">
                <div layout={LabelsLeftLayout}>
                    <NumberField label="Standard" value:bind="$page.number" autoFocus/>
                    <NumberField label="Disabled" value:bind="$page.number" disabled/>
                    <NumberField label="Readonly" value:bind="$page.number" readOnly/>
                    <NumberField label="Placeholder" value:bind="$page.number" placeholder="Type something here..."/>
                    <NumberField label="Validation" value:bind="$page.number" minValue={18} placeholder="Above 18..."/>
                    <NumberField label="Currency" value:bind="$page.number" placeholder="EUR" format="currency;EUR"/>
                    <NumberField label="Currency" value:bind="$page.number" placeholder="USD" format="currency;USD"/>
                </div>
                <div layout={LabelsLeftLayout}>
                    <NumberField label="Formatted" value:bind="$page.number" format="n;2"/>
                    <NumberField label="Percentage" value:bind="$page.number" format="ps"/>
                    <NumberField label="Suffix" value:bind="$page.number" format="suffix; kg"/>
                    <NumberField label="Required" value:bind="$page.number" required/>
                    <NumberField label="Styled" value:bind="$page.number" inputStyle={{border: '1px solid green'}}/>
                    <NumberField label="View" value:bind="$page.number" mode="view"/>
                    <NumberField label="EmptyText" value:bind="$page.number" mode="view" emptyText="N/A"/>
                </div>
            </div>

            <Content name="code">
                <CodeSnippet>{`
               <div layout={LabelsLeftLayout}>
                  <NumberField label="Standard" value:bind="$page.number" autoFocus/>
                  <NumberField label="Disabled" value:bind="$page.number" disabled />
                  <NumberField label="Readonly" value:bind="$page.number" readOnly />
                  <NumberField label="Placeholder" value:bind="$page.number" placeholder="Type something here..." />
                  <NumberField label="Validation" value:bind="$page.number" minValue={18} placeholder="Above 18..." />
               </div>
               <div layout={LabelsLeftLayout}>
                  <NumberField label="Formatted" value:bind="$page.number" format="n;2" />
                  <NumberField label="Percentage" value:bind="$page.number" format="ps" />
                  <NumberField label="Suffix" value:bind="$page.number" format="suffix; kg" />
                  <NumberField label="Required" value:bind="$page.number" required />
                  <NumberField label="Styled" value:bind="$page.number" inputStyle={{border: '1px solid green'}} />
                  <NumberField label="View" value:bind="$page.number" mode="view" />
                  <NumberField label="EmptyText" value:bind="$page.number" mode="view" emptyText="N/A" />
               </div>
            `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>
