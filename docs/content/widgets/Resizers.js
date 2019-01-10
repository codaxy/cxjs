import { Resizer } from 'cx/widgets';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';

import configs from './configs/Resizer';

export const Resizers = <cx>
    <Md>
        # Resizer

        <ImportPath path="import {Resizer} from 'cx/widgets';"/>

        Resizer is used to resize adjacent elements. In the background, Resizer uses the reference to one of the adjacent
        elements so it can measure their size. By default, Resizer uses the previous element sibling for size measurement. If we want to use the next
        element sibling instead, we can use the `forNextElement` flag. 
        
        When we move the Resizer, it either adds or subtracts the offset to the original size
        of the affected element. On double-click, the default size is set.

        <CodeSplit>
            <div class="widgets">
                <div style="width: 300px; height: 100px; display: flex;">
                    <div style={{
                        border: "1px solid gray",
                        background: "lightgray",
                        width: {expr: "{width} || '150px'"},
                        boxSizing: "border-box",
                        padding: 5
                    }}>
                        <span text-expr="{width} ? 'Width: ' + {width} + 'px' : 'Width: not set'" style="font-size: 11px;"/>
                    </div>
                    <Resizer size-bind="width" minSize={50} maxSize={250} />
                    <div style={{
                        border: "1px solid gray",
                        background: "lightgray",
                        flex: '1 1 0'
                    }}/>
                </div>
            </div>
            <CodeSnippet putInto="code">{`
                <div class="widgets">
                    <div style="width: 300px; height: 100px; display: flex;">
                        <div style={{
                            border: "1px solid gray",
                            background: "lightgray",
                            width: {expr: "{width} || '150px'"},
                            boxSizing: "border-box",
                            padding: 5
                        }}>
                            <span text-expr="{width} ? 'Width: ' + {width} + 'px' : 'Width: not set'" style="font-size: 11px;"/>
                        </div>
                        <Resizer size-bind="width" minSize={50} maxSize={250} />
                        <div style={{
                            border: "1px solid gray",
                            background: "lightgray",
                            flex: '1 1 0'
                        }}/>
                    </div>
                </div>
            `}</CodeSnippet>
        </CodeSplit>
        
        To use the Resizer, hover the space between two elements.

        > Please note that `box-sizing` should be set to `border-box` if elements which are being resized have borders.

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>
