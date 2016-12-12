import { HtmlElement } from 'cx/widgets';
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

            The `ClipRect` widget can be used to clip its inner contents.

            <div class="widgets">
                <Svg style="width:200px;height:200px;background:white;margin:5px">
                    <ClipRect margin={15}>
                        <Ellipse margin={-10} fill="red" />
                    </ClipRect>
                </Svg>
            </div>

            Examples:

            * [Timeline](~/examples/charts/bar/timeline)

            <CodeSnippet putInto="code">{`
            <div class="widgets">
                <Svg style="width:200px;height:200px;background:white;margin:5px">
                    <ClipRect margin={15}>
                        <Ellipse margin={-10} fill="red" />
                    </ClipRect>
                </Svg>
            </div>
            `}</CodeSnippet>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>

