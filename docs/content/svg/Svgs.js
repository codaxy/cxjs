import { HtmlElement } from 'cx/widgets';
import { Svg, Rectangle, Text } from 'cx/svg';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from 'docs/components/ImportPath';

import configs from './configs/Svg';


export const Svgs = <cx>
    <Md>
        # SVG

        <ImportPath path="import {Svg} from 'cx/svg';" />

        <CodeSplit>

            Cx has a very good support for *Scalable Vector Graphics* (SVG) and enables responsive layouts and charts
            using the concept of bounded objects.

            ## Bounded Objects

            > To allow the use of bounded objects, use the `Svg` container, instead of `svg`.

            The `Svg` component will measure its size and pass the bounding box information to child elements.
            Child elements should use parent bounds to calculate their own size and pass it to their own children.

            Bounds are defined using the `anchors`, `offset` and `margin` properties. Each of these properties consists
            of four components `t r b l`. which represent *top, right, bottom, left* edges of the rectangle (in clockwise
            order).
            Suffixes should not be used (e.g. % or px).

            ### `anchors`

            Anchor defines how child bounds are tied to the parent. Zero aligns to the left/top edge.
            One aligns to the right/bottom edge.

            <div class="widgets">
                <Svg style="width:100px;height:100px;background:white;margin:5px">
                    <Rectangle anchors="0 1 1 0" style="fill:lightblue"/>
                    <Text textAnchor="middle" dy="0.4em" style="font-size:10px">0 1 1 0</Text>
                </Svg>

                <Svg style="width:100px;height:100px;background:white;margin:5px">
                    <Rectangle anchors="0.25 0.75 0.75 0.25" style="fill:lightblue"/>
                    <Text textAnchor="middle" dy="0.4em" style="font-size:10px">0.25 0.75 0.75 0.25</Text>
                </Svg>

                <Svg style="width:100px;height:100px;background:white;margin:5px">
                    <Rectangle anchors="0 0.5 1 0" style="fill:lightblue"/>
                    <Text textAnchor="middle" dy="0.4em" style="font-size:10px">0 0.5 1 0</Text>
                </Svg>

                <Svg style="width:100px;height:100px;background:white;margin:5px">
                    <Rectangle anchors="0 1 0.5 0" style="fill:lightblue"/>
                    <Text textAnchor="middle" dy="0.4em" style="font-size:10px">0 1 0.5 0</Text>
                </Svg>

                <Svg style="width:100px;height:100px;background:white;margin:5px">
                    <Rectangle anchors="0.5 1 1 0.5" style="fill:lightblue"/>
                    <Text textAnchor="middle" dy="0.4em" style="font-size:10px">0.5 1 1 0.5</Text>
                </Svg>
            </div>

            <CodeSnippet putInto="code" fiddle="SRpoMWVY">{`
            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="0 1 1 0" style="fill:lightblue" />
               <Text textAnchor="middle" dy="0.4em" style="font-size:10px">0 1 1 0</Text>
            </Svg>

            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="0.25 0.75 0.75 0.25" style="fill:lightblue" />
               <Text textAnchor="middle" dy="0.4em" style="font-size:10px">0.25 0.75 0.75 0.25</Text>
            </Svg>

            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="0 0.5 1 0" style="fill:lightblue" />
               <Text textAnchor="middle" dy="0.4em" style="font-size:10px">0 0.5 1 0</Text>
            </Svg>

            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="0 1 0.5 0" style="fill:lightblue" />
               <Text textAnchor="middle" dy="0.4em" style="font-size:10px">0 1 0.5 0</Text>
            </Svg>

            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="0.5 1 1 0.5" style="fill:lightblue" />
               <Text textAnchor="middle" dy="0.4em" style="font-size:10px">0.5 1 1 0.5</Text>
            </Svg>
         `}</CodeSnippet>
        </CodeSplit>

        <CodeSplit>
            ### `offset`

            The `offset` property is applied second, and it translates the edges of the box.

            <div class="widgets">
                <Svg style="width:100px;height:100px;background:white;margin:5px">
                    <Rectangle anchors="0 1 1 0" offset="5 -5 -5 5" style="fill:lightblue"/>
                    <Text textAnchor="middle" dy="-0.1em" style="font-size:10px">A: 0 1 1 0</Text>
                    <Text textAnchor="middle" dy="0.9em" style="font-size:10px">O: 5 -5 -5 5</Text>
                </Svg>

                <Svg style="width:100px;height:100px;background:white;margin:5px">
                    <Rectangle anchors="0.5 0.5 0.5 0.5" offset="-30 30 30 -30" style="fill:lightblue"/>
                    <Text textAnchor="middle" dy="-0.1em" style="font-size:10px">A: 0.5 0.5 0.5 0.5</Text>
                    <Text textAnchor="middle" dy="0.9em" style="font-size:10px">O: -30 30 30 -30</Text>
                </Svg>
            </div>

            <CodeSnippet putInto="code" fiddle="VYruDPVD">{`
            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="0 1 1 0" offset="5 -5 -5 5" style="fill:lightblue" />
               <Text textAnchor="middle" dy="-0.1em" style="font-size:10px">A: 0 1 1 0</Text>
               <Text textAnchor="middle" dy="0.9em" style="font-size:10px">O: 5 -5 -5 5</Text>
            </Svg>

            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="0.5 0.5 0.5 0.5" offset="-30 30 30 -30" style="fill:lightblue" />
               <Text textAnchor="middle" dy="-0.1em" style="font-size:10px">A: 0.5 0.5 0.5 0.5</Text>
               <Text textAnchor="middle" dy="0.9em" style="font-size:10px">O: -30 30 30 -30</Text>
            </Svg>
         `}</CodeSnippet>
        </CodeSplit>

        <CodeSplit>
            ### `margin`

            The `margin` property is very similar to the `offset` property. The only difference is that it behaves
            just like a CSS margin, that is, positive values move the edges to the inside, and negative values
            expand them to the outside of the bounds set with the anchor property.

            <div class="widgets">
                <Svg style="width:100px;height:100px;background:white;margin:5px">
                    <Rectangle anchors="0 1 1 0" margin={5} style="fill:lightblue"/>
                    <Text textAnchor="middle" dy="-0.1em" style="font-size:10px">A: 0 1 1 0</Text>
                    <Text textAnchor="middle" dy="0.9em" style="font-size:10px">M: 5</Text>
                </Svg>

                <Svg style="width:100px;height:100px;background:white;margin:5px">
                    <Rectangle anchors="0.5 0.5 0.5 0.5" margin={-30} style="fill:lightblue"/>
                    <Text textAnchor="middle" dy="-0.1em" style="font-size:10px">A: 0.5 0.5 0.5 0.5</Text>
                    <Text textAnchor="middle" dy="0.9em" style="font-size:10px">M: -30</Text>
                </Svg>
            </div>

            <CodeSnippet putInto="code" fiddle="MzQrRNpT">{`
            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="0 1 1 0" margin={5} style="fill:lightblue" />
               <Text textAnchor="middle" dy="-0.1em" style="font-size:10px">A: 0 1 1 0</Text>
               <Text textAnchor="middle" dy="0.9em" style="font-size:10px">M: 5</Text>
            </Svg>

            <Svg style="width:100px;height:100px;background:white;margin:5px">
               <Rectangle anchors="0.5 0.5 0.5 0.5" margin={-30} style="fill:lightblue" />
               <Text textAnchor="middle" dy="-0.1em" style="font-size:10px">A: 0.5 0.5 0.5 0.5</Text>
               <Text textAnchor="middle" dy="0.9em" style="font-size:10px">M: -30</Text>
            </Svg>
         `}</CodeSnippet>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>

