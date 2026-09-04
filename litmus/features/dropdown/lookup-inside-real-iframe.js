import { Controller, LabelsTopLayout } from "cx/ui";
import { LookupField } from "cx/widgets";

const isEmbedded = window.self !== window.top;

class PageController extends Controller {
   onInit() {
      this.store.init("city", 1);
      this.store.init("cities", [
         { id: 1, text: "New York" },
         { id: 2, text: "London" },
         { id: 3, text: "Paris" },
         { id: 4, text: "Berlin" },
         { id: 5, text: "Tokyo" },
         { id: 6, text: "Sydney" },
         { id: 7, text: "Toronto" },
         { id: 8, text: "Madrid" },
      ]);
   }
}

const LookupInFrame = (
   <cx>
      <div style="padding: 40px; font-family: sans-serif;" controller={PageController}>
         <LabelsTopLayout>
            <LookupField
               label="Real IFrame Lookup"
               value-bind="city"
               options-bind="cities"
               placeholder="Select a city..."
            />
         </LabelsTopLayout>
      </div>
   </cx>
);

const HostPage = (
   <cx>
      <div style="font-family: sans-serif; display: flex; flexDirection: column;" controller={PageController}>
         <p style="max-width: 420px; margin: 0 0 16px;">
            Bug repro (real iframe): the LookupField in the framed page below runs as a fully independent app in its own
            iframe document/window (a genuine navigation via iframe src, not a React portal). Open its dropdown and
            check whether it's positioned correctly relative to the field.
         </p>
         <LabelsTopLayout>
            <LookupField
               label="Parent Document Lookup"
               value-bind="city"
               options-bind="cities"
               placeholder="Select a city..."
            />
         </LabelsTopLayout>

         <iframe
            src={window.location.href}
            style="width: 1000px; height: 600px; margin-left: 300px; border: 2px solid #2980b9;"
         />
      </div>
   </cx>
);

export default isEmbedded ? LookupInFrame : HostPage;
