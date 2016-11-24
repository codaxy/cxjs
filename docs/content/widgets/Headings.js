import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Heading} from 'cx/ui/Heading';

import configs from './configs/Heading';

export const Headings = <cx>
    <Md>
        # Heading

        <ImportPath path={"import {Heading} from 'cx/ui/Heading';"}/>

        The `Heading` widget renders a classic HTML heading (h1, h2, h3, ...) without any margin or padding. This is
        very convenient for window or section headers.

        <CodeSplit>
            <div class="widgets">
                <div>
                    <Heading level="1">Heading 1</Heading>
                    <Heading level="2">Heading 2</Heading>
                    <Heading level="3">Heading 3</Heading>
                    <Heading level="4">Heading 4</Heading>
                    <Heading level="5">Heading 5</Heading>
                    <Heading level="6">Heading 6</Heading>
                </div>
            </div>
            <CodeSnippet putInto="code">{`
                <div>
                    <Heading level="1">Heading 1</Heading>
                    <Heading level="2">Heading 2</Heading>
                    <Heading level="3">Heading 3</Heading>
                    <Heading level="4">Heading 4</Heading>
                    <Heading level="5">Heading 5</Heading>
                    <Heading level="6">Heading 6</Heading>
                </div>
            `}</CodeSnippet>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>
