import {HtmlElement} from 'cx/ui/HtmlElement';
import {PureContainer} from 'cx/ui/PureContainer';
import {Repeater} from 'cx/ui/Repeater';
import createLayout from 'shared/layout';
import {Section} from 'shared/components/Section';
import {FlexRow} from 'shared/components/FlexBox';

const layout = createLayout(<cx>
   <span>Themes</span>
</cx>);

const themes = [{
   name: 'Neutral',
   url: 'neutral',
   imgUrl: '~/img/neutral.png'
}, {
   name: 'Dark',
   url: 'dark',
   imgUrl: '~/img/dark.png'
}];

export default <cx>
   <PureContainer outerLayout={layout}>
      <FlexRow distance wrap center>
         <Repeater records={themes} recordName="$theme">
            <Section mod="well" pad={false}>
               <a href:bind="$theme.url">
                  <img src:bind="$theme.imgUrl" />
                  <p text:bind="$theme.name" />
               </a>
            </Section>
         </Repeater>
      </FlexRow>
   </PureContainer>
</cx>


