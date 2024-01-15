import { Md } from '../../components/Md';
import { ImportPath } from '../../components/ImportPath';
import { CodeSplit } from '../../components/CodeSplit';
import { Content, Tab } from 'cx/widgets';
import { CodeSnippet } from '../../components/CodeSnippet';
import { ConfigTable } from '../../components/ConfigTable';
import { Controller, bind } from 'cx/ui';
import { Text, Rescope, FlexCol } from 'cx/widgets';
import configs from '../widgets/configs/Rescope';

import { enableFatArrowExpansion } from "cx/data";
enableFatArrowExpansion();

class PageController extends Controller {
    onInit() {
        this.store.set("$page.company.address", "Company Address 1AB");

        this.store.set("$page.company.specificTeam", {
            manager: {
                name: "John Doe",
                yoe: 18
            },
            size: 10
        });
    }
}

export const RescopePage = <cx>
    <div controller={PageController}>
        <Md>
            # Rescope
            <ImportPath path="import { Rescope } from 'cx/ui';" />

            <CodeSplit>
                The `Rescope` widget enables shorter data binding paths by selecting a common prefix.

                <div class="widgets">
                    <Rescope bind="$page.company.specificTeam">
                        <Text tpl="{manager.name} ({manager.yoe} years of work experience)" />
                        <br/>
                        <Text tpl="- Leading the team of {size} people" />
                    </Rescope>
                </div>

                <Content name="code">
                    <Tab value-bind="$page.code1.tab" mod="code" tab="controller" text="Controller" />
                    <Tab value-bind="$page.code1.tab" mod="code" tab="code" text="Rescope" default />
                    <CodeSnippet visible-expr="{$page.code1.tab}=='controller'" fiddle="n0lhN7Xt">{`
                        this.store.set("company.specificTeam", {
                            manager: {
                              name: "John Doe",
                              yoe: 18
                            },
                            size: 10
                        });
                    `}</CodeSnippet>
                    <CodeSnippet visible-expr="{$page.code1.tab}=='code'" fiddle="n0lhN7Xt">{`
                        <Rescope bind="company.specificTeam">
                            <Text tpl="{manager.name} ({manager.yoe} years of work experience)" />
                            <br />
                            <Text tpl="- Leading the team of {size} people" />
                        </Rescope>
                    `}</CodeSnippet>
                </Content>
            </CodeSplit>

            Within the scope, outside data may be accessed by using the `$root.` prefix. For example,
            `manager` and `$root.company.specificTeam.manager` point to the same object.

            <CodeSplit>
                ### Data property

                Rescope's `data` property allows access to the outside data without having to use
                the `$root.` prefix.

                <div class="widgets">
                    <FlexCol>
                        <Rescope
                            bind="$page.company.specificTeam"
                            data={{ address: bind("$page.company.address") }}
                        >
                            <Text tpl="{address}" />
                            <div>
                                <hr />
                            </div>
                            <Text tpl="{manager.name} ({manager.yoe} years of work experience)" />
                            <br />
                            <Text tpl="- Leading the team of {size} people" />
                        </Rescope>
                    </FlexCol>
                </div>

                <Content name="code">
                    <Tab value-bind="$page.code2.tab" mod="code" tab="controller" text="Controller" />
                    <Tab value-bind="$page.code2.tab" mod="code" tab="code" text="Rescope with data property" default />
                    <CodeSnippet visible-expr="{$page.code2.tab}=='controller'" fiddle="lPu5dqRM">{`
                        onInit() {
                            this.store.set("company.address", "Company Address 1AB");
                            this.store.set("company.specificTeam", {
                              manager: {
                                name: "John Doe",
                                yoe: 18
                              },
                              size: 10
                            });
                        }
                    `}</CodeSnippet>
                    <CodeSnippet visible-expr="{$page.code2.tab}=='code'" fiddle="lPu5dqRM">{`
                        <Rescope
                            bind="company.specificTeam"
                            data={{ address: bind("company.address") }}
                        >
                            <Text tpl="{address}" />
                            <hr />
                            <Text tpl="{manager.name} ({manager.yoe} years of work experience)" />
                            <br />
                            <Text tpl="- Leading the team of {size} people" />
                        </Rescope>
                    `}</CodeSnippet>
                </Content>
            </CodeSplit>

            ### Configuration
            <ConfigTable props={configs} />
        </Md>
    </div>
</cx>
