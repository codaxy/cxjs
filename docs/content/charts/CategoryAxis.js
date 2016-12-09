import { HtmlElement } from 'cx/widgets';
import { Controller } from 'cx/ui';
import { Svg, Rectangle } from 'cx/svg';
import { Chart, CategoryAxis, Gridlines, Marker } from 'cx/charts';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';




import configs from './configs/CategoryAxis';

export const CategoryAxisPage = <cx>
    <Md>
        # Category Axis

        <CodeSplit>

            The `CategoryAxis` widget is used to map discrete data values along the horizontal or vertical axis of a chart.
            It's commonly used with bar and scatter charts.

            <div class="widgets">
                <Svg style="width:400px;height:300px;" margin="60 60 60 60">
                    <Chart axes={{
                        x: <CategoryAxis />,
                        y: <CategoryAxis vertical />
                    }}>
                        <Rectangle fill="white"/>
                        <Gridlines />

                        <Marker x="Red" y="Triangle" shape="triangle" size={20} colorIndex="0" />
                        <Marker x="Green" y="Triangle" shape="triangle" size={20} colorIndex="9" />
                        <Marker x="Blue" y="Triangle" shape="triangle" size={20} colorIndex="5" />

                        <Marker x="Red" y="Square" shape="square" size={20} colorIndex="0" />
                        <Marker x="Green" y="Square" shape="square" size={20} colorIndex="9" />
                        <Marker x="Blue" y="Square" shape="square" size={20} colorIndex="5" />

                        <Marker x="Red" y="Circle" shape="circle" size={20} colorIndex="0" />
                        <Marker x="Green" y="Circle" shape="circle" size={20} colorIndex="9" />
                        <Marker x="Blue" y="Circle" shape="circle" size={20} colorIndex="5" />

                    </Chart>
                </Svg>
            </div>

            <CodeSnippet putInto="code">{`
                <Svg style="width:400px;height:300px;" margin="60 60 60 60">
                    <Chart axes={{
                        x: <CategoryAxis />,
                        y: <CategoryAxis vertical />
                    }}>
                        <Rectangle fill="white"/>
                        <Gridlines />

                        <Marker x="Red" y="Triangle" shape="triangle" size={20} colorIndex="0" />
                        <Marker x="Green" y="Triangle" shape="triangle" size={20} colorIndex="9" />
                        <Marker x="Blue" y="Triangle" shape="triangle" size={20} colorIndex="5" />

                        <Marker x="Red" y="Square" shape="square" size={20} colorIndex="0" />
                        <Marker x="Green" y="Square" shape="square" size={20} colorIndex="9" />
                        <Marker x="Blue" y="Square" shape="square" size={20} colorIndex="5" />

                        <Marker x="Red" y="Circle" shape="circle" size={20} colorIndex="0" />
                        <Marker x="Green" y="Circle" shape="circle" size={20} colorIndex="9" />
                        <Marker x="Blue" y="Circle" shape="circle" size={20} colorIndex="5" />

                    </Chart>
                </Svg>
            `}</CodeSnippet>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>

