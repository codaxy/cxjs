import {HtmlElement} from 'cx/ui/HtmlElement';
import {Section} from 'cx/ui/Section';
import {FlexRow} from 'cx/ui/layout/FlexBox';

export default <cx>
   <FlexRow pad spacing wrap>
      <Section mod="well" title="Frost Theme">
         <p>
            Frost theme uses winter colors.
         </p>
         <ul>
            <li>
               <a href="#reset">Reset</a>
            </li>
            <li>
               <a href="#blocks">Blocks</a>
            </li>
            <li>
               <a href="#forms">Forms</a>
            </li>
            <li>
               <a href="#grids">Grids</a>
            </li>
            <li>
               <a href="#overlays">Overlays</a>
            </li>
            <li>
               <a href="#charts">Charts</a>
            </li>
         </ul>
      </Section>
   </FlexRow>
</cx>
