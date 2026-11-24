// Link and LinkButton with a local href and a target other than _self. The browser should follow
// them: _blank opens a new tab, a named target opens (and then reuses) a tab with that name, and
// the url shown below stays the same. A link without a target navigates inside the app.
//
// Run: import Demo from "./bugs/link-target"; in litmus/index.js
import { Link, LinkButton } from "cx/widgets";

export default (
   <cx>
      <div style="padding: 20px; display: flex; flex-direction: column; gap: 12px; align-items: flex-start">
         <div>
            <b>Current url:</b> <span text-bind="url" style="font-family: monospace" />
         </div>
         <Link href="~/reports" text="Link, no target (stays in this tab)" />
         <Link href="~/reports" target="_blank" text='Link, target="_blank"' />
         <Link href="~/reports" target="report" text='Link, target="report" (named window)' />
         <LinkButton href="~/reports" target="_blank" text='LinkButton, target="_blank"' />
         <Link href="~/" text="Back to ~/" />
      </div>
   </cx>
);
