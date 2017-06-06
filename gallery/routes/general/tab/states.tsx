import {cx, Section, FlexRow, Tab} from 'cx/widgets';
import {bind, expr} from 'cx/ui';

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/general/tab/states.tsx" target="_blank" putInto="github">GitHub</a>
    <FlexRow wrap spacing="large" target="desktop">
        <Section mod="well" title="Standard" hLevel={4} style="max-width: 400px">
            <p>
                <Tab tab="tab1" value={bind("$page.t1")} default>Tab 1</Tab>
                <Tab tab="tab2" value={bind("$page.t1")}>Tab 2</Tab>
                <Tab tab="tab3" value={bind("$page.t1")}>Tab 3</Tab>
                <Tab tab="tab4" value={bind("$page.t1")} disabled>Tab 4</Tab>
            </p>

            <div>
                <p visible={expr("{$page.t1}=='tab1'")}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut aliquet cursus diam. Proin ultricies congue vehicula. In at felis id.</p>
                <p visible={expr("{$page.t1}=='tab2'")}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex magna, maximus in venenatis at, iaculis eu augue. Vestibulum id.</p>
                <p visible={expr("{$page.t1}=='tab3'")}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dolor arcu, hendrerit ultrasonic cursus eget, efficitur quis erat. Donec dui.</p>
                <p visible={expr("{$page.t1}=='tab4'")}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi porta ultricies arcu nec auctor. Nullam felis nibh, accumsan a ultrices.</p>
            </div>

        </Section>
        <Section mod="well" title="Line Tabs" hLevel={4} style="max-width: 400px">
            <p>
                <Tab tab="tab1" value={bind("$page.t2")} mod="line" default>Tab 1</Tab>
                <Tab tab="tab2" value={bind("$page.t2")} mod="line">Tab 2</Tab>
                <Tab tab="tab3" value={bind("$page.t2")} mod="line">Tab 3</Tab>
                <Tab tab="tab4" value={bind("$page.t2")} mod="line" disabled>Tab 4</Tab>
            </p>

            <div>
                <p visible={expr("{$page.t2}=='tab1'")}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut aliquet cursus diam. Proin ultricies congue vehicula. In at felis id.</p>
                <p visible={expr("{$page.t2}=='tab2'")}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex magna, maximus in venenatis at, iaculis eu augue. Vestibulum id.</p>
                <p visible={expr("{$page.t2}=='tab3'")}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dolor arcu, hendrerit ultrasonic cursus eget, efficitur quis erat. Donec dui.</p>
                <p visible={expr("{$page.t2}=='tab4'")}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi porta ultricies arcu nec auctor. Nullam felis nibh, accumsan a ultrices.</p>
            </div>
        </Section>
        <Section
            mod="well"
            title="Classic"
            hLevel={4}
            style="max-width: 400px"
            visible={expr("{$root.$route.theme}!='material'")}
        >
            <div styles="padding-left:10px;white-space:nowrap;">
                <Tab tab="tab1" value={bind("$page.t3")} mod="classic" default>Tab 1</Tab>
                <Tab tab="tab2" value={bind("$page.t3")} mod="classic">Tab 2</Tab>
                <Tab tab="tab3" value={bind("$page.t3")} mod="classic">Tab 3</Tab>
                <Tab tab="tab4" value={bind("$page.t3")} mod="classic" disabled>Tab 4</Tab>
            </div>
            <div mod="cover" styles="border-width: 1px; padding: 20px">
                <p visible={expr("{$page.t2}=='tab1'")}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut aliquet cursus diam. Proin ultricies congue vehicula. In at felis id.</p>
                <p visible={expr("{$page.t2}=='tab2'")}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex magna, maximus in venenatis at, iaculis eu augue. Vestibulum id.</p>
                <p visible={expr("{$page.t2}=='tab3'")}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dolor arcu, hendrerit ultrasonic cursus eget, efficitur quis erat. Donec dui.</p>
                <p visible={expr("{$page.t2}=='tab4'")}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi porta ultricies arcu nec auctor. Nullam felis nibh, accumsan a ultrices.</p>
            </div>
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);