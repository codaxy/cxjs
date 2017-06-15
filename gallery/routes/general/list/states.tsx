import {cx, Section, FlexRow, List, Text} from 'cx/widgets';
import {bind, tpl, expr, Controller, KeySelection} from 'cx/ui';
import casual from '../../../util/casual';
import '../../../util/plural';

class PageController extends Controller {
    init() {
        this.store.init('records', Array.from({length: 7}).map((v, i) => {
            let firstName = casual.first_name;
            let lastName = casual.last_name;
            return {
                id: i + 1,
                firstName,
                lastName,
                fullName: firstName + ' ' + lastName
            }
        }));

        this.store.init('records2', Array.from({length: 77}).map((v, i) => {
            let firstName = casual.first_name;
            let lastName = casual.last_name;
            return {
                id: i + 1,
                firstName,
                lastName,
                fullName: firstName + ' ' + lastName
            }
        }));
    }
}

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/general/list/states.tsx" target="_blank" putInto="github">Source Code</a>
    <FlexRow wrap spacing="large" target="tablet" align="start" controller={PageController}>
        <Section mod="well" title="Standard" hLevel={4}>
            <List
                records={bind('records')}
                style={{minWidth: '200px'}}
                selection={{
                    type: KeySelection,
                    bind: "s1",
                    keyField: 'id'
                }}
            >
                <span text={bind("$record.fullName")}/>
            </List>
        </Section>

        <Section mod="well" title="Bordered" hLevel={4}>
            <List
                records={bind('records')}
                mod="bordered"
                style={{minWidth: '200px'}}
                selection={{
                    type: KeySelection,
                    bind: "s2",
                    keyField: 'id'
                }}
            >
                <span text={bind("$record.fullName")}/>
            </List>
        </Section>

        <Section mod="well" title="Multiple Selection" hLevel={4}>
            <List
                records={bind('records')}
                style={{minWidth: '200px'}}
                selection={{
                    type: KeySelection,
                    bind: "s3",
                    keyField: 'id',
                    multiple: true
                }}
            >
                <span text={bind("$record.fullName")}/>
            </List>
        </Section>

        <Section mod="well" title="Grouped" hLevel={4}>
            <List
                records={bind('records2')}
                style={{minWidth: '200px', height: '400px'}}
                emptyText="Nothing found."
                selection={{
                    type: KeySelection,
                    bind: "s4",
                    keyField: 'id'
                }}
                grouping={{
                    key: {
                        firstLetter: {expr: '{$record.lastName}[0]'}
                    },
                    aggregates: {
                        count: {
                            type: 'count',
                            value: 1
                        }
                    },
                    header: <div style={{marginTop: '5px'}}>
                        <strong text={tpl("{$group.firstLetter}")}/>
                    </div>,
                    footer: <div style={{marginBottom: '15px'}}>
                        <i text={tpl("{$group.count} {$group.count:plural;person}")}/>
                    </div>
                }}
            >
                <span text={tpl("{$record.lastName}, {$record.firstName}")}/>
            </List>
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);