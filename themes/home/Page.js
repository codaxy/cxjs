import { HtmlElement, PureContainer, Repeater, Section, FlexRow } from 'cx/widgets';
import createLayout from 'shared/layout';
import GAController from 'shared/GAController';

const layout = createLayout('Home', [<cx>
   <a>Themes</a>
</cx>]);

const themes = [{
   name: 'Frost',
   url: 'frost',
   imgUrl: '~/img/frost.png',
   description: "Winter inspired theme."
}, {
   name: 'Dark',
   url: 'dark',
   imgUrl: '~/img/dark.png',
   description: "Dark theme eases the stress on your eyes caused by long hours of use. Hence, it's commonly used for long-running tools and applications."
}, {
   name: 'Core',
   url: 'core',
   imgUrl: '~/img/core.png',
   description: "Core theme uses mild colors and minimalistic styling. It's commonly used as a base for other themes"
}];

export default <cx>
   <PureContainer outerLayout={layout} controller={GAController}>
      <FlexRow pad="xlarge" spacing="xlarge" wrap justify="center" class="b-list">
         <Repeater records={themes} recordName="$theme">
            <Section mod="card" pad={false}>
               <a class="b-card" href:bind="$theme.url">
                  <div class="e-card-imgwrap">
                     <img src:bind="$theme.imgUrl"/>
                  </div>
                  <div class="e-card-desc">
                     <h3 text:bind="$theme.name"/>
                     <p text:bind="$theme.description"/>
                  </div>
               </a>
            </Section>
         </Repeater>
      </FlexRow>
   </PureContainer>
</cx>


