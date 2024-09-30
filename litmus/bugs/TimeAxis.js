import { Chart, LineGraph, NumericAxis, TimeAxis } from "cx/charts";
import { Svg } from "cx/svg";
import { Controller, enableCultureSensitiveFormatting, LabelsTopLayout } from "cx/ui";
import { ContentResolver, LookupField, NumberField, Resizer } from "cx/widgets";

enableCultureSensitiveFormatting();

class PageController extends Controller {
   onInit() {
      this.store.init("width", 500);
      this.store.init("$page.params", {
         periodicity: "weekly",
         snapToTicks: 0,
         minLabelDistance: 200,
         minTickDistance: 60,
         minTickUnit: "second",
      });

      this.addTrigger(
         "on-periodicity-change",
         ["$page.params.periodicity"],
         (p) => {
            this.store.set("$page.data", dataMap[p]);
         },
         true,
      );
   }
}

export default (
   <cx>
      <div controller={PageController} style="display: flex; padding: 24px">
         <div style="display: flex; flex-direction: column;">
            <LookupField
               label="Periodicity"
               value-bind="$page.params.periodicity"
               options={[
                  {
                     id: "daily",
                     text: "Daily",
                  },
                  { id: "weekly", text: "Weekly" },
                  { id: "monthly", text: "Monthly" },
               ]}
               hideClear
            />

            <div text="X Axis:" style="margin-top: 20px" />

            <LabelsTopLayout columns={1}>
               <LookupField
                  label="Snap to Ticks:"
                  value-bind="$page.params.snapToTicks"
                  options={[
                     {
                        id: -1,
                        text: "false",
                     },
                     {
                        id: 0,
                        text: "0",
                     },
                     {
                        id: 1,
                        text: "1",
                     },
                     {
                        id: 2,
                        text: "2",
                     },
                  ]}
               />

               <NumberField label="Min Label Distance:" value-bind="$page.params.minLabelDistance" />
               <NumberField label="Min Tick Distance:" value-bind="$page.params.minTickDistance" />
               <LookupField
                  label="Min Tick Unit:"
                  value-bind="$page.params.minTickUnit"
                  options={[
                     {
                        id: "second",
                        text: "second",
                     },
                     { id: "minute", text: "minute" },
                     { id: "hour", text: "hour" },
                     { id: "day", text: "day" },
                     { id: "week", text: "week" },
                     { id: "month", text: "month" },
                     { id: "year", text: "year" },
                  ]}
                  hideClear
               />
            </LabelsTopLayout>
         </div>

         <ContentResolver
            params-bind="$page.params"
            onResolve={(params) => {
               let format = "datetime;MMM yyyy dd";

               let { periodicity, ...axisParams } = params;

               if (periodicity == "monthly") {
                  format = "datetime;MMM yyyy";
               }

               return (
                  <cx>
                     {/* <div text-bind="$page.data.length"></div> */}
                     <Svg style-tpl="width:{width}px;height:450px;" margin="60 60 60 60">
                        <Chart
                           offset="-20 -35 -40 40"
                           axes={{
                              x: {
                                 type: TimeAxis,
                                 tickSize: 5,
                                 format,
                                 labelAnchor: "middle",
                                 labelDx: -1,
                                 ...axisParams,
                              },
                              y: {
                                 type: NumericAxis,
                                 vertical: true,
                                 format: "n;0;0;c",
                                 hideLabels: true,
                                 snapToTicks: 0,
                              },
                           }}
                        >
                           <LineGraph
                              name="Predicted"
                              data-bind="$page.data"
                              //   colorIndex={9}
                              xField="date"
                              yField="predicted"
                           />

                           {/* <LineGraph
                              name="Actual"
                              data-bind="$page.data"
                              //   colorIndex={6}
                              xField="date"
                              yField="actual"
                           /> */}
                        </Chart>
                     </Svg>
                  </cx>
               );
            }}
         />
         <Resizer size-bind="width" vertical style="background: red" minSize={200} />
      </div>
   </cx>
);

