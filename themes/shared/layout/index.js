import { HtmlElement } from 'cx/widgets';
import { ContentPlaceholder } from 'cx/ui';

export default (breadcrumbs) => <cx>
   <div class="b-app">
      <header class="e-app-header">
         <div class="b-crumbs">
            <a href="/">Cx</a>
            {breadcrumbs}
            <ContentPlaceholder name="breadcrumbs" />
         </div>
      </header>
      <ContentPlaceholder />
   </div>
</cx>
