import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';

import {HtmlElement} from 'cx/ui/HtmlElement';

import {Svg} from 'cx/ui/svg/Svg';
import {Rectangle} from 'cx/ui/svg/Rectangle';
import {Text} from 'cx/ui/svg/Text';

import configs from './configs/Text';

export const Texts = <cx>
   <Md>
      # Text

      <CodeSplit>

         The `Text` widget renders SVG `text`. Top-left corner of the bounding box as the initial cursor position.
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

