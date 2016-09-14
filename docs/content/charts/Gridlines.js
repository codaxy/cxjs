import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';

import {HtmlElement} from 'cx/ui/HtmlElement';

import {Svg} from 'cx/ui/svg/Svg';
import {Chart} from 'cx/ui/svg/charts/Chart';
import {Rectangle} from 'cx/ui/svg/Rectangle';
import {NumericAxis} from 'cx/ui/svg/charts/axis/NumericAxis';
import {Gridlines} from 'cx/ui/svg/charts/Gridlines';

import configs from './configs/Gridlines';

export const GridlinesPage = <cx>
    <Md>
        # Gridlines

        The `Gridlines` widget is used to draw horizontal and vertical gridlines, usually in the chart backgrounds.
        Beside aesthetics, gridlines make it easier to read axis values.

        <CodeSplit>

            <div class="widgets">
                <Svg style="width:300px;height:200px;border:1px solid #ddd" margin="10 20 30 50">
                    <Chart axes={{
                        x: <NumericAxis />,
                        y: <NumericAxis vertical/>
                    }}>
                        <Rectangle fill="white" />
                        <Gridlines />
                    </Chart>
                </Svg>
            </div>

            <CodeSnippet putInto="code">{`
             <Svg style="width:300px;height:200px" margin="10 20 30 50">
               <Chart axes={{
                  x: <NumericAxis />,
                  y: <NumericAxis vertical/>
               }}>
                  <Rectangle fill="white" />
                  <Gridlines />
               </Chart>
            </Svg>
         `}</CodeSnippet>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs} />

    </Md>
</cx>;

