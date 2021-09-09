import {HtmlElement, DetachedScope} from 'cx/widgets';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';


import configs from './configs/DetachedScope';

export const DetachedScopePage = <cx>
    <Md>
        # DetachedScope

        <ImportPath path="import {DetachedScope} from 'cx/widgets';"/>

        `DetachedScope` is a component used exclusively to improve performance by detaching
        certain areas from the rest of the page. Detached contents render in their own render loop and use
        a data declaration which explains which changes can go in or out. This is commonly used to ensure optimal performance
        with rich popups, grids, charts and other interactive structures that might be negatively affected by
        other "heavy" elements visible on the page.

        <CodeSplit>

            <div class="widgets">
                <DetachedScope bind="$page.scope1">
                    <div style="width: 150px; height: 150px; background: #d4d4d4; padding: 20px">
                        Heavy duty contents 1
                    </div>
                </DetachedScope>

                <DetachedScope bind="$page.scope2">
                    <div style="width: 150px; height: 150px; background: #d4d4d4; padding: 20px">
                        Heavy duty contents 2
                    </div>
                </DetachedScope>
            </div>

            <CodeSnippet putInto="code" fiddle="0bBHNtfs">{`
                <DetachedScope bind="$page.scope1">
                    <div style="width: 150px; height: 150px; background: #d4d4d4; padding: 20px">
                        Heavy duty contents 1
                    </div>
                </DetachedScope>

                <DetachedScope bind="$page.scope2">
                    <div style="width: 150px; height: 150px; background: #d4d4d4; padding: 20px">
                        Heavy duty contents 2
                    </div>
                </DetachedScope>
            `}</CodeSnippet>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={{...configs, mod: false}}/>

    </Md>
</cx>

