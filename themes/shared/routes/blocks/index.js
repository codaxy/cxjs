import {HtmlElement} from 'cx/ui/HtmlElement';
import {Button} from 'cx/ui/Button';
import {Tab} from 'cx/ui/nav/Tab';
import {Section} from 'cx/ui/Section';
import {FlexRow} from 'cx/ui/layout/FlexBox';

const TabContent = <cx>
   <div visible:expr="{$page.tab}=='tab1'">
      Curabitur et nisi quis arcu tempus hendrerit. Donec pharetra, leo sit amet porttitor convallis, elit urna
      mattis enim, a viverra orci magna eget odio. Mauris aliquet viverra magna, a dictum risus facilisis ut.
      Quisque convallis diam ut varius fringilla. Donec vestibulum ligula ex, vitae ultrices diam sollicitudin in.
      Quisque at dolor erat. Nullam non purus ac purus porttitor egestas. Suspendisse molestie mi a pharetra
      sodales. Sed eu mi in nunc cursus molestie a ut leo.
   </div>

   <div visible:expr="{$page.tab}=='tab2'">
      Proin arcu odio, malesuada a tempus eu, maximus non nulla. Ut dui mauris, blandit feugiat diam sed, mollis
      elementum nunc. Proin efficitur ex id elit semper, id sagittis odio facilisis. Nulla consectetur nisl vitae
      nisl congue mollis. Proin quam felis, imperdiet ut tortor ac, tristique faucibus lorem. Curabitur tincidunt
      mauris sed justo volutpat iaculis. Pellentesque non dolor nisl. Aenean sodales, ipsum eu gravida dictum, mi
      nunc commodo mauris, vitae euismod nisl massa et eros. Maecenas lobortis dui at porttitor facilisis. Ut ac
      leo at diam placerat ullamcorper vitae eget neque. In libero ex, sagittis nec sapien sit amet, volutpat
      tempor erat. Vivamus vel viverra eros. Maecenas mauris mi, bibendum nec nisl ac, volutpat aliquet massa.
      Integer fringilla odio vitae varius imperdiet. Vestibulum pharetra vulputate feugiat. Quisque dignissim
      bibendum nibh sit amet dignissim.
   </div>

   <div visible:expr="{$page.tab}=='tab3'">
      Aenean ornare ante sed lectus porta rutrum. Pellentesque non pulvinar libero, vitae sodales lectus. Duis
      enim mi, aliquet eget fringilla ut, sodales ac sapien. Pellentesque habitant morbi tristique senectus et
      netus et malesuada fames ac turpis egestas. Nulla magna tortor, cursus id sapien in, dapibus blandit velit.
      Donec et nisi nisl. Donec sagittis interdum leo ac venenatis. Curabitur mollis auctor diam, eu dapibus magna
      sodales et. Mauris quis scelerisque nisl. Aliquam a egestas urna. In sagittis vulputate magna eget lobortis.
      In vel mauris in lacus egestas vestibulum id a nunc. Nullam varius, quam mollis egestas euismod, est ligula
      tristique urna, in volutpat eros risus sit amet nulla. Phasellus semper, metus ac rhoncus pretium, ex leo
      gravida purus, nec aliquam mi dui et ante. Nulla pharetra felis vel mauris dapibus ultricies.
   </div>
</cx>

export default <cx>
   <span putInto="breadcrumbs">Blocks</span>

   <FlexRow pad spacing wrap>
      <Section mod="well" title="Buttons" style="flex:1" preserveWhitespace>
         <FlexRow spacing wrap align>
            <Button>Default</Button>
            <Button disabled>Disabled</Button>

            <Button mod="primary">Primary</Button>
            <Button mod="primary" disabled>Disabled</Button>

            <Button mod="danger">Danger</Button>
            <Button mod="danger" disabled>Disabled</Button>

            <Button mod="hollow" >Hollow</Button>
            <Button mod="hollow" disabled>Disabled</Button>

            <Button mod="hollow" icon="calendar">Icon + Text</Button>
            <Button mod="hollow" icon="calendar" />
         </FlexRow>
      </Section>

      <Section mod="well" title="Tabs" style="flex:1" preserveWhitespace>
         <div style="white-space:nowrap">
            <Tab tab="tab1" value={{bind:"$page.tab", defaultValue: 'tab1'}}>Tab 1</Tab>
            <Tab tab="tab2" value:bind="$page.tab">Tab 2</Tab>
            <Tab tab="tab3" value:bind="$page.tab">Tab 3</Tab>
            <Tab tab="tab4" value:bind="$page.tab" disabled>Disabled</Tab>
         </div>

         <br/>

         <TabContent />
      </Section>

      <Section mod="well" title="Classic Tabs" pad={false} style="flex:1" headerStyle="border-bottom: none" preserveWhitespace>
         <div>
            <div style="padding-left:1.5rem;white-space:nowrap;">
               <Tab tab="tab1" value:bind="$page.tab" mod="classic">Tab 1</Tab>
               <Tab tab="tab2" value:bind="$page.tab" mod="classic">Tab 2</Tab>
               <Tab tab="tab3" value:bind="$page.tab" mod="classic">Tab 3</Tab>
               <Tab tab="tab4" value:bind="$page.tab" mod="classic" disabled>Disabled</Tab>
            </div>
            <div style="background: white; padding: 1.5rem; border-top: 1px solid lightgray">
               <TabContent />
            </div>
         </div>
      </Section>

      <Section mod="well" title="Underline" style="flex:1" preserveWhitespace>
         <div style="white-space:nowrap">
            <Tab tab="tab1" value:bind="$page.tab" mod="line">Tab 1</Tab>
            <Tab tab="tab2" value:bind="$page.tab" mod="line">Tab 2</Tab>
            <Tab tab="tab3" value:bind="$page.tab" mod="line">Tab 3</Tab>
            <Tab tab="tab4" value:bind="$page.tab" mod="line" disabled>Disabled</Tab>
         </div>
         <br/>
         <TabContent />
      </Section>


   </FlexRow>
</cx>
