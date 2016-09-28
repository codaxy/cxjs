import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {ColorPicker} from 'cx/ui/form/ColorPicker';

import configs from './configs/ColorPicker';

export const ColorPickers = <cx>
    <Md>
        # ColorPicker

        The `ColorPicker` widget is used for selecting colors.


        <CodeSplit>

            <div class="widgets">
                <ColorPicker value:bind="$page.color"/>
                <div style={{width:'100px', height: '70px', background:{bind:'$page.color'}}}></div>
            </div>

            <CodeSnippet putInto="code">{`
            <div class="widgets">
                <ColorPicker value:bind="$page.color"/>
                <div style={{width:'100px', height: '70px', background:{bind:'$page.color'}}}>
            </div>
         `}</CodeSnippet>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>

