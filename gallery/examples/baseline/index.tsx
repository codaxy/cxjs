import {cx, Section, FlexRow, Button, TextField, Menu, Submenu, Checkbox, Switch} from 'cx/widgets';
import {bind} from 'cx/ui';

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/examples/baseline/index.tsx" target="_blank" putInto="github">Source Code</a>
    <Section mod="well" ws style="min-width: 918px;">
        <p>
            All widgets respect the baseline.
        </p>

        <Checkbox value={bind("check")} />
        &nbsp;
        <TextField value={bind("text")} placeholder="TextField"/>
        &nbsp;
        <Button mod="hollow" icon="search" />
        &nbsp;
        <Button mod="hollow">Hollow Button</Button>
        &nbsp;
        <Button>Regular Button</Button>
        &nbsp;
        <span style={{"margin-left": "10px"}}>Span of text</span>
        &nbsp;
        <Menu horizontal style="display:inline-block">
            <Submenu arrow>
                Dropdown
                <Menu putInto="dropdown">
                    <a href="#">Item1</a>
                    <a href="#">Item2</a>
                </Menu>
            </Submenu>
        </Menu>
        &nbsp;
        <Checkbox value={bind("check")}>Check</Checkbox>
        &nbsp;
        <Switch on={bind("check")} />
    </Section>
</cx>

import {hmr} from '../../routes/hmr.js';
hmr(module);