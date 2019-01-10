import { HtmlElement, PureContainer, Repeater, Section, FlexCol } from 'cx/widgets';
import createLayout from 'shared/layout';

const layout = createLayout('Home', [<cx>
   <a>Themes</a>
</cx>]);

const themes = [{
  name: 'Material',
  url: 'material',
  imgUrl: '~/img/material.png',
  description: `theme is based on Google's ground-breaking Material design principles and follows the specifications on colors, shapes, shadows and motion effects.
                Choose one of many predefined color schemes or define the size that suits your needs.`,
   style: 'background: #fafafa',
},{
   name: 'Frost',
   url: 'frost',
   imgUrl: '~/img/frost.png',
   description: "theme is inspired by winter colors. It features minimalistic design whose beauty lies in small eye pleasing details.",
   style: 'background: #eff1f7',
}, {
   name: 'Dark',
   url: 'dark',
   imgUrl: '~/img/dark.png',
   description: "theme eases the stress on your eyes caused by long hours of use. Hence, it's commonly used for long-running tools and applications.",
   style: 'background: #222222; color: white',
}, {
   name: 'Core',
   url: 'core',
   imgUrl: '~/img/core.png',
   description: "theme uses mild colors and minimalistic styling. It's commonly used as a base for other themes",
   style: 'background: #eeeeee',
}];

export default <cx>
   <PureContainer outerLayout={layout}>
      <FlexCol pad="xlarge" spacing="xlarge" align="center" class="b-list">
         <Repeater records={themes} recordName="$theme">
            <Section mod="card" pad={false} style:bind="$theme.style">
               <a class="b-card" href:bind="$theme.url">
                  <div class="e-card-desc" visible={false}>
                     <h3 text:bind="$theme.name"/>
                  </div>
                  <div class="e-card-imgwrap">
                     <img src:bind="$theme.imgUrl"/>
                  </div>
                  <div class="e-card-desc">
                     <p ws>
                        <strong text:bind="$theme.name" />
                        <span text:bind="$theme.description"/>
                     </p>
                  </div>
               </a>
            </Section>
         </Repeater>
      </FlexCol>
   </PureContainer>
</cx>


