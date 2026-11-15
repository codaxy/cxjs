// Grid renders fixed headers, footers and columns as separate tables over the main table. These functions copy the
// cell sizes measured in one table to the cells of another, so that their columns and rows line up, and size and
// position the fixed tables.
import type { GridDom } from "./Grid.types";

export function copyCellSize(
   srcTableBody: HTMLTableSectionElement,
   dstTableBody: HTMLTableSectionElement,
   applyHeight = true,
) {
   if (!srcTableBody || !dstTableBody) return false;

   let changed = false;
   for (let r = 0; r < dstTableBody.children.length && r < srcTableBody.children.length; r++) {
      let sr = srcTableBody.children[r];
      let dr = dstTableBody.children[r];
      for (let c = 0; c < dr.children.length && c < sr.children.length; c++) {
         let dc = dr.children[c] as HTMLElement;
         let sc = sr.children[c] as HTMLElement;
         let ws = `${sc.offsetWidth}px`;
         if (!changed && dc.style.width != ws) changed = true;
         dc.style.width = dc.style.minWidth = dc.style.maxWidth = ws;
         if (applyHeight) dc.style.height = `${sc.offsetHeight}px`;
      }
   }
   return changed;
}

export function copyCellSizePrecise(
   srcTableBody: HTMLTableSectionElement,
   dstTableBody: HTMLTableSectionElement,
   applyHeight = true,
) {
   if (!srcTableBody || !dstTableBody) return false;
   let changed = false;
   for (let r = 0; r < dstTableBody.children.length && r < srcTableBody.children.length; r++) {
      let sr = srcTableBody.children[r];
      let dr = dstTableBody.children[r];
      for (let c = 0; c < dr.children.length && c < sr.children.length; c++) {
         let dc = dr.children[c] as HTMLElement;
         let sc = sr.children[c] as HTMLElement;
         let bounds = sc.getBoundingClientRect();
         let ws = `${bounds.width}px`;
         if (!changed && dc.style.width != ws) changed = true;
         dc.style.width = dc.style.minWidth = dc.style.maxWidth = ws;
         if (applyHeight) dc.style.height = `${bounds.height}px`;
      }
   }
   return changed;
}

export function syncHeaderHeights(header1: HTMLElement, header2: HTMLElement) {
   /**
    * In the first pass measure all row heights.
    * In the second pass apply those heights.
    * Use getBoundingClientRect() for sub-pixel accuracy.
    */

   if (!header1 || !header2) return;
   const rowCount = Math.max(header1.children.length, header2.children.length);
   let rowHeight = [];
   for (let r = 0; r < rowCount; r++) {
      rowHeight.push(0);
      let tr1 = header1.children[r];
      let tr2 = header2.children[r];
      if (tr1) {
         for (let i = 0; i < tr1.children.length; i++) {
            let td = tr1.children[i] as HTMLTableCellElement;
            let h = td.getBoundingClientRect().height;
            if (td.rowSpan == 1 && h > rowHeight[r]) {
               rowHeight[r] = h;
               break;
            }
         }
      }
      if (tr2) {
         for (let i = 0; i < tr2.children.length; i++) {
            let td = tr2.children[i] as HTMLTableCellElement;
            let h = td.getBoundingClientRect().height;
            if (td.rowSpan == 1 && h > rowHeight[r]) {
               rowHeight[r] = h;
               break;
            }
         }
      }
   }

   for (let r = 0; r < rowCount; r++) {
      let tr1 = header1.children[r];
      let tr2 = header2.children[r];
      if (tr1) {
         for (let i = 0; i < tr1.children.length; i++) {
            let td = tr1.children[i] as HTMLTableCellElement;
            let h = 0;
            for (let x = 0; x < td.rowSpan; x++) h += rowHeight[r + x];
            td.style.height = `${h}px`;
         }
      }
      if (tr2) {
         for (let i = 0; i < tr2.children.length; i++) {
            let td = tr2.children[i] as HTMLTableCellElement;
            let h = 0;
            for (let x = 0; x < td.rowSpan; x++) h += rowHeight[r + x];
            td.style.height = `${h}px`;
         }
      }
   }
}

/**
 * Keeps the header cells of the table at the widths they have now and records the widths,
 * see Grid.lockColumnWidths.
 */
export function lockColumnWidths(dom: GridDom, lockedColWidth: Record<string, number>) {
   let headerTBody = dom.table!.firstChild! as HTMLElement;
   for (let r = 0; r < headerTBody.children.length; r++) {
      let sr = headerTBody.children[r];
      for (let c = 0; c < sr.children.length; c++) {
         let cell = sr.children[c] as HTMLElement;
         cell.style.width =
            cell.style.minWidth =
            cell.style.maxWidth =
               `${(sr.children[c] as HTMLElement).offsetWidth}px`;
         cell.style.boxSizing = "border-box";
         if ((cell as HTMLElement).dataset.uniqueColId)
            lockedColWidth[(cell as HTMLElement).dataset.uniqueColId!] = (sr.children[c] as HTMLElement).offsetWidth;
      }
   }
}

