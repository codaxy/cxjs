import {cx, Section, FlexRow, Button, TextField, Menu, Submenu} from 'cx/widgets';
import {bind} from 'cx/ui';

export default <cx>
    <Section mod="well" ws>
        <p>
            All widgets should respect the baseline.
        </p>
        <TextField value={bind("text")} placeholder="TextField"/>
        &nbsp;
        <Button mod="hollow" icon="search" />
        &nbsp;
        <Button mod="hollow">Hollow Button</Button>
        &nbsp;
        <Button>Regular Button</Button>
        &nbsp;
        <Menu horizontal style="display:inline-block">
            <Submenu>
                <a>Menu1</a>
            </Submenu>
            <Submenu>
                <a>Menu2</a>
            </Submenu>
        </Menu>
    </Section>
</cx>

import {hmr} from '../../routes/hmr.js';
declare let module: any;
hmr(module);