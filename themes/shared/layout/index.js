import {HtmlElement, Menu, Icon, Submenu} from 'cx/widgets';
import {ContentPlaceholder} from 'cx/ui';

let sep = <cx>
   <Menu.Item style="vertical-align:middle">
      <Icon name="drop-down" style="transform:rotate(-90deg); display: block"/>
   </Menu.Item>
</cx>;

let defaultNav = name => <cx>
   <a href="..">Themes</a>
   <Submenu>
      {name}
      <Menu putInto="dropdown">
         <a href="../core">Core</a>
         <a href="../dark">Dark</a>
         <a href="../frost">Frost</a>
         <a href="../material">Material</a>
      </Menu>
   </Submenu>
   <Submenu arrow>
      <ContentPlaceholder name="breadcrumbs" />
      <Menu putInto="dropdown">
         <a href="#">Widgets</a>
         <a href="#grids">Grids</a>
         <a href="#charts">Charts</a>
         <a href="#global">Global</a>
      </Menu>
   </Submenu>
</cx>;

export default (name, breadcrumbs) => {

   if (!breadcrumbs)
      breadcrumbs = defaultNav(name);

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
                  {intermixed}
               </Menu>
            </div>
         </header>
         <ContentPlaceholder />
      </div>
   </cx>
}
