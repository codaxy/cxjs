import { HtmlElement } from 'cx/widgets';
import { Svg, Rectangle, Text } from 'cx/svg';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from 'docs/components/ImportPath';


import configs from './configs/Text';

export const Texts = <cx>
   <Md>
      # Text

      <ImportPath path="import {Text} from 'cx/svg';" />

      <CodeSplit>

         The `Text` widget renders SVG `text`. The initial cursor position is the top-left corner of the bounding box.
         `textAnchor` and `dy` attributes are used to position the text.

         <div class="widgets">
            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="0 1 1 0" style="fill:lightblue" />
               <Text anchors="0 1 1 0" textAnchor="start" dy="0.8em">Top-left</Text>
            </Svg>
            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="0 1 1 0.5" style="fill:lightblue" />
               <Text anchors="0 1 1 0.5" textAnchor="middle" dy="0.8em">Top-center</Text>
            </Svg>
            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="0 1 1 1" style="fill:lightblue" />
               <Text anchors="0 1 1 1" textAnchor="end" dy="0.8em">Top-right</Text>
            </Svg>

            <div style="width:100%" />

            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="0.5 1 1 0" style="fill:lightblue" />
               <Text anchors="0.5 1 1 0" textAnchor="start" dy="0.4em">Middle-left</Text>
            </Svg>
            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="0.5 1 1 0.5" style="fill:lightblue" />
               <Text anchors="0.5 1 1 0.5" textAnchor="middle" dy="0.4em">Middle-center</Text>
            </Svg>
            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="0.5 1 1 1" style="fill:lightblue" />
               <Text anchors="0.5 1 1 1" textAnchor="end" dy="0.4em">Middle-right</Text>
            </Svg>

            <div style="width:100%" />

            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="1 1 1 0" style="fill:lightblue" />
               <Text anchors="1 1 1 0" textAnchor="start">Bottom-left</Text>
            </Svg>
            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="1 1 1 0.5" style="fill:lightblue" />
               <Text anchors="1 1 1 0.5" textAnchor="middle">Bottom-center</Text>
            </Svg>
            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="1 1 1 1" style="fill:lightblue" />
               <Text anchors="1 1 1 1" textAnchor="end">Bottom-right</Text>
            </Svg>
         </div>

         <CodeSnippet putInto="code">{`
            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="0 1 1 0" style="fill:lightblue" />
               <Text anchors="0 1 1 0" textAnchor="start" dy="0.8em">Top-left</Text>
            </Svg>
            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="0 1 1 0.5" style="fill:lightblue" />
               <Text anchors="0 1 1 0.5" textAnchor="middle" dy="0.8em">Top-center</Text>
            </Svg>
            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="0 1 1 1" style="fill:lightblue" />
               <Text anchors="0 1 1 1" textAnchor="end" dy="0.8em">Top-right</Text>
            </Svg>

            <div style="width:100%" />

            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="0.5 1 1 0" style="fill:lightblue" />
               <Text anchors="0.5 1 1 0" textAnchor="start" dy="0.4em">Middle-left</Text>
            </Svg>
            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="0.5 1 1 0.5" style="fill:lightblue" />
               <Text anchors="0.5 1 1 0.5" textAnchor="middle" dy="0.4em">Middle-center</Text>
            </Svg>
            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="0.5 1 1 1" style="fill:lightblue" />
               <Text anchors="0.5 1 1 1" textAnchor="end" dy="0.4em">Middle-right</Text>
            </Svg>

            <div style="width:100%" />

            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="1 1 1 0" style="fill:lightblue" />
               <Text anchors="1 1 1 0" textAnchor="start">Bottom-left</Text>
            </Svg>
            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="1 1 1 0.5" style="fill:lightblue" />
               <Text anchors="1 1 1 0.5" textAnchor="middle">Bottom-center</Text>
            </Svg>
            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="1 1 1 1" style="fill:lightblue" />
               <Text anchors="1 1 1 1" textAnchor="end">Bottom-right</Text>
            </Svg>
         `}</CodeSnippet>
      </CodeSplit>

      Internet Explorer doesn't support [dominant-baseline](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/dominant-baseline)
      property which is used for vertical text alignment. As an alternative, the `dy` attribute can be used to align the text.

      ## Configuration

      <ConfigTable props={configs} />

   </Md>
</cx>

