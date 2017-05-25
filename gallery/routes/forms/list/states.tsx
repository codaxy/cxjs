
import {cx, Section, FlexRow, List, Text} from 'cx/widgets';
import {bind, tpl, Controller, KeySelection} from 'cx/ui';
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
           multiple: multiple
        }}
        grouping={grouping && {
            key: {
                firstLetter: {expr: '{$record.id} % 2 == 0'}
            },
            aggregates: {
                count: {
                    type: 'count',
                    value: 1
                }
            },
            header: <div style={{ paddingTop: '25px' }} >
                <strong text={bind("$group.firstLetter")} />
            </div>,
            footer: <strong text={tpl("{$group.count} item(s)")} />
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