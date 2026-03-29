import { HtmlElement, ColorPicker, Content, Tab } from 'cx/widgets';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';


import configs from './configs/ColorPicker';

export const ColorPickers = <cx>
    <Md>
        # ColorPicker

        <ImportPath path="import {ColorPicker} from 'cx/widgets';" />

        The `ColorPicker` widget is used for selecting colors.


        <CodeSplit>

            <div class="widgets">
                <ColorPicker value-bind="$page.color"/>
                <div style={{width:'100px', height: '70px', background:{bind:'$page.color'}}}></div>
            </div>
            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="index" text="ColorPicker" default/>
                <CodeSnippet fiddle="9B8Xyzfj">{`
                <div class="widgets">
                    <ColorPicker value-bind="$page.color"/>
                    <div style={{width:'100px', height: '70px', background:{bind:'$page.color'}}}></div>
                </div>
            `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>

