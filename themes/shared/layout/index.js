import {HtmlElement, Menu, Icon, Submenu} from 'cx/widgets';
import {ContentPlaceholder} from 'cx/ui';

let sep = <cx>
   <Menu.Item style="vertical-align:middle">
      <Icon name="drop-down" style="transform:rotate(-90deg); display: block"/>
   </Menu.Item>
</cx>;

let defaultNav = <cx>
   <Submenu arrow>
      <ContentPlaceholder name="breadcrumbs" />
      <Menu putInto="dropdown">
         <a href="#core">Core</a>
         <a href="#blocks">Blocks</a>
         <a href="#forms">Forms</a>
         <a href="#grids">Grids</a>
         <a href="#charts">Charts</a>
         <a href="#overlays">Overlays</a>
      </Menu>
   </Submenu>
</cx>;

export default (name, breadcrumbs = defaultNav) => {

   if (!Array.isArray(breadcrumbs))
      breadcrumbs = [breadcrumbs];

   let intermixed = [];
   breadcrumbs.forEach(b => {
      intermixed.push(sep, b);
   });

   return <cx>
      <div class="b-app">
         <header class="e-app-header">
            <div class="b-crumbs">
               <Menu horizontal>
                  <a href="/">Cx</a>
                  {sep}
                  <a href="/themes">Themes</a>
                  {sep}
                  <Submenu>
                     {name}
                     <Menu putInto="dropdown">
                        <a href="/themes/neutral">Neutral</a>
                        <a href="/themes/dark">Dark</a>
                        <a href="/themes/dark">Frost</a>
                     </Menu>
                  </Submenu>
                  {intermixed}
               </Menu>
            </div>
         </header>
         <ContentPlaceholder />
      </div>
   </cx>
}
