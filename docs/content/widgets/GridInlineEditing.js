import { Content, Controller } from 'cx/ui';
import { Checkbox, Grid, TextField } from 'cx/widgets';
import { CodeSnippet } from '../../components/CodeSnippet';
import { CodeSplit } from '../../components/CodeSplit';
import { Md } from '../../components/Md';
import { casual } from '../examples/data/casual';

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

export const GridInlineEditing = <cx>
    <Md controller={PageController}>
        <CodeSplit>
            # Grid with Inline Editing

            Grid supports arbitrary content inside its cells. Any widget or even a chart can be put inside it.

            <Grid
                records:bind='$page.records'
                style={{width: "100%"}}
                columns={[
                    {
                        header: 'Name',
                        field: 'fullName',
                        sortable: true,
                        style: 'border:none',
                        items: <cx>
                            <TextField value:bind="$record.fullName" style={{width: '100%'}}/>
                        </cx>
                    }, {
                        header: 'Phone',
                        field: 'phone',
                        style: 'border:none',
                        items: <cx>
                            <TextField value:bind="$record.phone" style={{width: '100%'}}/>
                        </cx>
                    }, {
                        header: 'City',
                        field: 'city',
                        style: 'border:none',
                        sortable: true,
                        items: <cx>
                            <TextField value:bind="$record.city" style={{width: '100%'}}/>
                        </cx>
                    }, {
                        header: 'Notified',
                        field: 'notified',
                        style: 'border:none',
                        sortable: true,
                        align: 'center',
                        pad: false,
                        items: <cx>
                            <Checkbox value:bind="$record.notified"/>
                        </cx>
                    }
                ]}
            />

            <Content name="code">
                <CodeSnippet fiddle="wK09BHnM">{`
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
                ...
                <Grid
                    records:bind='$page.records'
                    style={{width: "100%"}}
                    columns={[
                        {
                            header: 'Name',
                            field: 'fullName',
                            sortable: true,
                            style: 'border:none',
                            items: <cx>
                                <TextField value:bind="$record.fullName" style={{width: '100%'}}/>
                            </cx>
                        }, {
                            header: 'Phone',
                            field: 'phone',
                            style: 'border:none',
                            items: <cx>
                                <TextField value:bind="$record.phone" style={{width: '100%'}}/>
                            </cx>
                        }, {
                            header: 'City',
                            field: 'city',
                            style: 'border:none',
                            sortable: true,
                            items: <cx>
                                <TextField value:bind="$record.city" style={{width: '100%'}}/>
                            </cx>
                        }, {
                            header: 'Notified',
                            field: 'notified',
                            style: 'border:none',
                            sortable: true,
                            align: 'center',
                            pad: false,
                            items: <cx>
                                <Checkbox value:bind="$record.notified"/>
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
