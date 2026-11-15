// Grid renders fixed headers, footers and columns as separate tables over the main table. These functions copy the
// cell sizes measured in one table to the cells of another, so that their columns and rows line up.

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
