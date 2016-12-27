import { HtmlElement } from 'cx/widgets';
import { Svg, Line, Text } from 'cx/svg';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from 'docs/components/ImportPath';


import configs from './configs/Line';

export const Lines = <cx>
    <Md>
        # Line

        <ImportPath path="import {Line} from 'cx/svg';" />

        The `Line` widget is a Cx version of the SVG `line` element which can be used in responsive scenarios.
        Line is always rendered from the top-left corner to the bottom-right corner.
        In Cx, a line is a container element and allows other objects to be rendered within its boundaries, e.g. text.

        <CodeSplit>

            <div class="widgets">
                <Svg style="width:200px;height:200px;background:white" padding={5}>
                    <Line stroke="blue">
                        <Text dx="5px">Line</Text>
                    </Line>
                </Svg>
            </div>

            <CodeSnippet putInto="code">{`
            <Svg style="width:200px;height:200px;background:white" padding={5}>
               <Line stroke="blue">
                  <Text dx="5px">Line</Text>
               </Line>
            </Svg>
         `}</CodeSnippet>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>

