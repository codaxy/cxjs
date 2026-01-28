import { bind, Controller } from "cx/ui";
import { Button, enableTooltips, FlyweightTooltipTracker, Grid } from "cx/widgets";

enableTooltips();

class PageController extends Controller {
   onInit() {
      //init grid data
      if (!this.store.get("$page.records")) this.shuffle();
   }

   shuffle() {
      this.store.set("$page.records", [
         {
            fullName: "Colten Predovic",
            continent: "Australia",
            browser: "Internet Explorer",
            os: "Ubuntu",
            visits: 21,
         },
         {
            fullName: "EvelineMcGlynnEvelineMcGlynn",
            continent: "Australia",
            browser: "Firefox",
            os: "Android",
            visits: 92,
         },
         {
            fullName: "MaxineRusselMaxineRusselMaxineRusselMaxineRussel",
            continent: "Africa",
            browser: "Safari",
            os: "Ubuntu",
            visits: 98,
         },
         {
            fullName: "Josephine Dickens",
            continent: "Africa",
            browser: "Safari",
            os: "Ubuntu",
            visits: 75,
         },
      ]);
   }
}

export default (
   <cx>
      <FlyweightTooltipTracker
         onGetTooltip={(el) => {
            if (["TD", "TH"].includes(el.tagName) && el.scrollWidth > el.clientWidth) {
               return {
                  text: el.innerText,
                  mouseTrap: true,
               };
            }
         }}
      />
      <div class="widgets" controller={PageController}>
         <Grid
            records-bind="$page.records"
            columns={[
               {
                  header: {
                     text: "Name",
                     width: bind("$page.colWidth.fullName"),
                     resizable: true,
                     defaultWidth: 200,
                  },
                  field: "fullName",
                  sortable: true,
               },
               {
                  header: "Continent",
                  width: bind("$page.colWidth.continent"),
                  resizable: true,
                  field: "continent",
                  sortable: true,
               },
               {
                  header: "Browser",
                  width: bind("$page.colWidth.browser"),
                  resizable: true,
                  field: "browser",
                  sortable: true,
               },
               {
                  header: "OS",
                  width: bind("$page.colWidth.os"),
                  resizable: true,
                  field: "os",
                  sortable: true,
               },
               {
                  header: "Visits",
                  width: bind("$page.colWidth.visits"),
                  resizable: false,
                  field: "visits",
                  sortable: true,
                  align: "right",
               },
            ]}
            // scrollable
            style="max-height: 400px; margin-bottom: 10px; width: 400px"
            onRef={(el, instance) => {
               instance.controller.gridInstance = instance;
            }}
         />

         <Button
            text="Reset column widths"
            onClick={(e, { store, controller }) => {
               controller.gridInstance.setState({ colWidth: {} });
               store.delete("$page.colWidth");
            }}
         />
      </div>
   </cx>
);
