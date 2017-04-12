import {HtmlElement, Link, Button} from 'cx/widgets';
import {ContentPlaceholder} from 'cx/ui';

export default <cx>
   <div
      class={{
         "layout": true,
         "nav": {bind: "layout.nav.open"}
      }}
   >
      <aside class="aside">
         <h1>Cx App</h1>
         <dl>
            <dt>
               App
            </dt>
            <dd>
               <Link href="~/" url:bind="url">
                  Home
               </Link>
            </dd>
            <dd>
               <Link href="~/about" url:bind="url">
                  About
               </Link>
            </dd>
         </dl>
      </aside>
      <main class="main">
         <ContentPlaceholder />
      </main>
      <header class="header">
         <i
            class={{
               hamburger: true,
               open: {bind: 'layout.aside.open'}
            }}
            onClick={(e, {store}) => {
               store.toggle('layout.aside.open');
            }}
         />
         <ContentPlaceholder name="header"/>
      </header>
   </div>
</cx>
