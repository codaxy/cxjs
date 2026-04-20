import { Controller } from "cx/ui";
import { Button, Grid } from "cx/widgets";
import { casual } from "../casual";

// Regenerates 2000 records every second to probe for memory leaks
// in Grid / ArrayAdapter (possibly React-related).
// Run in dev mode and prod mode. Observe the heap in Chrome DevTools
// Memory tab: take a snapshot, wait a minute, take another, compare.
// Force GC (trash can icon) before each snapshot to rule out uncollected garbage.

function generate(count) {
   return Array.from({ length: count }).map((v, i) => ({
      id: i + 1,
      fullName: casual.full_name,
      continent: casual.continent,
      browser: casual.browser,
      os: casual.operating_system,
      visits: casual.integer(1, 100),
   }));
}

class PageController extends Controller {
   onInit() {
      this.store.set("$page.records", generate(2000));
      this.store.set("$page.tick", 0);
      this.store.set("$page.running", true);

      this.interval = setInterval(() => {
         if (!this.store.get("$page.running")) return;
         this.store.set("$page.records", generate(2000));
         this.store.update("$page.tick", (t) => t + 1);
      }, 1000);
   }

   onDestroy() {
      clearInterval(this.interval);
   }
}

export default (
   <cx>
      <div controller={PageController} style="padding: 10px">
         <p>
            <Button onClick={(e, { store }) => store.toggle("$page.running")}>
               <span text-expr="{$page.running} ? 'Pause' : 'Resume'" />
            </Button>
            &nbsp;Regenerated <span text-bind="$page.tick" /> times
         </p>
         <Grid
            records-bind="$page.records"
            scrollable
            buffered
            lockColumnWidths
            cached
            style="height: 600px"
            columns={[
               { header: "#", field: "id", sortable: true, width: 80 },
               { header: "Name", field: "fullName", sortable: true, width: 200 },
               { header: "Continent", field: "continent", sortable: true },
               { header: "Browser", field: "browser", sortable: true },
               { header: "OS", field: "os", sortable: true },
               { header: "Visits", field: "visits", sortable: true, align: "right" },
            ]}
         />
      </div>
   </cx>
);
