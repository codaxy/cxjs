import { HtmlElement, PureContainer, Repeater, Section, FlexCol } from 'cx/widgets';
import createLayout from 'shared/layout';

const layout = createLayout('Home', [<cx>
   <a>Themes</a>
</cx>]);

const themes = [{
  name: 'Material',
  url: 'material',
  imgUrl: '~/img/material.png',
  description: `This theme is based on Google's ground-breaking Material design principles. It closely follows their detailed specifications on colors, shapes, shadows and motion effects.
                The best part is, you can easily choose one of the many predefined color schemes or define your own unique look.`
},{
   name: 'Frost',
   url: 'frost',
   imgUrl: '~/img/frost.png',
   description: "Frost is another beautiful theme inspired by winter colors. It feauters minimalistic design, whose beauty lies in a lot of small eye pleasing details."
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
   <PureContainer outerLayout={layout}>
      <FlexCol pad="xlarge" spacing="xlarge" align="center" class="b-list">
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
      </FlexCol>
   </PureContainer>
</cx>


