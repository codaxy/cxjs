import { HtmlElement, Checkbox, Grid, Tab } from 'cx/widgets';
import { Content, Controller, PropertySelection } from 'cx/ui';
import {Md} from '../../../components/Md';
import {CodeSplit} from '../../../components/CodeSplit';
import {CodeSnippet} from '../../../components/CodeSnippet';

import {casual} from '../data/casual';

class PageController extends Controller {
    init() {
        super.init();

        this.store.set('$page.records', Array.from({length: 20}).map((v, i) => {
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

export const ComplexHeaders = <cx>
    <Md controller={PageController}>

        # Grid with Complex Header

        <CodeSplit>

            Grid control supports up to three header lines. Header cells can be merged using `colSpan` and `rowSpan`
            attributes, similar to how tables work in HTML.

            <Grid
                records-bind='$page.records'
                style={{width: "100%"}}
                border
                vlines
                columns={[
                    {
                        header1: {
                            text: 'Name',
                            rowSpan: 2
                        },
                        field: 'fullName',
                        sortable: true
                    }, {
                        align: 'center',
                        header1: {
                            text: 'Contact',
                            colSpan: 2
                        },
                        header2: 'Phone',
                        style: "white-space: nowrap",
                        field: 'phone'
                    }, {
                        header2: 'Email',
                        style: "font-size: 10px",
                        field: 'email',
                        sortable: true,
                        align: 'center'
                    }, {
                        header1: {
                            text: 'Address',
                            colSpan: 2,
                            align: 'center',
                            allowSorting: false
                        },
                        header2: 'City',
                        field: 'city',
                        sortable: true
                    }, {
                        header2: 'Country',
                        field: 'country',
                        sortable: true
                    },
                ]}
                sorters-bind="$page.sorters"
            />
            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="controller" text="Controller"/>
                <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default/>
                
                <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="Qq5LHNJc">{`
                    class PageController extends Controller {
                        init() {
                            super.init();

                            this.store.set('$page.records', Array.from({length: 20}).map((v, i) => {
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
                    };
                    `}</CodeSnippet>
                <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="Qq5LHNJc">{`
                    <Grid records-bind='$page.records'
                        style={{width: "100%"}}
                        columns={[
                            {
                                header1: {
                                    text: 'Name',
                                    rowSpan: 2
                                },
                                field: 'fullName',
                                sortable: true
                            }, {
                                align: 'center',
                                header1: {
                                    text: 'Contact',
                                    colSpan: 2
                                },
                                header2: 'Phone',
                                style: "white-space: nowrap",
                                field: 'phone'
                            }, {
                                header2: 'Email',
                                style: "font-size: 10px",
                                field: 'email',
                                sortable: true,
                                align: 'center'
                            }, {
                                header1: {
                                    text: 'Address',
                                    colSpan: 2,
                                    align: 'center',
                                    allowSorting: false
                                },
                                header2: 'City',
                                field: 'city',
                                sortable: true
                            }, {
                                header2: 'Country',
                                field: 'country',
                                sortable: true
                            },
                        ]}
                        sorters-bind="$page.sorters"
                    />
                    `}</CodeSnippet>
            </Content>
        </CodeSplit>

    </Md>
</cx>