const dataMap = {
   daily: [
      {
         date: "08-01-2024",
         predicted: 11.39,
         actual: 12.9,
      },
      {
         date: "08-02-2024",
         predicted: 11.07,
         actual: 12.58,
      },
      {
         date: "08-03-2024",
         predicted: 9.42,
         actual: 11.09,
      },
      {
         date: "08-04-2024",
         predicted: 9.44,
         actual: 11.05,
      },
      {
         date: "08-05-2024",
         predicted: 12.53,
         actual: 13.36,
      },
      {
         date: "08-06-2024",
         predicted: 11.64,
         actual: 13.06,
      },
      {
         date: "08-07-2024",
         predicted: 11.56,
         actual: 13,
      },
      {
         date: "08-08-2024",
         predicted: 11.59,
         actual: 12.95,
      },
      {
         date: "08-09-2024",
         predicted: 11.17,
         actual: 12.62,
      },
      {
         date: "08-10-2024",
         predicted: 9.75,
         actual: 11.26,
      },
      {
         date: "08-11-2024",
         predicted: 9.51,
         actual: 11,
      },
      {
         date: "08-12-2024",
         predicted: 12.58,
         actual: 13.39,
      },
      {
         date: "08-13-2024",
         predicted: 11.69,
         actual: 13.09,
      },
      {
         date: "08-14-2024",
         predicted: 11.63,
         actual: 13.01,
      },
      {
         date: "08-15-2024",
         predicted: 11.57,
         actual: 12.92,
      },
      {
         date: "08-16-2024",
         predicted: 11.22,
         actual: 12.59,
      },
      {
         date: "08-17-2024",
         predicted: 9.71,
         actual: 11.2,
      },
      {
         date: "08-18-2024",
         predicted: 9.56,
         actual: 11.06,
      },
      {
         date: "08-19-2024",
         predicted: 12.54,
         actual: 13.35,
      },
      {
         date: "08-20-2024",
         predicted: 11.65,
         actual: 13.07,
      },
      {
         date: "08-21-2024",
         predicted: 11.54,
         actual: 12.96,
      },
      {
         date: "08-22-2024",
         predicted: 11.48,
         actual: 12.86,
      },
      {
         date: "08-23-2024",
         predicted: 11.09,
         actual: 12.55,
      },
      {
         date: "08-24-2024",
         predicted: 9.68,
         actual: 11.24,
      },
      {
         date: "08-25-2024",
         predicted: 9.46,
         actual: 10.97,
      },
      {
         date: "08-26-2024",
         predicted: 11.91,
         actual: 13.31,
      },
      {
         date: "08-27-2024",
         predicted: 11.61,
         actual: 13.01,
      },
      {
         date: "08-28-2024",
         predicted: 11.51,
         actual: 12.93,
      },
      {
         date: "08-29-2024",
         predicted: 11.44,
         actual: 12.86,
      },
      {
         date: "08-30-2024",
         predicted: 11.03,
         actual: 12.5,
      },
      {
         date: "08-31-2024",
         predicted: 9.43,
         actual: 11.04,
      },
   ],
   weekly: [
      {
         date: "07-28-2024",
         predicted: 31.88,
         actual: 36.57,
      },
      {
         date: "08-04-2024",
         predicted: 77.68,
         actual: 87.3,
      },
      {
         date: "08-11-2024",
         predicted: 77.91,
         actual: 87.2,
      },
      {
         date: "08-18-2024",
         predicted: 77.53,
         actual: 87.09,
      },
      {
         date: "08-25-2024",
         predicted: 76.39,
         actual: 86.62,
      },
   ],
   monthly: [
      {
         date: "04-01-2024",
         predicted: 337.91,
         actual: 377.03,
      },
      {
         date: "05-01-2024",
         predicted: 339.77,
         actual: 382.65,
      },
      {
         date: "06-01-2024",
         predicted: 328.38,
         actual: 369.38,
      },
   ],
};
