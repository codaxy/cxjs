
import {cx, Section, FlexRow, List, Text} from 'cx/widgets';
import {bind, tpl, expr, Controller, KeySelection} from 'cx/ui';
import casual from '../../../util/casual';

class PageController extends Controller {
    init() {
        this.store.init('records', Array.from({length: 15}).map((v, i) => {
            var name = casual.full_name;
            return {
                id: i + 1,
                fullName: name
            }
        }));
    }
}

const generateList = ({mod, grouping=false, multiple=false}) => <cx>
    <List
        records={bind('records')}
        style={{ width: '200px' }}
        emptyText="Nothing found."
        selection={{
           type: KeySelection,
           bind: mod,
           keyField: 'id',
           multiple
        }}
        grouping={grouping && {
            key: {
                index: {expr: '{$record.id} % 3 + 1'}
            },
            aggregates: {
                count: {
                    type: 'count',
                    value: 1
                }
            },
            header: <div style={{ paddingTop: '25px' }} >
                <strong text={tpl("Group {$group.index}")} />
            </div>,
            footer: <strong text={tpl("{$group.count} people")} />
        }}
    >   
        <span text={bind("$record.fullName")}></span>
    </List>
</cx>


export default <cx>
    <FlexRow wrap spacing="large" target="desktop" controller={PageController}>
        <Section mod="well" title="Standard" hLevel={4} >
            {generateList({mod: "standard"})}
        </Section>
        <Section mod="well" title="Grouped" hLevel={4} >
            {generateList({mod: "grouped", grouping: true})}
        </Section>
        <Section mod="well" title="Multiple selection" hLevel={4} >
            {generateList({mod: "multiple", multiple: true})}
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
declare let module: any;
hmr(module);