import {HtmlElement, Checkbox, Grid, List, Tab} from 'cx/widgets';
import {Content, Controller, KeySelection} from 'cx/ui';
import {Md} from '../../../components/Md';
import {CodeSplit} from '../../../components/CodeSplit';
import {CodeSnippet} from '../../../components/CodeSnippet';

import {casual} from '../data/casual';

class PageController extends Controller {
    init() {
        this.store.init('$page.records', Array.from({length: 20}).map((v, i) => {
            var name = casual.full_name;
            return {
                id: i + 1,
                fullName: name,
                phone: casual.phone,
                city: casual.city,
                email: name.toLowerCase().replace(' ', '.') + "@example.com",
                country: casual.country
            }
        }));
    }
}

export const Grouping = <cx>
    <Md controller={PageController}>

        # Grouping in Lists

        <CodeSplit>

            List control supports grouping.

            <List
                records-bind='$page.records'
                selection={{
                    type: KeySelection,
                    bind: '$page.selection'
                }}
                grouping={{
                    key: {
                        firstLetter: {expr: '{$record.fullName}[0]'}
                    },
                    aggregates: {
                        count: {
                            type: 'count',
                            value: 1
                        }
                    },
                    header: <div style="padding-top: 25px" >
                        <strong text-bind="$group.firstLetter"/>
                    </div>,
                    footer: <strong text-tpl="{$group.count} item(s)"/>
                }}
            >
                <strong text-bind="$record.fullName"></strong>
                <br/>
                Phone: <span text-bind="$record.phone" />
                <br/>
                City: <span text-bind="$record.city" />
            </List>

            <Content name="code">
                <Tab value-bind="$page.code.tab" tab="controller" mod="code" text="Controller" />
                <Tab value-bind="$page.code.tab" tab="list" mod="code" text="List" default/>
                <CodeSnippet visible-expr="{$page.code.tab}=='controller'"  fiddle="LHlJu3zb">{`
                    class PageController extends Controller {
                        init() {
                            this.store.init('$page.records', Array.from({length: 20}).map((v, i) => {
                                var name = casual.full_name;
                                return {
                                    id: i + 1,
                                    fullName: name,
                                    phone: casual.phone,
                                    city: casual.city,
                                    email: name.toLowerCase().replace(' ', '.') + "@example.com",
                                    country: casual.country
                                }
                            }));
                        }
                    }
            `}</CodeSnippet>
             <CodeSnippet visible-expr="{$page.code.tab}=='list'"  fiddle="LHlJu3zb">{`
                <List
                    records-bind='$page.records'
                    selection={{
                        type: KeySelection,
                        bind: '$page.selection'
                    }}
                    grouping={{
                        key: {
                            firstLetter: {expr: '{$record.fullName}[0]'}
                        },
                        aggregates: {
                            count: {
                                type: 'count',
                                value: 1
                            }
                        },
                        header: <div style="padding-top: 25px" >
                            <strong text-bind="$group.firstLetter"/>
                        </div>,
                        footer: <strong text-tpl="{$group.count} item(s)"/>
                    }}
                >
                    <strong text-bind="$record.fullName"></strong>
                    <br/>
                    Phone: <span text-bind="$record.phone" />
                    <br/>
                    City: <span text-bind="$record.city" />
                </List>
            `}</CodeSnippet>
            </Content>
        </CodeSplit>
    </Md>
</cx>
