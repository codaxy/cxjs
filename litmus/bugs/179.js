import {
   Link,
   Route,
   RedirectRoute,
   HtmlElement,
   List
} from "cx/widgets";

export default (
   <cx>
      <div>
         <p ws>
            <Link href="~/" url:bind="url">Home</Link>
            <Link href="~/messages" url:bind="url">Messages</Link>
         </p>
         <Route route="~/messages" url:bind="url" prefix>
            <RedirectRoute route="~/messages" url:bind="url" redirect="~/messages/inbox"/>

            <Route route="~/messages/inbox" url:bind="url">
               Inbox
            </Route>

            <List records={Array.from({length: 500}, x => ({}))}>
               <span text:bind="$index" />
            </List>
         </Route>
         <Route route="~/" url:bind="url">
            Home
         </Route>
      </div>
   </cx>
);
