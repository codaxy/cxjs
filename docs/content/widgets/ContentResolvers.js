import {HtmlElement, ContentResolver, Select, Repeater, TextField, DateField, Checkbox, Switch, Content, Tab} from 'cx/widgets';
import {Controller} from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';


import configs from './configs/ContentResolver';

class PageController extends Controller {
    onInit() {
        this.store.init('$page.items', [{
            type: 'textfield'
        }, {
            type: 'datefield'
        }, {
            type: 'checkbox'
        }, {
            type: 'switch'
        }])
    }
}

export const ContentResolvers = <cx>
    <Md>
        <CodeSplit>

            # ContentResolver

            <ImportPath path="import {ContentResolver} from 'cx/widgets';"/>

            `ContentResolver` is used when the contents that needs to be displayed is unknown at build time, depends on
            the data or needs to be lazy
            loaded.

            <div class="widgets">
                <table controller={PageController}>
                    <tbody>
                    <Repeater records:bind="$page.items">
                        <tr>
                            <td>
                                <Select value:bind="$record.type" style="width: 120px">
                                    <option value="textfield">TextField</option>
                                    <option value="datefield">DateField</option>
                                    <option value="checkbox">Checkbox</option>
                                    <option value="switch">Switch</option>
                                </Select>
                            </td>
                            <td>
                                <ContentResolver
                                    params:bind="$record.type"
                                    onResolve={type => {
                                        switch (type) {
                                            case 'textfield':
                                                return <cx><TextField value:bind="$record.text"/></cx>;

                                            case 'datefield':
                                                return <cx><DateField value:bind="$record.date"/></cx>;

                                            case 'checkbox':
                                                return <cx><Checkbox value:bind="$record.checked"/></cx>;

                                            case 'switch':
                                                return <cx><Switch value:bind="$record.checked"/></cx>;

                                            default:
                                                return null;
                                        }
                                    }}
                                />
                            </td>
                        </tr>
                    </Repeater>
                    </tbody>
                </table>
            </div>
            
            <Content name="code">
                <div>
                    <Tab value-bind="$page.code.tab" tab="controller" mod="code"><code>Controller</code></Tab>
                    <Tab value-bind="$page.code.tab" tab="code" mod="code" default><code>Code</code></Tab>
                </div>
                <CodeSnippet fiddle="RcY5ebiO" visible-expr="{$page.code.tab}=='controller'">{`
                    class PageController extends Controller {
                        onInit() {
                            this.store.init('$page.items', [{
                                type: 'textfield'
                            }, {
                                type: 'datefield'
                            }, {
                                type: 'checkbox'
                            }, {
                                type: 'switch'
                            }])
                        }                    
                    }
                `}</CodeSnippet>
                <CodeSnippet fiddle="RcY5ebiO" visible-expr="{$page.code.tab}=='code'">{`
                    <table controller={PageController}>
                        <tbody>
                            <Repeater records:bind="$page.items">
                                <tr>
                                    <td>
                                        <Select value:bind="$record.type" style="width: 120px">
                                            <option value="textfield">TextField</option>
                                            <option value="datefield">DateField</option>
                                            <option value="checkbox">Checkbox</option>
                                            <option value="switch">Switch</option>
                                        </Select>
                                    </td>
                                    <td>
                                        <ContentResolver
                                            params:bind="$record.type"
                                            onResolve={type => {
                                                switch (type) {
                                                    case 'textfield':
                                                        return <cx><TextField value:bind="$record.text"/></cx>;
        
                                                    case 'datefield':
                                                        return <cx><DateField value:bind="$record.date"/></cx>;
        
                                                    case 'checkbox':
                                                        return <cx><Checkbox value:bind="$record.checked"/></cx>;
        
                                                    case 'switch':
                                                        return <cx><Switch value:bind="$record.checked"/></cx>;
        
                                                    default:
                                                        return null;
                                                }
                                            }}
                                        />
                                    </td>
                                </tr>
                            </Repeater>
                        </tbody>
                    </table>
                `}</CodeSnippet>
            </Content>
            
        </CodeSplit>

        ## Configuration

        <ConfigTable props={{...configs, mod: false}}/>

    </Md>
</cx>

