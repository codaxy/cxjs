// Loads the pages of records of an infinite grid with onFetchRecords as the grid is scrolled.
import { debounce } from "../../util/debounce";
import { isNumber } from "../../util/isNumber";
import type { GridComponent } from "./GridComponent";

export class GridPageLoader {
   declare grid: GridComponent;
   declare loading?: boolean;
   declare loadPageRange?: any;
   declare prevFetchRecordsState?: any;
   declare loadingStartPage?: number;
   declare loadingEndPage?: number;

   constructor(grid: GridComponent) {
      this.grid = grid;
   }

   /** Loads the pages that hold the given range of records, unless they are loaded or being loaded. */
   ensureData(visibleStart: number, visibleEnd: number) {
      if (this.loading) return;

      let { instance } = this.grid.props;
      let { widget } = instance;
      let { pageSize } = widget;

      let startPage = Math.trunc(visibleStart / pageSize) + 1,
         endPage = Math.trunc((visibleEnd - 1) / pageSize) + 1;

      //debouncing restricts excessive page loading on fast scrolling as rendering data is
      //useless because visible region is scrolled away before data appears
      //the user should spent some time on the page before loading it

      if (!this.loadPageRange)
         this.loadPageRange = debounce((startPage, endPage) => {
            let { data } = this.grid.props;
            let { records, offset } = data;
            let promises = [];

            for (let page = startPage; page <= endPage; page++) {
               let s = (page - 1) * pageSize,
                  e = s + pageSize;
               if (s >= offset && e <= offset + records.length) {
                  promises.push(Promise.resolve(records.slice(s - offset, e - offset)));
               } else {
                  let result = instance.invoke(
                     "onFetchRecords",
                     {
                        page,
                        pageSize,
                        sorters: data.sorters,
                        sortField: data.sortField,
                        sortDirection: data.sortDirection,
                        filterParams: data.filterParams,
                        state: this.prevFetchRecordsState,
                     },
                     instance,
                  );
                  promises.push(Promise.resolve(result));
               }
            }

            this.loading = true;

            Promise.all(promises)
               .then((pageRecords) => {
                  this.loading = false;
                  let records: any[] = [];
                  let totalRecordCount: number | undefined;
                  let lastPage: boolean | undefined;

                  pageRecords.forEach((page) => {
                     if (Array.isArray(page)) {
                        records.push(...page);
                        lastPage = records.length < pageSize;
                     } else {
                        if (!Array.isArray(page.records))
                           throw new Error(
                              "onFetchRecords should return an array of records or an object with results inside records property.",
                           );
                        totalRecordCount = page.totalRecordCount;
                        lastPage = page.lastPage;
                        this.prevFetchRecordsState = page.state;
                        records.push(...page.records);
                     }
                  });

                  let { data } = this.grid.props;

                  if (!isNumber(totalRecordCount)) {
                     totalRecordCount = (startPage - 1) * pageSize + records.length;
                     if (!lastPage) {
                        if (records.length == (endPage - startPage + 1) * pageSize) totalRecordCount++;
                        if (data.totalRecordCount > totalRecordCount) totalRecordCount = data.totalRecordCount;
                     }
                  }

                  instance.buffer.totalRecordCount = data.totalRecordCount = totalRecordCount;
                  instance.buffer.records = data.records = records;
                  instance.buffer.page = data.page = startPage;
                  data.offset = (startPage - 1) * pageSize;
                  data.empty = totalRecordCount == 0;

                  instance.store.silently(() => {
                     instance.set("records", records);
                     instance.set("page", startPage);
                     instance.set("totalRecordCount", totalRecordCount);
                  });

                  let stateChanges: any = {
                     startPage,
                     endPage,
                  };

                  if (this.grid.state.end == 0) stateChanges.end = Math.min(widget.bufferSize!, totalRecordCount!);

                  this.grid.setState(stateChanges, () => {
                     this.loadingStartPage = startPage;
                     this.loadingEndPage = endPage;
                     this.grid.onScroll();
                  });
               })
               .catch((error) => {
                  this.loading = false;
                  if (widget.onLoadingError) instance.invoke("onLoadingError", error, instance);
               });
         }, 30);

      if (startPage < this.loadingStartPage! || endPage > this.loadingEndPage!) {
         this.loadingStartPage = startPage;
         this.loadingEndPage = endPage;
         this.loadPageRange(startPage, endPage);
      }
   }

   /** Forgets the loaded pages, e.g. when the sorting or filtering of the grid changes. */
   reset() {
      let { instance, data } = this.grid.props;
      this.loadingStartPage = 0;
      this.loadingEndPage = 0;
      instance.buffer.records = data.records = [];
      instance.buffer.totalRecordCount = 0;
      instance.buffer.page = 1;
      this.prevFetchRecordsState = null;
      this.loading = false;
   }
}
