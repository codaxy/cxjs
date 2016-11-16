import {HtmlElement} from 'cx/ui/HtmlElement';
import {PureContainer} from 'cx/ui/PureContainer';
import {Repeater} from 'cx/ui/Repeater';
import createLayout from 'shared/layout';
import {Section} from 'shared/components/Section';

const layout = createLayout(<cx>
   <a href="">Themes</a>
</cx>);

const themes = [{
   name: 'Neutral',
   url: 'neutral'
}, {
   name: 'Dark',
   url: 'dark'
}]

export default <cx>
   <PureContainer outerLayout={layout}>
      <div class="flexrow phone" style="padding:1rem">
         <Repeater records={themes} recordName="$theme">
            <Section mod="well" pad={false}>
               <a href:bind="$theme.url">
                  <img src="http://placehold.it/300x300" />
                  <p text:bind="$theme.name" />
               </a>
            </Section>
         </Repeater>
      </div>
   </PureContainer>
</cx>


