import { ContentResolver } from "../../ui/ContentResolver";
import { DataProxy } from "../../ui/DataProxy";
import { List } from "../List";
import { KeySelection } from "../../ui/selection/KeySelection";
import { createFunctionalComponent } from "../../ui/createFunctionalComponent";
import { zeroTime } from "../../util/date/zeroTime";
import { Format } from "../../util/Format";
import { Culture } from "../../ui/Culture";
import { isString } from "../../util/isString";
import { isFunction } from "../../util/isFunction";

export const TimeList = createFunctionalComponent(({ value, step, format, encoding, onSelect, ...props }) => {
   return (
      <cx>
         <ContentResolver
            params={{ step, format, dummy: true }}
            onResolve={({ step, format }) => {
               let max = 24 * 60;
               if (!step) step = 15;
               if (step < 1) step = 1;
               let times = [];
               let today = zeroTime(new Date()).valueOf();
               for (let m = 0; m < max; m += step) {
                  let time = m * 60 * 1000;
                  times.push({
                     id: m * 60 * 1000,
                     text: Format.value(today + time, format || "datetime;HHmm"),
                  });
               }
               let stepMs = step * 60 * 1000;
               return (
                  <cx>
                     <DataProxy data={{ $value: value }} immutable>
                        <DataProxy
                           data={{
                              $selection: {
                                 get: ({ $value }) => {
                                    if ($value == null) return null;
                                    let selectionDate = new Date($value);
                                    let selectionTime = selectionDate.valueOf() - zeroTime(selectionDate).valueOf();
                                    return (Math.round(selectionTime / stepMs) * stepMs) % 86400000;
                                 },
                                 set: (value, instance) => {
                                    let { store } = instance;
                                    let $value = store.get("$value");
                                    let copy = $value ? new Date($value) : new Date();
                                    let today = zeroTime(new Date()).valueOf();
                                    let date = new Date(today + value);
                                    copy.setHours(date.getHours());
                                    copy.setMinutes(date.getMinutes());
                                    copy.setSeconds(date.getSeconds());
                                    copy.setMilliseconds(0);
                                    let encode = encoding || Culture.getDefaultDateEncoding();
                                    store.set("$value", encode(copy));
                                 },
                              },
                           }}
                        >
                           <List
                              records={times}
                              recordAlias="$time"
                              selection={{
                                 type: KeySelection,
                                 selection: { bind: "$selection" },
                              }}
                              {...props}
                              onItemClick={(e, instance) => {
                                 if (!onSelect) return;
                                 if (isString(onSelect)) instance.invokeControllerMethod(onSelect, e, instance);
                                 else if (isFunction(onSelect)) onSelect(e, instance);
                              }}
                           >
                              <div text-bind="$time.text" />
                           </List>
                        </DataProxy>
                     </DataProxy>
                  </cx>
               );
            }}
         />
      </cx>
   );
});
