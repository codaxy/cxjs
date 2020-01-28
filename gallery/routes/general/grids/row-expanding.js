import {
   Grid,
   HtmlElement,
   Button,
   TextField,
   NumberField,
   Content,
   Section
} from "cx/widgets";
import { Controller } from "cx/ui";
import { Svg } from "cx/svg";
import { Chart, Gridlines, LineGraph, NumericAxis } from "cx/charts";
import casual from "../../../util/casual";

class PageController extends Controller {
   onInit() {
      //init grid data
      if (!this.store.get("$page.records")) this.shuffle();
   }

   shuffle() {
      this.store.set(
         "$page.records",
         Array.from({ length: 20 }).map((v, i) => ({
            fullName: casual.full_name,
            continent: casual.continent,
            browser: casual.browser,
            os: casual.operating_system,
            visits: casual.integer(1, 100),
            points: this.generateTrend()
         }))
      );
   }

   generateTrend() {
      let y = 100;
      return Array.from({ length: 101 }, (_, i) => ({
         x: i * 4,
         y: (y = y + Math.random() - 0.5)
      }));
   }
}

export default (
   <cx>
      <Section
         mod="card"
         controller={PageController}
         style="height: 100%"
         bodyStyle="display:flex; flex-direction:column"
      >
         <Grid
            records-bind="$page.records"
            lockColumnWidths
            cached
            style="width: 100%; flex: 1 1 0px"
            scrollable
            row={{
               style: {
                  background: {
                     expr:
                        "{$record.showDescription} && {$root.$route.theme}!='material-dark' && {$root.$route.theme}!='space-blue' ? '#fff7e6' : null"
                  }
               },
               line1: {
                  columns: [
                     {
                        header: "Name",
                        field: "fullName",
                        sortable: true
                     },
                     {
                        header: "Continent",
                        field: "continent",
                        sortable: true
                     },
                     {
                        header: "Browser",
                        field: "browser",
                        sortable: true
                     },
                     {
                        header: "OS",
                        field: "os",
                        sortable: true
                     },
                     {
                        header: "Visits",
                        field: "visits",
                        sortable: true,
                        align: "right"
                     },
                     {
                        header: {
                           items: (
                              <cx>
                                 <cx>
                                    <Button
                                       mod="hollow"
                                       icon="search"
                                       onClick={(e, { store }) => {
                                          store.toggle("$page.showGridFilter");
                                       }}
                                    />
                                 </cx>
                              </cx>
                           )
                        },
                        align: "center",
                        items: (
                           <cx>
                              <cx>
                                 <Button
                                    mod="hollow"
                                    icon="drop-down"
                                    onClick={(e, { store }) => {
                                       store.toggle("$record.showDescription");
                                    }}
                                 />
                              </cx>
                           </cx>
                        )
                     }
                  ]
               },
               line2: {
                  showHeader: { expr: "!!{$page.showGridFilter}" },
                  visible: false,
                  columns: [
                     {
                        header: {
                           items: (
                              <cx>
                                 <TextField
                                    value-bind="$page.filter.fullName"
                                    style="width: 100%"
                                    autoFocus
                                 />
                              </cx>
                           )
                        }
                     },
                     {
                        header: {
                           items: (
                              <cx>
                                 <TextField
                                    value-bind="$page.filter.continent"
                                    style="width: 100%"
                                 />
                              </cx>
                           )
                        }
                     },
                     {
                        header: {
                           items: (
                              <cx>
                                 <TextField
                                    value-bind="$page.filter.browser"
                                    style="width: 100%"
                                 />
                              </cx>
                           )
                        }
                     },
                     {
                        header: {
                           items: (
                              <cx>
                                 <TextField
                                    value-bind="$page.filter.os"
                                    style="width: 100%"
                                 />
                              </cx>
                           )
                        }
                     },
                     {
                        header: {
                           items: (
                              <cx>
                                 <NumberField
                                    value-bind="$page.filter.visits"
                                    style="width: 100%"
                                    inputStyle="text-align: right"
                                 />
                              </cx>
                           )
                        }
                     },
                     {
                        header: {
                           align: "center",
                           items: (
                              <cx>
                                 <Button
                                    mod="hollow"
                                    icon="close"
                                    onClick={(e, { store }) => {
                                       store.toggle("$page.showGridFilter");
                                    }}
                                 />
                              </cx>
                           )
                        }
                     }
                  ]
               },
               line3: {
                  visible: { expr: "{$record.showDescription}" },
                  columns: [
                     {
                        colSpan: 1000,
                        style: "border-top-color: rgba(0, 0, 0, 0.05)",
                        items: (
                           <cx>
                              <Svg style="width:100%px; height:400px;">
                                 <Chart
                                    offset="20 -10 -40 40"
                                    axes={{
                                       x: { type: NumericAxis },
                                       y: { type: NumericAxis, vertical: true }
                                    }}
                                 >
                                    <Gridlines />
                                    <LineGraph
                                       data-bind="$record.points"
                                       colorIndex={8}
                                    />
                                 </Chart>
                              </Svg>
                           </cx>
                        )
                     }
                  ]
               }
            }}
         />
      </Section>
   </cx>
);
