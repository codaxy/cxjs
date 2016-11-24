import {HtmlElement} from 'cx/ui/HtmlElement';
import {Button} from 'cx/ui/Button';
import {Tab} from 'cx/ui/nav/Tab';
import {Section} from 'cx/ui/Section';
import {FlexRow} from 'cx/ui/layout/FlexBox';


export default <cx>
   <span putInto="breadcrumbs">Blocks</span>

   <FlexRow pad spacing wrap>
      <Section mod="well" style="flex:1" preserveWhitespace>
         <h1>Header 1</h1>
         <h2>Header 2</h2>
         <h3>Header 3</h3>
         <h4>Header 4</h4>
         <h5>Header 5</h5>
         <h6>Header 6</h6>
      </Section>
      <Section mod="well" style="flex:1" preserveWhitespace>
         <h1>Header 1</h1>
         <p>
            Proin a turpis orci. Suspendisse aliquam elementum luctus. Nunc varius maximus tristique. Phasellus viverra auctor mauris quis vehicula. Etiam a maximus velit. Aliquam sem eros, ultricies at blandit et, dictum non orci. Mauris tincidunt a nulla ac tincidunt. Proin a nisl fermentum, auctor erat et, volutpat turpis. In dignissim purus sit amet leo sollicitudin tempus. Morbi blandit quam vel gravida convallis.
         </p>
         <h2>
            Header 2
         </h2>
         <p>
            Proin a turpis orci. Suspendisse aliquam elementum luctus. Nunc varius maximus tristique. Phasellus viverra auctor mauris quis vehicula. Etiam a maximus velit. Aliquam sem eros, ultricies at blandit et, dictum non orci. Mauris tincidunt a nulla ac tincidunt. Proin a nisl fermentum, auctor erat et, volutpat turpis. In dignissim purus sit amet leo sollicitudin tempus. Morbi blandit quam vel gravida convallis.
         </p>
         <ul>
            <li>Item A</li>
            <li>Item B</li>
            <li>Item C</li>
         </ul>
      </Section>

      <Section mod="well" style="flex:1" preserveWhitespace>
         <ul>
            <li>Item A</li>
            <li>Item B</li>
            <li>Item C</li>
         </ul>

         <p>
            Proin a turpis orci. Suspendisse aliquam elementum luctus. Nunc varius maximus tristique. Phasellus viverra auctor mauris quis vehicula. Etiam a maximus velit. Aliquam sem eros, ultricies at blandit et, dictum non orci. Mauris tincidunt a nulla ac tincidunt. Proin a nisl fermentum, auctor erat et, volutpat turpis. In dignissim purus sit amet leo sollicitudin tempus. Morbi blandit quam vel gravida convallis.
         </p>
         <ol>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
         </ol>
      </Section>
   </FlexRow>
</cx>
