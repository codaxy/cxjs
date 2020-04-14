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
                  let time = today + m * 60 * 1000;
                  times.push({
                     id: time,
                     text: Format.value(time, format || "datetime;HHmm"),
                  });
               }
               return (
                  <cx>
                     <DataProxy data={{ $selection: value }}>
                        <List
                           records={times}
                           recordAlias="$time"
                           onItemClick={(e, instance) => {
                              let { store } = instance;
                              let value = store.get("$time.id");
                              let selection = store.get("$selection");
                              let copy = selection ? new Date(selection) : new Date();
                              let date = new Date(value);
                              copy.setHours(date.getHours());
                              copy.setMinutes(date.getMinutes());
                              copy.setSeconds(date.getSeconds());
                              copy.setMilliseconds(0);
                              let encode = encoding || Culture.getDefaultDateEncoding();
                              store.set("$selection", encode(copy));
                              if (onSelect) {
                                 if (isString(onSelect)) instance.invokeControllerMethod(onSelect, copy, instance);
                                 else if (isFunction(onSelect)) onSelect(e, instance, copy);
                              }
                              return false;
                           }}
                           selection={{
                              type: KeySelection,
                              selection: { bind: "$selection" },
                              getIsSelectedDelegate(store) {
                                 let selection = store.get("$selection");
                                 if (!selection) return () => false;
                                 let selectionTime = new Date(selection).valueOf();
                                 return (record) => record.id % 86400000 == selectionTime % 86400000;
                              },
                           }}
                           {...props}
                        >
                           <div text-bind="$time.text" />
                        </List>
                     </DataProxy>
                  </cx>
               );
            }}
         />
      </cx>
   );
});
