import { computable } from "cx/ui";
import { Grid, PureContainer } from "cx/widgets";

// Repro for grid sorting issues with columns that define `value` (tpl/expr/computable)
// but no `field`.
//
// Grid 1 (no sortField/sortDirection bindings):
//   - Sorting by "Full Name" / "Total" works (comparer falls back to `value`),
//     BUT the sorted icon/highlight appears on BOTH field-less columns at once,
//     because the header compares `sorters[0].field == column.field`
//     and `undefined == undefined` matches every field-less column.
//
// Grid 2 (sortField-bind + sortDirection-bind set on the grid):
//   - CRASH on first render if the bound values are initially undefined:
//     prepareData creates a sorter { field: undefined, direction: undefined },
//     renderHeader matches it against field-less columns (undefined == undefined)
//     and calls direction.toLowerCase() -> TypeError. Set $page.sortField to
//     undefined in the controller below to reproduce.
//   - With initialized bindings, clicking "Full Name" or "Total" does NOT sort.
//     prepareData rebuilds sorters as { field: data.sortField, direction } which
//     drops the captured `value`, and the fix-up loop can only re-attach it by
//     matching a column with the same `field` — impossible when there is none.
//     Worse, the click clears the sortField binding and merely toggles the
//     direction of the previous sort (onHeaderClick falls back to data.sortField
//     when the column has no field, so it always "matches" the current sorter).
//
// Grid 3 (precedence — sort key is picked as sortValue > sortField > value > field):
//   - "Priority (field + value)" sorts by the DISPLAYED label (P1, P10, P2):
//     the displayed `value` takes precedence over `field`.
//   - "Priority (sortField + value)" sorts by the NUMERIC field (P1, P2, P10):
//     an explicit `sortField` takes precedence over the displayed `value`.
//   - "Priority (sortValue)" sorts by the negated priority (P10, P2, P1 on ASC):
//     `sortValue` takes precedence over everything else.
// Covered by unit tests in packages/cx/src/widgets/grid/Grid.sorting.spec.tsx.

let records = [
   { id: 1, firstName: "Ann", lastName: "Zimmer", q1: 5, q2: 40, priority: 2 },
   { id: 2, firstName: "Bob", lastName: "Young", q1: 30, q2: 1, priority: 10 },
   { id: 3, firstName: "Cid", lastName: "Xavier", q1: 10, q2: 10, priority: 1 },
   { id: 4, firstName: "Dan", lastName: "Waters", q1: 1, q2: 2, priority: 10 },
   { id: 5, firstName: "Eva", lastName: "Vance", q1: 20, q2: 30, priority: 2 },
];

const valueOnlyColumns = [
   { header: "Id", field: "id", sortable: true },
   {
      header: "Full Name (tpl value, no field)",
      value: { tpl: "{$record.firstName} {$record.lastName}" },
      sortable: true,
   },
   {
      header: "Total (computable, no field)",
      value: computable("$record.q1", "$record.q2", (q1, q2) => q1 + q2),
      align: "right",
      sortable: true,
   },
];

export default () => (
   <cx>
      <PureContainer
         controller={{
            onInit() {
               this.store.init("$page.records", records);

               // With these two lines commented out, grid 2 CRASHES the whole page
               // on first render (direction.toLowerCase() on undefined).
               this.store.init("$page.sortField", "id");
               this.store.init("$page.sortDirection", "ASC");
            },
         }}
      >
         <div style="padding: 20px; display: flex; flex-direction: column; gap: 30px">
            <div>
               <h4>1. Plain header-click sorting (no bindings)</h4>
               <p>
                  Sorting by value-only columns works, but the sort icon lights up on <b>both</b> value-only columns
                  at the same time.
               </p>
               <Grid records-bind="$page.records" columns={valueOnlyColumns} />
            </div>

            <div>
               <h4>2. Same grid with sortField/sortDirection bindings</h4>
               <p>
                  Clicking "Full Name" or "Total" does <b>not</b> sort — the sorter loses its <code>value</code> in
                  prepareData. Sorting by "Id" works. If the bindings are initially undefined (see controller), the
                  grid <b>crashes</b> on first render.
               </p>
               <Grid
                  records-bind="$page.records"
                  columns={valueOnlyColumns}
                  sortField-bind="$page.sortField"
                  sortDirection-bind="$page.sortDirection"
               />
               <div text-tpl="sortField: {$page.sortField}, sortDirection: {$page.sortDirection}" />
            </div>

            <div>
               <h4>3. Precedence: sortValue &gt; sortField &gt; value &gt; field</h4>
               <p>
                  Expected on ASC: <b>field + value</b> sorts by the label (P1, P10, P2), <b>sortField + value</b> sorts
                  by the numeric field (P1, P2, P10), <b>sortValue</b> sorts by the negated priority (P10, P2, P1).
               </p>
               <Grid
                  records-bind="$page.records"
                  columns={[
                     { header: "Id", field: "id", sortable: true },
                     {
                        header: "Priority (field + value)",
                        field: "priority",
                        value: { tpl: "P{$record.priority}" },
                        sortable: true,
                     },
                     {
                        header: "Priority (sortField + value)",
                        sortField: "priority",
                        value: { tpl: "P{$record.priority}" },
                        sortable: true,
                     },
                     {
                        header: "Priority (sortValue)",
                        sortField: "priority",
                        sortValue: computable("$record.priority", (p) => -p),
                        value: { tpl: "P{$record.priority}" },
                        sortable: true,
                     },
                  ]}
               />
            </div>
         </div>
      </PureContainer>
   </cx>
);
