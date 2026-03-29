import {HtmlElement, TextField, Checkbox, Grid, Tab} from 'cx/widgets';
import {Content, Controller} from 'cx/ui';
import {Md} from '../../../components/Md';
import {CodeSplit} from '../../../components/CodeSplit';
import {CodeSnippet} from '../../../components/CodeSnippet';

import {casual} from '../data/casual';

class PageController extends Controller {
    init() {
        super.init();

        this.store.set('$page.records', Array.from({length: 20}).map((v, i) => ({
            id: i + 1,
            fullName: casual.full_name,
            phone: casual.phone,
            city: casual.city,
            notified: casual.coin_flip
        })));
    }
}

export const InlineEdit = <cx>
    <Md controller={PageController}>
        <CodeSplit>
            # Grid with Inline Editing

            Grid supports arbitrary content inside its cells. Any widget or even a chart can be put inside it.

            <Grid
                records-bind='$page.records'
                style={{width: "100%"}}
                columns={[
                    {
                        header: 'Name',
                        field: 'fullName',
                        sortable: true,
                        style: 'border:none',
                        items: <cx>
                            <TextField value-bind="$record.fullName" style={{width: '100%'}}/>
                        </cx>
                    }, {
                        header: 'Phone',
                        field: 'phone',
                        style: 'border:none',
                        items: <cx>
                            <TextField value-bind="$record.phone" style={{width: '100%'}}/>
                        </cx>
                    }, {
                        header: 'City',
                        field: 'city',
                        style: 'border:none',
                        sortable: true,
                        items: <cx>
                            <TextField value-bind="$record.city" style={{width: '100%'}}/>
                        </cx>
                    }, {
                        header: 'Notified',
                        field: 'notified',
                        style: 'border:none',
                        sortable: true,
                        align: 'center',
                        pad: false,
                        items: <cx>
                            <Checkbox value-bind="$record.notified"/>
                        </cx>
                    }
                ]}
            />

            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="controller" text="Controller" default/>
                <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default/>

                <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="wK09BHnM">{`
                class PageController extends Controller {
                    init() {
                        super.init();

                        this.store.set('$page.records', Array.from({length: 20}).map((v, i)=>({
                            id: i+1,
                            fullName: casual.full_name,
                            phone: casual.phone,
                            city: casual.city,
                            notified: casual.coin_flip
                        })));
                    }
                }
            `}
                </CodeSnippet>
                <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="wK09BHnM">{`
                <Grid
                    records-bind='$page.records'
                    style={{width: "100%"}}
                    columns={[
                        {
                            header: 'Name',
                            field: 'fullName',
                            sortable: true,
                            style: 'border:none',
                            items: <cx>
                                <TextField value-bind="$record.fullName" style={{width: '100%'}}/>
                            </cx>
                        }, {
                            header: 'Phone',
                            field: 'phone',
                            style: 'border:none',
                            items: <cx>
                                <TextField value-bind="$record.phone" style={{width: '100%'}}/>
                            </cx>
                        }, {
                            header: 'City',
                            field: 'city',
                            style: 'border:none',
                            sortable: true,
                            items: <cx>
                                <TextField value-bind="$record.city" style={{width: '100%'}}/>
                            </cx>
                        }, {
                            header: 'Notified',
                            field: 'notified',
                            style: 'border:none',
                            sortable: true,
                            align: 'center',
                            pad: false,
                            items: <cx>
                                <Checkbox value-bind="$record.notified"/>
                            </cx>
                        }
                    ]}
                />
            `}
                </CodeSnippet>
            </Content>

        </CodeSplit>

    </Md>
</cx>