/**
 * Sizes the fixed header tables to match the main table.
 * Returns the height of the header and whether its cells were resized.
 */
export function syncFixedHeaders(dom: GridDom, scrollWidth: number, preciseMeasurements: boolean) {
   let resized = false,
      headerHeight = 0;

   if (dom.fixedTable!)
      syncHeaderHeights(
         dom.table!.firstChild as HTMLTableSectionElement,
         dom.fixedTable!.firstChild as HTMLTableSectionElement,
      );

   if (dom.fixedHeader!) {
      let fixedHeaderTBody = dom.fixedHeader!.firstChild!.firstChild as HTMLTableSectionElement;

      resized = preciseMeasurements
         ? copyCellSizePrecise(dom.table!.firstChild as HTMLTableSectionElement, fixedHeaderTBody)
         : copyCellSize(dom.table!.firstChild as HTMLTableSectionElement, fixedHeaderTBody);

      let scrollColumnEl = fixedHeaderTBody?.firstChild?.lastChild as HTMLElement | null;
      if (scrollColumnEl) scrollColumnEl.style.minWidth = scrollColumnEl.style.maxWidth = scrollWidth + "px";

      dom.fixedHeader!.style.display = "block";
      headerHeight = dom.fixedHeader!.offsetHeight;
      dom.scroller!.style.marginTop = `${headerHeight}px`;
      if (dom.fixedScroller!) dom.fixedScroller!.style.marginTop = `${headerHeight}px`;
      else if (dom.fixedHeader!.style.left != null) dom.fixedHeader!.style.removeProperty("left");
   } else {
      dom.scroller!.style.removeProperty("marginTop");
      if (dom.fixedScroller!) dom.fixedScroller!.style.removeProperty("marginTop");
   }

   if (dom.fixedColumnsFixedHeader!) {
      let fixedColumnsWidth = `${dom.fixedScroller!.offsetWidth}px`;
      dom.fixedColumnsFixedHeader!.style.right = "auto";
      dom.fixedColumnsFixedHeader!.style.width = fixedColumnsWidth;
      if (dom.fixedHeader!) dom.fixedHeader!.style.left = fixedColumnsWidth;

      dom.fixedColumnsFixedHeader!.style.display = "block";

      let fixedHeaderTBody = dom.fixedColumnsFixedHeader!.firstElementChild
         ?.firstElementChild as HTMLTableSectionElement;

      if (dom.fixedTable!.firstChild) {
         resized = copyCellSize(dom.fixedTable!.firstElementChild as HTMLTableSectionElement, fixedHeaderTBody);
      }
   }

   return { resized, headerHeight };
}

/** Sizes the fixed footer tables to match the main table. Returns the height of the footer. */
export function syncFixedFooters(dom: GridDom, scrollWidth: number, fixedFooterOverlap?: boolean) {
   let footerHeight = 0;

   if (dom.fixedFooter! || dom.fixedColumnsFixedFooter!) {
      if (dom.fixedColumnsFixedFooter!) {
         let fixedColumnsWidth = `${dom.fixedScroller!.offsetWidth}px`;
         dom.fixedColumnsFixedFooter!.style.right = "auto";
         dom.fixedColumnsFixedFooter!.style.width = fixedColumnsWidth;

         let dstTableBody = dom.fixedColumnsFixedFooter!.firstElementChild
            ?.firstElementChild as HTMLTableSectionElement;
         if (dstTableBody) {
            let srcTableBody = dom.fixedTable!.lastElementChild as HTMLTableSectionElement;
            copyCellSize(srcTableBody, dstTableBody, fixedFooterOverlap);
            dom.fixedColumnsFixedFooter!.style.display = "block";
            footerHeight = dom.fixedFooter!.offsetHeight;
         }
      }

      if (dom.fixedFooter!) {
         let dstTableBody = dom.fixedFooter!.firstElementChild?.firstElementChild as HTMLTableSectionElement;

         if (dstTableBody) {
            let srcTableBody = dom.table!.lastElementChild as HTMLTableSectionElement;

            copyCellSize(srcTableBody, dstTableBody, fixedFooterOverlap);

            let scrollColumnEl = dstTableBody.firstElementChild?.lastElementChild as HTMLElement;
            if (scrollColumnEl) scrollColumnEl.style.minWidth = scrollColumnEl.style.maxWidth = scrollWidth + "px";

            dom.fixedFooter!.style.display = "block";
            footerHeight = dom.fixedFooter!.offsetHeight;
         }

         if (dom.fixedScroller!) dom.fixedFooter!.style.left = `${dom.fixedScroller!.offsetWidth}px`;
         else if (dom.fixedFooter!.style.left != null) dom.fixedFooter!.style.removeProperty("left");
      }

      dom.scroller!.style.marginBottom = `${footerHeight}px`;
      if (dom.fixedScroller!) dom.fixedScroller!.style.marginBottom = `${footerHeight}px`;
   } else {
      dom.scroller!.style.marginBottom = "0";
      if (dom.fixedScroller!) dom.fixedScroller!.style.marginBottom = "0";
   }

   return footerHeight;
}
