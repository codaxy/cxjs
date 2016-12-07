import { HtmlElement, Button, Tab, Section, FlexRow } from 'cx/widgets';

const TabContent = <cx>
   <div visible:expr="{$page.tab}=='tab1'">
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
   </div>

   <div visible:expr="{$page.tab}=='tab2'">
      Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
   </div>

   <div visible:expr="{$page.tab}=='tab3'">
      Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.
   </div>
</cx>

export default <cx>
   <span putInto="breadcrumbs">Blocks</span>

   <FlexRow pad spacing wrap>
      <Section mod="well" title="Buttons" style="flex:1;min-width:250px" preserveWhitespace>
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

      <Section
         mod="well"
         title="Classic Tabs"
         pad={false}
         style="flex:1;overflow:hidden"
         headerStyle="border-bottom: none"
         bodyStyle="display:flex;flex-direction:column"
         preserveWhitespace
      >
         <div style="padding:0 1.5rem;white-space:nowrap;flex-shrink:0">
            <Tab tab="tab1" value:bind="$page.tab" mod="classic">Tab 1</Tab>
            <Tab tab="tab2" value:bind="$page.tab" mod="classic">Tab 2</Tab>
            <Tab tab="tab3" value:bind="$page.tab" mod="classic">Tab 3</Tab>
            <Tab tab="tab4" value:bind="$page.tab" mod="classic" disabled>Disabled</Tab>
         </div>
         <div mod="cover" style="padding: 1.5rem; border-width:1px 0 0 0; flex: 1 0">
            <TabContent />
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
