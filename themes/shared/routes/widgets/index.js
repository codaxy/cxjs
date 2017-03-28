import { HtmlElement, Button, Tab, Section, FlexRow, MsgBox } from 'cx/widgets';

import LoginWindow from './LoginWindow';
import ContactWindow from './ContactWindow';

import Menu1 from './Menu1';
import Toasts from './Toasts';
import Forms from './Forms';

const TabContent = <cx>
   <div visible:expr="{$page.tab}=='tab1'">
      <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
   </div>

   <div visible:expr="{$page.tab}=='tab2'">
      <p>Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.</p>
   </div>

   <div visible:expr="{$page.tab}=='tab3'">
      <p>Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.</p>
   </div>
</cx>

export default <cx>
   <span putInto="breadcrumbs">Widgets</span>

   <FlexRow pad spacing wrap target="tablet">
      <Section mod="card" title="Buttons" style="flex:1 0 200px" preserveWhitespace>
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

      <Section mod="card" title="Tabs" style="flex:1 0 300px" preserveWhitespace>
         <div class="cxb-tab-container">
            <Tab tab="tab1" value={{bind:"$page.tab", defaultValue: 'tab1'}}>Tab 1</Tab>
            <Tab tab="tab2" value:bind="$page.tab">Tab 2</Tab>
            <Tab tab="tab3" value:bind="$page.tab">Tab 3</Tab>
            <Tab tab="tab4" value:bind="$page.tab" disabled>Disabled</Tab>
         </div>

         <br/>

         <TabContent />
      </Section>

      <Section
         mod="card"
         title="Classic Tabs"
         pad={false}
         style="flex:1 0 300px;"
         headerStyle="border-bottom: none"
         bodyStyle="display:flex;flex-direction:column;"
         preserveWhitespace
      >
         <div class="cxb-tab-container cxm-classic">
            <Tab tab="tab1" value:bind="$page.tab" mod="classic">Tab 1</Tab>
            <Tab tab="tab2" value:bind="$page.tab" mod="classic">Tab 2</Tab>
            <Tab tab="tab3" value:bind="$page.tab" mod="classic">Tab 3</Tab>
            <Tab tab="tab4" value:bind="$page.tab" mod="classic" disabled>Disabled</Tab>
         </div>
         <div mod="cover" style="padding: 1.5rem; border-width:1px 0 0 0; flex:auto; border-radius:3px">
            <TabContent />
         </div>
      </Section>

      <Section mod="card" title="Underline" style="flex:1 0 300px" preserveWhitespace>
         <div class="cxb-tab-container">
            <Tab tab="tab1" value:bind="$page.tab" mod="line">Tab 1</Tab>
            <Tab tab="tab2" value:bind="$page.tab" mod="line">Tab 2</Tab>
            <Tab tab="tab3" value:bind="$page.tab" mod="line">Tab 3</Tab>
            <Tab tab="tab4" value:bind="$page.tab" mod="line" disabled>Disabled</Tab>
         </div>
         <br/>
         <TabContent />
      </Section>
         <Section mod="card" title="Windows" style="flex:1 0 150px">
            <FlexRow spacing align wrap>
               <Button onClick={(e, {store}) => { store.toggle('$page.login.visible')}}>Modal</Button>
               <Button onClick={(e, {store}) => { store.toggle('$page.contact.visible')}}>Backdrop</Button>
               <Button onClick={()=>{MsgBox.alert('This is a very important message.')}}>Alert</Button>
               <Button onClick={()=>{MsgBox.yesNo('Would you like to close this window?')}}>Confirm</Button>
            </FlexRow>
            <LoginWindow />
            <ContactWindow />
         </Section>

         <Section mod="card" title="Menus" style="flex:1 0 300px">
            <Menu1 />
         </Section>

         <Section mod="card" title="Toasts" style="flex:1 0 200px">
            <Toasts />
         </Section>

      <Forms />


   </FlexRow>
</cx>
