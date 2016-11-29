import {HtmlElement} from 'cx/ui/HtmlElement';
import {Button} from 'cx/ui/Button';
import {Repeater} from 'cx/ui/Repeater';
import {Tab} from 'cx/ui/nav/Tab';
import {Text} from 'cx/ui/Text';
import {Section} from 'cx/ui/Section';
import {FlexRow} from 'cx/ui/layout/FlexBox';


export default <cx>
   <span putInto="breadcrumbs">Core</span>

   <FlexRow pad spacing wrap>
      <Section title="Typography" mod="well" style="flex:1" preserveWhitespace>
         <h1>Header 1</h1>
         <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
         </p>

         <h2>
            Header 2
         </h2>
         <p>
            Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
         </p>

         <p>
            Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.
         </p>

         <h3>Header 3</h3>
         <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
         </p>
         <h4>
            Header 4
         </h4>
         <p>
            Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
         </p>

         <h4>Lists</h4>
         <ul>
            <li>Item A</li>
            <li>Item B</li>
            <li>Item C</li>
         </ul>

         <h4>Ordered Lists</h4>
         <ol>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
         </ol>

         <h4>Header 4</h4>
         <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
         </p>

         <h5>Header 5</h5>
         <p>
            Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.
         </p>

         <h6>Header 6</h6>
         <p>
            Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
         </p>

      </Section>

      <Section title="Color Palette" mod="well" style="flex:1" preserveWhitespace>
         <h4>Default</h4>
         <FlexRow spacing wrap>
            <Repeater records={Array.from({length: 16})}>
               <div class="b-color-well" className:tpl="cxs-selectable cxs-color-{$index}">
                  <Text tpl="Color {$index}" />
               </div>
            </Repeater>
         </FlexRow>

         <br/>

         <h4>Selected</h4>
         <FlexRow spacing wrap>
            <Repeater records={Array.from({length: 16})}>
               <div class="b-color-well" className:tpl="cxs-selected cxs-color-{$index}">
                  <Text tpl="Color {$index}" />
               </div>
            </Repeater>
         </FlexRow>
      </Section>

   </FlexRow>
</cx>
