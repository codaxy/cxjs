import { Controller, LabelsTopLayout } from "cx/ui";
import { LookupField } from "cx/widgets";
import { IFramePortal } from "./IFramePortal";
import "./style.scss";

// Bug repro: a LookupField's dropdown is expected to open right next to the field.
// Here the field is rendered inside an <iframe> (via a React portal - single JS
// realm/React tree, DOM split across two documents), and the iframe itself is
// offset from the parent document's top-left corner. Opening the dropdown shows
// it positioned away from the field, roughly shifted by the iframe's own
// left/top offset within the parent document.

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

export default (
   <cx>
      <div style="font-family: sans-serif; display: flex; flexDirection: column;" controller={PageController}>
         <p style="max-width: 420px; margin: 0 0 16px;">
            Bug repro: The LookupField below is portaled inside an iframe that is offset from the top-left corner of the
            parent document. Open the dropdown — it should appear directly above or below the field, but instead it is
            positioned incorrectly elsewhere on the page.
         </p>
         <p style="max-width: 420px; margin: 0 0 16px;">
            Setting inline=false on the inner lookup would fix the dropdown positioning, but it would prevent the
            dropdown from being isolated from the parent document's stylesheets. Isolating the stylesheets is the
            purpose of IFramePortal, so this is not a suitable workaround.
         </p>

         <p style="max-width: 420px; margin: 0 0 16px;">
            The parent document's lookup has a red background, so the inline-rendered lookup inside IFramePortal will
            pick up this style, while the other lookup will not. Since IFramePortal does not allow stylesheets from the
            outer document to leak into the iframe, we achieve the desired style isolation on the other lookup.
         </p>
         <LabelsTopLayout>
            <LookupField
               label="Parent Document Lookup"
               value-bind="city"
               options-bind="cities"
               placeholder="Select a city..."
            />
         </LabelsTopLayout>

         <IFramePortal style={{ width: "1000px", height: "600px", marginLeft: "300px", border: "2px solid #c0392b" }}>
            <div style="padding: 40px;">
               <LabelsTopLayout>
                  <LookupField
                     class="inner-lookup"
                     label="IFrame Portal Lookup (inline)"
                     value-bind="city"
                     options-bind="cities"
                     placeholder="Select a city..."
                     dropdownOptions={{
                        inline: false,
                     }}
                  />
                  <LookupField
                     class="inner-lookup"
                     label="IFrame Portal Lookup"
                     value-bind="city"
                     options-bind="cities"
                     placeholder="Select a city..."
                  />
               </LabelsTopLayout>
            </div>
         </IFramePortal>
      </div>
   </cx>
);
