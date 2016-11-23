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
   description: "Neutral theme has mild colors and minimalistic styling. It's a perfect base for new themes."
}, {
   name: 'Dark',
   url: 'dark',
   imgUrl: '~/img/dark.png',
   description: "Dark themes ease the stress on your eyes after long hours of use, so they are commonly used for tools and long running applications."
}, {
   name: 'Playground',
   url: 'playground',
   imgUrl: '~/img/play.jpg',
   description: "This is not a real theme, but a place for doing experiments and develop new features."
}];

export default <cx>
   <PureContainer outerLayout={layout}>
      <FlexRow pad spacing wrap justify="center">
         <Repeater records={themes} recordName="$theme">
            <Section mod="well" pad={false}>
               <a href:bind="$theme.url" style="display:table">
                  <div style="display: table-row; width:1px">
                     <img src:bind="$theme.imgUrl" />
                  </div>
                  <div style="display: table-cell; width:1px; padding: 0 1.5rem">
                     <h3 text:bind="$theme.name" />
                     <p text:bind="$theme.description" />
                  </div>
               </a>
            </Section>
         </Repeater>
      </FlexRow>
   </PureContainer>
</cx>


