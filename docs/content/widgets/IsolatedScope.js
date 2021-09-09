import {HtmlElement, IsolatedScope, TextField} from 'cx/widgets';
import {LabelsLeftLayout} from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';


import configs from './configs/IsolatedScope';

export const IsolatedScopePage = <cx>
    <Md>
        # IsolatedScope

        <ImportPath path="import {IsolatedScope} from 'cx/widgets';"/>

        `IsolatedScope` is a component used exclusively to improve performance by isolating
        certain areas from unnecessary recomputations. Contents of an isolated scope will change
        only if specified data change. Imagine a data declaration used to determine
        if underlying contents should update. This is commonly used with grids, charts or any
        other rich content that might cause performance issues for the rest of the page.

        <CodeSplit>

            <div class="widgets">
                <IsolatedScope bind="$page.scope1">
                    <div style="width: 150px; height: 150px; background: #d4d4d4; padding: 20px">
                        Heavy duty contents 1
                    </div>
                </IsolatedScope>

                <IsolatedScope bind="$page.scope2">
                    <div style="width: 150px; height: 150px; background: #d4d4d4; padding: 20px">
                        Heavy duty contents 2
                    </div>
                </IsolatedScope>
            </div>

            <CodeSnippet putInto="code" fiddler="Kw4NTOJf">{`
                <IsolatedScope bind="$page.scope1">
                    <div style="width: 150px; height: 150px; background: #d4d4d4; padding: 20px">
                        Heavy duty contents 1
                    </div>
                </IsolatedScope>

                <IsolatedScope bind="$page.scope2">
                    <div style="width: 150px; height: 150px; background: #d4d4d4; padding: 20px">
                        Heavy duty contents 2
                    </div>
                </IsolatedScope>
            `}</CodeSnippet>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={{...configs, mod: false}}/>

    </Md>
</cx>

