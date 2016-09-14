import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';

import {HtmlElement} from 'cx/ui/HtmlElement';

import {Svg} from 'cx/ui/svg/Svg';
import {Rectangle} from 'cx/ui/svg/Rectangle';
import {Text} from 'cx/ui/svg/Text';

import configs from './configs/Rectangle';

export const Rectangles = <cx>
   <Md>
      # Rectangle

      Rectangle is a Cx version of SVG `rect` object which can be used in responsive scenarios.

      <CodeSplit>

         <div class="widgets">
            <Svg style="width:400px;height:400px;background:white" padding={5}>
               <Rectangle anchors="0 .25 .25 0" margin={5} colorIndex={0} />
               <Rectangle anchors="0 .5 .25 .25" margin={5} colorIndex={1} />
               <Rectangle anchors="0 .75 .25 .5" margin={5} colorIndex={2} />
               <Rectangle anchors="0 1 .25 .75" margin={5} colorIndex={3} />

               <Rectangle anchors=".25 .25 .5 0" margin={5} colorIndex={7} />
               <Rectangle anchors=".25 .5 .5 .25" margin={5} colorIndex={6} />
               <Rectangle anchors=".25 .75 .5 .5" margin={5} colorIndex={5} />
               <Rectangle anchors=".25 1 .5 .75" margin={5} colorIndex={4} />

               <Rectangle anchors=".5 .25 .75 0" margin={5} colorIndex={8} />
               <Rectangle anchors=".5 .5 .75 .25" margin={5} colorIndex={9} />
               <Rectangle anchors=".5 .75 .75 .5" margin={5} colorIndex={10} />
               <Rectangle anchors=".5 1 .75 .75" margin={5} colorIndex={11} />

               <Rectangle anchors=".75 .25 1 0" margin={5} colorIndex={15} />
               <Rectangle anchors=".75 .5 1 .25" margin={5} colorIndex={14} />
               <Rectangle anchors=".75 .75 1 .5" margin={5} colorIndex={13} />
               <Rectangle anchors=".75 1 1 .75" margin={5} colorIndex={12} />
            </Svg>
         </div>

         <CodeSnippet putInto="code">{`
            <Svg style="width:400px;height:400px;background:white" padding={5}>
               <Rectangle anchors="0 .25 .25 0" margin={5} colorIndex={0} />
               <Rectangle anchors="0 .5 .25 .25" margin={5} colorIndex={1} />
               <Rectangle anchors="0 .75 .25 .5" margin={5} colorIndex={2} />
               <Rectangle anchors="0 1 .25 .75" margin={5} colorIndex={3} />

               <Rectangle anchors=".25 .25 .5 0" margin={5} colorIndex={7} />
               <Rectangle anchors=".25 .5 .5 .25" margin={5} colorIndex={6} />
               <Rectangle anchors=".25 .75 .5 .5" margin={5} colorIndex={5} />
               <Rectangle anchors=".25 1 .5 .75" margin={5} colorIndex={4} />

               <Rectangle anchors=".5 .25 .75 0" margin={5} colorIndex={8} />
               <Rectangle anchors=".5 .5 .75 .25" margin={5} colorIndex={9} />
               <Rectangle anchors=".5 .75 .75 .5" margin={5} colorIndex={10} />
               <Rectangle anchors=".5 1 .75 .75" margin={5} colorIndex={11} />

               <Rectangle anchors=".75 .25 1 0" margin={5} colorIndex={15} />
               <Rectangle anchors=".75 .5 1 .25" margin={5} colorIndex={14} />
               <Rectangle anchors=".75 .75 1 .5" margin={5} colorIndex={13} />
               <Rectangle anchors=".75 1 1 .75" margin={5} colorIndex={12} />
            </Svg>
         `}</CodeSnippet>
      </CodeSplit>

      ## Configuration

      <ConfigTable props={configs} />

   </Md>
</cx>

