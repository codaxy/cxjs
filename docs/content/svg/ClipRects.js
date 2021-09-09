import { Content, HtmlElement, Tab } from 'cx/widgets';
import { Svg, Rectangle, ClipRect, Ellipse, Text } from 'cx/svg';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from 'docs/components/ImportPath';


import configs from './configs/BoundedObject';

export const ClipRects = <cx>
    <Md>
        # ClipRect

        <ImportPath path="import {ClipRect} from 'cx/svg';" />

        <CodeSplit>

            The `ClipRect` widget can be used for clipping its inner contents.

            <div class="widgets">
                <Svg style="width:200px;height:200px;background:white;margin:5px">
                    <ClipRect margin={15}>
                        <Ellipse margin={-10} fill="red" />
                    </ClipRect>
                </Svg>
            </div>

            Examples:

            * [Timeline](~/examples/charts/bar/timeline)

            <Content name="code">
                <div>
                    <Tab value-bind="$page.code.tab" tab="rect" mod="code" default><code>Rect</code></Tab>
                </div>
                <CodeSnippet fiddle="fc1P9AaB" visible-expr="{$page.code.tab}=='rect'">{`
                <div class="widgets">
                    <Svg style="width:200px;height:200px;background:white;margin:5px">
                        <ClipRect margin={15}>
                            <Ellipse margin={-10} fill="red" />
                        </ClipRect>
                    </Svg>
                </div>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>

