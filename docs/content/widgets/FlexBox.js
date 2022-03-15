import { HtmlElement, MsgBox, Button, Section, Repeater, FlexRow, FlexBox, Heading, Tab } from 'cx/widgets';
import { Content } from 'cx/ui';
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

            <Content name="code">
                <Tab value-bind="$page.code1.tab" mod="code" tab="spacing" text="Spacing" default/>
                <Tab value-bind="$page.code1.tab" mod="code" tab="justify" text="Justify"/>
                <Tab value-bind="$page.code1.tab" mod="code" tab="align" text="Align"/>
                <Tab value-bind="$page.code1.tab" mod="code" tab="wrap" text="Wrap"/>
                <Tab value-bind="$page.code1.tab" mod="code" tab="pad" text="Pad"/>

                <CodeSnippet visible-expr="{$page.code1.tab}=='spacing'" fiddle="NhTe1hyS">{`
                    <FlexRow spacing>
                        <div style="width: 30px; height: 30px; background: lightgray;" />
                        <div style="width: 40px; height: 40px; background: lightgray;" />
                        <div style="width: 50px; height: 50px; background: lightgray;" />
                    </FlexRow>
                `}</CodeSnippet>
                <CodeSnippet visible-expr="{$page.code1.tab}=='justify'">{`
                    <FlexRow spacing justify="center">
                        <div style="width: 30px; height: 30px; background: lightgray;" />
                        <div style="width: 40px; height: 40px; background: lightgray;" />
                        <div style="width: 50px; height: 50px; background: lightgray;" />
                    </FlexRow>
                `}</CodeSnippet>
                <CodeSnippet visible-expr="{$page.code1.tab}=='align'">{`
                    <FlexRow spacing align="center" justify="end">
                        <div style="width: 30px; height: 30px; background: lightgray;" />
                        <div style="width: 40px; height: 40px; background: lightgray;" />
                        <div style="width: 50px; height: 50px; background: lightgray;" />
                    </FlexRow>
                `}</CodeSnippet>
                <CodeSnippet visible-expr="{$page.code1.tab}=='wrap'">{`
                    <FlexRow spacing wrap>
                        <Repeater records={Array.from({length: 20})}>
                            <div style="width: 30px; height: 30px; background: lightgray;" />
                        </Repeater>
                    </FlexRow>
                `}</CodeSnippet>
            <CodeSnippet visible-expr="{$page.code1.tab}=='pad'" fiddle="NhTe1hyS">{`
                <FlexRow pad spacing wrap style="background:#eee;border:1px solid lightgray;">
                    <Repeater records={Array.from({length: 20})}>
                        <div style="width: 30px; height: 30px; background: lightgray;" />
                    </Repeater>
                </FlexRow>
            `}</CodeSnippet>
            </Content>
        </CodeSplit>

        <CodeSplit>
            #### Justify

            <FlexRow spacing justify="center">
                <div style="width: 30px; height: 30px; background: lightgray;" />
                <div style="width: 40px; height: 40px; background: lightgray;" />
                <div style="width: 50px; height: 50px; background: lightgray;" />
            </FlexRow>
        </CodeSplit>

        <CodeSplit>
            #### Align

            <FlexRow spacing align="center" justify="end">
                <div style="width: 30px; height: 30px; background: lightgray;" />
                <div style="width: 40px; height: 40px; background: lightgray;" />
                <div style="width: 50px; height: 50px; background: lightgray;" />
            </FlexRow>
        </CodeSplit>

        <CodeSplit>
            #### Wrap

            <FlexRow spacing wrap>
                <Repeater records={Array.from({length: 20})}>
                    <div style="width: 30px; height: 30px; background: lightgray;" />
                </Repeater>
            </FlexRow>
        </CodeSplit>

        <CodeSplit>
            #### Pad

            <FlexRow pad spacing wrap style="background:#eee;border:1px solid lightgray;">
                <Repeater records={Array.from({length: 20})}>
                    <div style="width: 30px; height: 30px; background: lightgray;" />
                </Repeater>
            </FlexRow>

        </CodeSplit>

        <CodeSplit>
            #### Mixed Mode (`hpad`, `vpad`, `hspacing`, `vspacing`)

            <FlexRow pad hspacing="xsmall" vspacing="xlarge" wrap
                     style="background:#eee;border:1px solid lightgray;">
                <Repeater records={Array.from({length: 40})}>
                    <div style="width: 30px; height: 30px; background: lightgray;" />
                </Repeater>
            </FlexRow>

            <Content name="code">
                <Tab value-bind="$page.code2.tab" mod="code" tab="wrap" text="Mixed" default/>
                <Tab value-bind="$page.code2.tab" mod="code" tab="targets" text="Targets" default/>
                <CodeSnippet visible-expr="{$page.code2.tab}=='wrap'" fiddle="NhTe1hyS">{`
                    <FlexRow pad hspacing="xsmall" vspacing="xlarge" wrap style="background:#eee;border:1px solid lightgray;">
                        <Repeater records={Array.from({length: 40})}>
                            <div style="width: 30px; height: 30px; background: lightgray;" />
                        </Repeater>
                    </FlexRow>
                `}</CodeSnippet>

            <CodeSnippet visible-expr="{$page.code2.tab}=='targets'" fiddle="NhTe1hyS">{`
                <FlexRow spacing target="desktop">
                    <div style="flex: 1; height: 30px; background: lightgray;" />
                    <div style="flex: 1; height: 30px; background: lightgray;" />
                    <div style="flex: 1; height: 30px; background: lightgray;" />
                </FlexRow>

                <FlexRow spacing target="tablet">
                    <div style="flex: 1; height: 30px; background: lightgray;" />
                    <div style="flex: 1; height: 30px; background: lightgray;" />
                </FlexRow>
            `}</CodeSnippet>
            </Content>

        </CodeSplit>

        <CodeSplit>
            #### `target="desktop"`

            This will break into multiple rows on screens smaller than desktop, e.g. tablets and phones.

            <FlexRow spacing target="desktop">
                <div style="flex: 1; height: 30px; background: lightgray;" />
                <div style="flex: 1; height: 30px; background: lightgray;" />
                <div style="flex: 1; height: 30px; background: lightgray;" />
            </FlexRow>
        </CodeSplit>

        <CodeSplit>
            #### `target="tablet"`

            This will break into multiple rows on phones, but will remain in one line
            on desktop screens.

            <FlexRow spacing target="tablet">
                <div style="flex: 1; height: 30px; background: lightgray;" />
                <div style="flex: 1; height: 30px; background: lightgray;" />
            </FlexRow>
        </CodeSplit>

        ### Notes

        > Please note that CSS based layouts should be preferred to FlexBox for more complex arrangements.

        > `spacing` option sets a negative margin which may cause unexpected behaviour in some scenarios.

        > `FlexRow = FlexBox + direction="row"`

        > `FlexCol = FlexBox + direction="column"`
        

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>
