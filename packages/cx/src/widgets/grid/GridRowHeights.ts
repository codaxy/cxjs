// Heights of the rows of a buffered grid with measureRowHeights, measured as the rows are rendered, and estimates
// of the heights of the rows that are not rendered.
import { Console } from "../../util/Console";
import { AvgHeight } from "./AvgHeight";
import type { MappedGridRecord } from "./Grid.types";

export class GridRowHeights {
   declare rowHeights?: Record<string, number>;
   declare heightStats?: AvgHeight;

   /** Records the heights of the rows rendered in the table. */
   record(table: HTMLElement) {
      if (!this.rowHeights) this.rowHeights = {};
      if (!this.heightStats) this.heightStats = new AvgHeight();
      for (let i = 0; i < table.children.length; i++) {
         let body = table.children[i] as HTMLElement;
         if (body.dataset.recordKey != null) {
            if (!(body.dataset.recordKey in this.rowHeights)) this.heightStats.add("data", body.offsetHeight);
            this.rowHeights[body.dataset.recordKey] = body.offsetHeight;
         } else if (body.dataset.groupKey) {
            let key = body.dataset.groupElement + "-" + body.dataset.groupKey;
            this.rowHeights[key] = body.offsetHeight;
            if (!(body.dataset.recordKey! in this.rowHeights))
               this.heightStats.add(body.dataset.groupElement!, body.offsetHeight);
         }
      }
   }

   estimateHeight(
      records: MappedGridRecord[],
      start: number,
      end: number,
      breakCondition?: (index: number, totalHeight: number) => boolean,
   ) {
      let avgDataRowHeight = this.heightStats!.estimate("data") ?? 0;
      let totalHeight = 0;
      for (let i = start; i < end; i++) {
         let record = records[i];
         switch (record.type) {
            case "data":
               if (record.key in this.rowHeights!) totalHeight += this.rowHeights![record.key];
               else totalHeight += avgDataRowHeight;
               break;

            case "group-header":
               if (record.grouping.showCaption) {
                  let captionKey = "group-caption-" + record.level;
                  if (`${captionKey}-${record.group.$key}` in this.rowHeights!)
                     totalHeight += this.rowHeights![`${captionKey}-${record.group.$key}`];
                  else totalHeight += this.heightStats!.estimate(captionKey) ?? avgDataRowHeight;
               }
               break;

            case "group-footer":
               if (record.grouping.showFooter) {
                  let captionKey = "group-footer-" + record.level;
                  if (`${captionKey}-${record.group.$key}` in this.rowHeights!)
                     totalHeight += this.rowHeights![`${captionKey}-${record.group.$key}`];
                  else totalHeight += this.heightStats!.estimate(captionKey) ?? avgDataRowHeight;
               }
               break;

            default:
               Console.warn("UNPROCESSED RECORD TYPE", record);
               break;
         }

         if (breakCondition && breakCondition(i, totalHeight) === false) break;
      }
      return totalHeight;
   }

   estimateStart(records: MappedGridRecord[], height: number) {
      let start = 0;
      if (height == 0) return 0;
      this.estimateHeight(records, 0, records.length, (index, h) => {
         start = index;
         return h < height;
      });
      return start;
   }
}
