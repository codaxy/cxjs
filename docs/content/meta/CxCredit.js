import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {CxCredit} from 'cx/ui/CxCredit';


export const CxCreditPage = <cx>
    <Md>
        # CxCredit

        The `CxCredit` widget is used to provide a credit backlink to the Cx product page.
        It is required to use this widget if you're using free version of the product.

        <CodeSplit>
            <div class="widgets">
                <CxCredit mod="inline" />
            </div>

            <CodeSnippet putInto="code">{`
                <CxCredit />
            `}</CodeSnippet>
        </CodeSplit>
    </Md>
</cx>

