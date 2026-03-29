import { TextField, Link, Content, Tab, FlexRow } from 'cx/widgets';
import { Rescope } from 'cx/ui';
import { Md } from '../../components/Md';
import { CodeSplit } from '../../components/CodeSplit';
import { CodeSnippet } from '../../components/CodeSnippet';

export const Welcome = <cx>
    <Rescope bind="$page">
        <Md>
            # Welcome to CxJS

            CxJS is a modern framework that helps you create web applications that are both data-oriented and
            visually appealing.

            CxJS makes application development easy by providing a complete set of widgets and charts combined with JSX
            syntax and declarative data-binding.

            CxJS solves problems with a unified approach, unlike other frameworks which solve one UI problem at a
            time.
            CxJS simplifies development of complex user interfaces which requires components from many different
            sources.
            CxJS package includes:
            <FlexRow spacing="xlarge">
                <Md>
                    * Form components
                    * Form validation
                    * Grid (data-table) control
                    * Charts
                    * Navigational elements
                    * Tooltips
                    * Modal windows
                    * Overlays
                </Md>
                <Md>
                    * Powerful data-binding
                    * State management
                    * Client-side routing
                    * Complex layouts
                    * Theming support
                    * Culture dependent formatting
                    * and more
                </Md>
            </FlexRow>

            CxJS helps developers and their development teams create business applications of any size with ease by
            reducing the complications of UI and browser faults.

            <CodeSplit>
                Our start guide will show you the most important concepts and propel you on the right track to be
                an effective CxJS developer. Fill out your name below to get started with CxJS.

                <div class="widgets">
                    <div ws style="width: 300px">
                        <h2>Welcome!</h2>
                        <p style="margin-bottom: 0;">What is your name?</p>
                        <TextField value-bind="$page.name" />
                        <div visible-expr="!!{$page.name}">
                            <p>
                                Hello <strong text-tpl="{$page.name}" />!
                            </p>
                            <p ws>
                                Please visit our
                                <Link href="~/intro/getting-started">Getting Started</Link>
                                page to learn more about CxJS.
                            </p>
                        </div>
                    </div>
                </div>

                <Content name="code">
                    <Tab value-bind="code1.tab" mod="code" tab="code" text="Code" default />
                    <CodeSnippet visible-expr="{code1.tab}=='code'">{`
                        <h2>Welcome!</h2>
                        <p>
                            What is your name? <TextField value-bind="$page.name"/>
                        </p>
                        <div visible-expr="!!{$page.name}">
                            <p>
                                Hello <strong text-tpl="{$page.name}"/>!
                            </p>
                            <p ws>
                                Please visit our
                                <Link href="~/intro/getting-started">Getting Started</Link>
                                page to learn more about CxJS.
                            </p>
                        </div>
                    `}</CodeSnippet>
                </Content>
            </CodeSplit>
        </Md>
    </Rescope>
</cx>
