import {cx, Button, Section, FlexRow, Tab} from 'cx/widgets';
import { bind, expr } from 'cx/ui';

export default <cx>
    <h2 putInto="header">
        Grid
    </h2>

    <div putInto="tabs">
        <Tab mod="line" value={bind("tab")} tab="1">Tab 1</Tab>
        <Tab mod="line" value={bind("tab")} tab="2">Tab 2</Tab>
        <Tab mod="line" value={bind("tab")} tab="3">Tab 3</Tab>
        <Tab mod="line" value={bind("tab")} tab="4" visible={expr("{theme}=='material'")}>Tab 4</Tab>
    </div>

    <Section mod="well" visible={expr("{tab}=='1'")}>
        Grid 1
    </Section>

    <Section mod="well" visible={expr("{tab}=='2'")}>
        Grid 2
    </Section>

    <Section mod="well" visible={expr("{tab}=='3'")}>
        Grid 3
    </Section>
</cx>
