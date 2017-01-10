import { HtmlElement, MsgBox, Button, Heading, Section, FlexRow } from 'cx/widgets';
import { Content } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';

import configs from './configs/Section';

export const Sections = <cx>
    <Md>
        # Section

        <ImportPath path="import {Section} from 'cx/widgets';" />

        Sections are used to divide a larger body into distinct parts. A section optionally may have a header (title)
        and a footer.

        <CodeSplit>
            <div class="widgets">
                <Section mod="well" title="Section 1">
                    Aenean quis ullamcorper dolor. Phasellus ullamcorper sapien elit, ac pharetra nibh mollis sed.
                </Section>

                <Section title="Section 2">
                    Aenean quis ullamcorper dolor. Phasellus ullamcorper sapien elit, ac pharetra nibh mollis sed.

                    <FlexRow putInto="footer">
                        <Button mod="hollow" icon="calendar"/>
                        <Button mod="hollow" icon="calculator"/>
                        <Button mod="hollow" icon="search"/>
                    </FlexRow>
                </Section>

                <Section mod="well">
                    <FlexRow align="center" putInto="header">
                        <Heading level="4" style="color:lightblue">Custom Header</Heading>
                        <Button mod="hollow" icon="close" style="margin-left: auto"/>
                    </FlexRow>
                    Aenean quis ullamcorper dolor. Phasellus ullamcorper sapien elit, ac pharetra nibh mollis sed.
                </Section>
            </div>
            <CodeSnippet putInto="code" fiddle="SJ9BRvXE">{`
                <Section mod="well" title="Section 1">
                    Aenean quis ullamcorper dolor. Phasellus ullamcorper sapien elit, ac pharetra nibh mollis sed.
                </Section>

                <Section title="Section 2">
                    Aenean quis ullamcorper dolor. Phasellus ullamcorper sapien elit, ac pharetra nibh mollis sed.

                    <FlexRow putInto="footer">
                        <Button mod="hollow" icon="calendar"/>
                        <Button mod="hollow" icon="calculator"/>
                        <Button mod="hollow" icon="search"/>
                    </FlexRow>
                </Section>

                <Section mod="well">
                    <FlexRow align="center" putInto="header">
                        <Heading level="4" style="color:lightblue">Custom Header</Heading>
                        <Button mod="hollow" icon="close" style="margin-left: auto"/>
                    </FlexRow>
                    Aenean quis ullamcorper dolor. Phasellus ullamcorper sapien elit, ac pharetra nibh mollis sed.
                </Section>
         `}</CodeSnippet>
        </CodeSplit>

        > FlexRow is commonly used to either arrange multiple sections horizontally or to arrange inner contents
        of a section or a header.


        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>
