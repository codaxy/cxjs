import {HtmlElement} from 'cx/ui/HtmlElement';
import {PureContainer} from 'cx/ui/PureContainer';
import {Repeater} from 'cx/ui/Repeater';
import createLayout from 'shared/layout';
import {Section} from 'cx/ui/Section';
import {FlexRow} from 'cx/ui/layout/FlexBox';

const layout = createLayout(<cx>
   <span>Themes</span>
</cx>);

const themes = [{
   name: 'Neutral',
   url: 'neutral',
   imgUrl: '~/img/neutral.png',
   description: "Neutral theme uses mild colors and minimalistic styling and it's commonly used as a base for other themes."
}, {
   name: 'Dark',
   url: 'dark',
   imgUrl: '~/img/dark.png',
   description: "Dark themes ease the stress on your eyes after long hours of use and therefore are commonly used for tools and long running applications."
}, {
   name: 'Frost',
   url: 'frost',
   imgUrl: '~/img/frost.png',
   description: "Winter inspired theme."
}];

export default <cx>
   <PureContainer outerLayout={layout}>
      <FlexRow pad spacing wrap justify="center">
         <Repeater records={themes} recordName="$theme">
            <Section mod="well" pad={false}>
               <a class="b-card" href:bind="$theme.url">
                  <div class="e-card-imgwrap">
                     <img src:bind="$theme.imgUrl" />
                  </div>
                  <div class="e-card-desc">
                     <h3 text:bind="$theme.name" />
                     <p text:bind="$theme.description" />
                  </div>
               </a>
            </Section>
         </Repeater>
      </FlexRow>
   </PureContainer>
</cx>


