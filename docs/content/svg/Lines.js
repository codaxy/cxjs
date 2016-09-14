import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';

import {HtmlElement} from 'cx/ui/HtmlElement';

import {Svg} from 'cx/ui/svg/Svg';
import {Line} from 'cx/ui/svg/Line';
import {Text} from 'cx/ui/svg/Text';

import configs from './configs/Line';

export const Lines = <cx>
    <Md>
        # Line

        The `Line` widget is a Cx version of SVG `line` element which can be used in responsive scenarios.
        Line is always rendered from the top-left corner to the bottom-right corner.
        In Cx, line is a container element and allows other objects to be rendered within its boundaries, e.g. text.

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

