import { Controller, LabelsLeftLayout } from "cx/ui";
import { HtmlElement, LookupField } from "cx/widgets";
import { casual } from "../../casual";

class PageController extends Controller {
   onQuery({ query, pageSize, page }) {
      if (!this.cityDb) {
         this.cityDb = Array.from({ length: 1000 }).map((_, i) => ({
            id: i,
            text: casual.city
         }));
         this.cityDb.sort((a, b) => a.text.localeCompare(b.text));
      }

      var regex = new RegExp(query, "gi");
      let filteredList = this.cityDb.filter(x => x.text.match(regex));
      let data = filteredList.slice((page - 1) * pageSize, page * pageSize);
      return new Promise(resolve => {
         setTimeout(
            () => resolve(data),
            100
         );
      });
   }
}

export default (
   <cx>
      <div class="widgets" controller={PageController}>

         <div layout={LabelsLeftLayout}>
            <LookupField
               label="Infinite"
               records:bind="$page.selectedCities"
               onQuery="onQuery"
               multiple
               infinite
               pageSize={100}
            />
         </div>
      </div>
   </cx>
);
