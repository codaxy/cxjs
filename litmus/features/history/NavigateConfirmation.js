import { Controller, History, Repeater } from "cx/ui";
import { Button, Checkbox, Link, MsgBox, Route } from "cx/widgets";

// Showcases History.addNavigateConfirmation. The confirmation callback should be
// invoked for link navigation, for programmatic navigation (History.pushState)
// and for browser Back/Forward navigation.

class PageController extends Controller {
   onInit() {
      this.store.init("$page.log", []);
      this.store.init("$page.block", false);

      // A permanent confirmation is registered only once, so all scenarios below can be
      // tested repeatedly. Non permanent confirmations are removed after the first
      // confirmed navigation.
      History.addNavigateConfirmation((url) => {
         // navigation is allowed without asking if there is nothing to protect
         if (!this.store.get("$page.block")) return true;

         this.log(`Confirmation requested for ${url}.`);
         return MsgBox.yesNo("You have unsaved changes. Leave this page anyway?").then((answer) => {
            let leave = answer === "yes";
            this.log(leave ? `Navigation to ${url} confirmed.` : `Navigation to ${url} cancelled.`);
            // changes are discarded, hence the next navigation is not blocked
            if (leave) this.store.set("$page.block", false);
            return leave;
         });
      }, true);

      this.addTrigger("url-log", ["url"], (url) => {
         this.log(`Page changed to ${url}.`);
      });
   }

   log(message) {
      this.store.update("$page.log", (log) =>
         [{ time: new Date().toLocaleTimeString(), message }, ...(log ?? [])].slice(0, 20),
      );
   }

   navigateToPageB() {
      // programmatic navigation goes through the same confirmation
      History.pushState({}, null, "~/page-b");
   }
}

export default (
   <cx>
      <div controller={PageController} style="padding: 20px; max-width: 800px; font-family: sans-serif">
         <h2>History Navigate Confirmation</h2>

         <nav style="display: flex; gap: 15px; margin: 15px 0">
            <Link href="~/" url-bind="url">
               Home
            </Link>
            <Link href="~/page-a" url-bind="url">
               Page A
            </Link>
            <Link href="~/page-b" url-bind="url">
               Page B
            </Link>
         </nav>

         <div style="border: 1px solid #ccc; padding: 15px">
            <Route route="~/" url-bind="url">
               <h3>Home</h3>
            </Route>
            <Route route="~/page-a" url-bind="url">
               <h3>Page A</h3>
            </Route>
            <Route route="~/page-b" url-bind="url">
               <h3>Page B</h3>
            </Route>

            <Checkbox value-bind="$page.block" text="Simulate unsaved changes (block navigation)" />

            <p ws visible-expr="!!{$page.block}" style="color: #b00">
               Leaving this page requires confirmation.
            </p>
            <p ws visible-expr="!{$page.block}" style="color: #070">
               Navigation is not blocked.
            </p>

            <Button onClick="navigateToPageB">Go to Page B (History.pushState)</Button>
         </div>

         <h3>Scenarios</h3>
         <ol>
            <li>
               Check "Simulate unsaved changes" and click one of the links above. The confirmation is asked for link
               navigation.
            </li>
            <li>
               Check the box again and click "Go to Page B". The confirmation is asked for programmatic navigation as
               well.
            </li>
            <li>
               Visit a few pages using the links so that there is something in the browser history, check the box and
               press the browser Back button. The confirmation should be asked and the address bar should stay on the
               current page while the dialog is open. Answering "No" keeps the current page.
            </li>
            <li>Repeat the previous scenario and answer "Yes". The browser goes back and the page content follows.</li>
            <li>
               After going back, check the box and press the browser Forward button. Forward navigation is confirmed
               the same way.
            </li>
            <li>
               Press Back several times in a row while the confirmation dialog is open. Only one dialog should be shown
               and answering "No" should return to the page which is currently displayed.
            </li>
         </ol>

         <h3>Log</h3>
         <div style="border: 1px solid #ccc; padding: 10px; font-family: monospace; font-size: 12px">
            <div ws visible-expr="{$page.log}.length == 0">
               Nothing logged yet.
            </div>
            <Repeater records-bind="$page.log" recordAlias="$entry">
               <div ws>
                  <span text-bind="$entry.time" style="color: #888" /> <span text-bind="$entry.message" />
               </div>
            </Repeater>
         </div>
      </div>
   </cx>
);
