import {FlexRow, Splitter, FlexCol} from 'cx/widgets';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';

import configs from './configs/Splitter';

export const Splitters = <cx>
    <Md>
        # Splitter

        <ImportPath path="import {Splitter} from 'cx/widgets';"/>

        Splitters are used to resize adjacent components.

        <CodeSplit>
            <div class="widgets">
                <div style="width: 300px; height: 100px; display: flex;">
                    <div style={{
                        border: "1px solid gray",
                        background: "lightgray",
                        width: {expr: "{width} || '150px'"},
                        boxSizing: "border-box"
                    }}/>
                    <Splitter value-bind="width" minValue={50} maxValue={250} />
                    <div style={{
                        border: "1px solid gray",
                        background: "lightgray",
                        flex: '1 1 0'
                    }}/>
                </div>
            </div>
            <CodeSnippet putInto="code">{`
                <div style="width: 300px; height: 100px; display: flex">
                    <div style={{
                        border: "1px solid gray",
                        background: "lightgray",
                        width: {expr: "{width} || '150px'"}
                    }}/>
                    <Splitter value-bind="width" minValue={50} maxValue={250} />
                    <div style={{
                        border: "1px solid gray",
                        background: "lightgray",
                        flex: '1 1 0'
                    }}/>
                </div>
            `}</CodeSnippet>
        </CodeSplit>

        > Please note that `box-sizing` should be set to `border-box` if elements which are being resized have borders.

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>
