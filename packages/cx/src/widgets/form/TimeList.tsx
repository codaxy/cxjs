/** @jsxImportSource react */
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
import { bind } from "../../ui/bind";
import { Widget } from "../../ui/Widget";
import type { Instance } from "../../ui/Instance";

interface TimeListProps {
   value?: unknown;
   step?: number;
   format?: string;
   encoding?: (date: Date) => unknown;
   onSelect?: string | ((e: React.MouseEvent, instance: Instance, date: Date) => void);
   [key: string]: unknown;
}

export const TimeList = createFunctionalComponent(({ value, step, format, encoding, onSelect, ...props }: TimeListProps) => {
   return Widget.create({
      type: ContentResolver,
      params: { step, format, dummy: true },
      onResolve: ({ step, format }: { step?: number; format?: string }) => {
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
         return Widget.create({
            type: DataProxy,
            data: { $value: value },
            immutable: true,
            children: Widget.create({
               type: DataProxy,
               data: {
                  $selection: {
                     get: ({ $value }: { $value?: unknown }) => {
                        if ($value == null) return null;
                        let selectionDate = new Date($value as any);
                        let selectionTime = selectionDate.valueOf() - zeroTime(selectionDate).valueOf();
                        return (Math.round(selectionTime / stepMs) * stepMs) % 86400000;
                     },
                     set: (value: unknown, instance: Instance) => {
                        let { store } = instance;
                        let $value = store.get("$value");
                        let copy = $value ? new Date($value as any) : new Date();
                        let today = zeroTime(new Date()).valueOf();
                        let date = new Date(today + (value as number));
                        copy.setHours(date.getHours());
                        copy.setMinutes(date.getMinutes());
                        copy.setSeconds(date.getSeconds());
                        copy.setMilliseconds(0);
                        let encode = encoding || Culture.getDefaultDateEncoding();
                        store.set("$value", encode(copy));
                     },
                  },
               },
               children: Widget.create({
                  type: List,
                  records: times,
                  recordAlias: "$time",
                  selection: {
                     type: KeySelection,
                     selection: { bind: "$selection" },
                  },
                  ...props,
                  onItemClick: (e: React.MouseEvent, instance: Instance) => {
                     if (!onSelect) return;
                     let date = new Date(instance.store.get('$value') as any);
                     if (isString(onSelect)) instance.invokeControllerMethod(onSelect, e, instance, date);
                     else if (isFunction(onSelect)) onSelect(e, instance, date);
                  },
                  children: Widget.create("div", { text: bind("$time.text") }),
               }),
            }),
         });
      },
   });
});
