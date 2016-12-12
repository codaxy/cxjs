import { HtmlElement, MsgBox, Button, Section, Repeater, FlexRow, FlexBox } from 'cx/widgets';
import { Content, Heading } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';




import configs from './configs/FlexBox';

export const FlexBoxPage = <cx>
    <Md>
        # FlexBox

        <ImportPath path={"import { FlexBox, FlexRow, FlexCol } from 'cx/widgets';"}/>

        `FlexBox` is a convenience widget for setting up simple flex-box based layouts. `FlexBox` provides
        a number of shortcut options which make it easy to justify, align or add spacing to the content.

        <CodeSplit>
            #### Spacing

            <FlexRow spacing>
                <div style="width: 30px; height: 30px; background: lightgray;" />
                <div style="width: 40px; height: 40px; background: lightgray;" />
                <div style="width: 50px; height: 50px; background: lightgray;" />
            </FlexRow>


            <CodeSnippet putInto="code">{`
                <FlexRow spacing>
                    <div style="width: 30px; height: 30px; background: lightgray;" />
                    <div style="width: 40px; height: 40px; background: lightgray;" />
                    <div style="width: 50px; height: 50px; background: lightgray;" />
                </FlexRow>
            `}</CodeSnippet>
        </CodeSplit>

        <CodeSplit>
            #### Justify

            <FlexRow spacing justify="center">
                <div style="width: 30px; height: 30px; background: lightgray;" />
                <div style="width: 40px; height: 40px; background: lightgray;" />
                <div style="width: 50px; height: 50px; background: lightgray;" />
            </FlexRow>


            <CodeSnippet putInto="code">{`
                <FlexRow spacing justify="center">
                    <div style="width: 30px; height: 30px; background: lightgray;" />
                    <div style="width: 40px; height: 40px; background: lightgray;" />
                    <div style="width: 50px; height: 50px; background: lightgray;" />
                </FlexRow>
            `}</CodeSnippet>
        </CodeSplit>

        <CodeSplit>
            #### Align

            <FlexRow spacing align="center" justify="end">
                <div style="width: 30px; height: 30px; background: lightgray;" />
                <div style="width: 40px; height: 40px; background: lightgray;" />
                <div style="width: 50px; height: 50px; background: lightgray;" />
            </FlexRow>


            <CodeSnippet putInto="code">{`
                <FlexRow spacing align="center" justify="end">
                    <div style="width: 30px; height: 30px; background: lightgray;" />
                    <div style="width: 40px; height: 40px; background: lightgray;" />
                    <div style="width: 50px; height: 50px; background: lightgray;" />
                </FlexRow>
            `}</CodeSnippet>
        </CodeSplit>

        <CodeSplit>
            #### Wrap

            <FlexRow spacing wrap>
                <Repeater records={Array.from({length: 20})}>
                    <div style="width: 30px; height: 30px; background: lightgray;" />
                </Repeater>
            </FlexRow>


            <CodeSnippet putInto="code">{`
                <FlexRow spacing wrap>
                    <Repeater records={Array.from({length: 20})}>
                        <div style="width: 30px; height: 30px; background: lightgray;" />
                    </Repeater>
                </FlexRow>
            `}</CodeSnippet>
        </CodeSplit>

        <CodeSplit>
            #### Pad

            <div style="background:#eee;border:1px solid lightgray;">
                <FlexRow pad spacing wrap>
                    <Repeater records={Array.from({length: 20})}>
                        <div style="width: 30px; height: 30px; background: lightgray;" />
                    </Repeater>
                </FlexRow>
            </div>


            <CodeSnippet putInto="code">{`
                <div style="background:#eee;border:1px solid lightgray;">
                    <FlexRow pad spacing wrap>
                        <Repeater records={Array.from({length: 20})}>
                            <div style="width: 30px; height: 30px; background: lightgray;" />
                        </Repeater>
                    </FlexRow>
                </div>
            `}</CodeSnippet>
        </CodeSplit>

        <CodeSplit>
            #### `target="desktop"`

            This will break into multiple rows on screens smaller than desktop, e.g. tablets and phones.

            <FlexRow spacing target="desktop">
                <div style="flex: 1; height: 30px; background: lightgray;" />
                <div style="flex: 1; height: 30px; background: lightgray;" />
                <div style="flex: 1; height: 30px; background: lightgray;" />
            </FlexRow>



            <CodeSnippet putInto="code">{`
                <FlexRow spacing target="desktop">
                    <div style="flex: 1; height: 30px; background: lightgray;" />
                    <div style="flex: 1; height: 30px; background: lightgray;" />
                    <div style="flex: 1; height: 30px; background: lightgray;" />
                </FlexRow>
            `}</CodeSnippet>
        </CodeSplit>

        <CodeSplit>
            #### `target="tablet"`

            This will break into multiple rows on phones, but will remain in one line
            on desktop screens.

            <FlexRow spacing target="tablet">
                <div style="flex: 1; height: 30px; background: lightgray;" />
                <div style="flex: 1; height: 30px; background: lightgray;" />
            </FlexRow>



            <CodeSnippet putInto="code">{`
                <FlexRow spacing target="tablet">
                    <div style="flex: 1; height: 30px; background: lightgray;" />
                    <div style="flex: 1; height: 30px; background: lightgray;" />
                </FlexRow>
            `}</CodeSnippet>
        </CodeSplit>

        ### Notes

        > Please note that CSS based layouts should be preferred to FlexBox for more complex arrangements.

        > `spacing` option uses adds negative margin and it will behave normally only if the parent element has `border` or `padding`
        set.

        > `FlexRow = FlexBox + direction="row"`

        > `FlexCol = FlexBox + direction="column"`
        

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>
