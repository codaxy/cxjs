# Implementation Plan: Right-Hand-Side (RHS) Fixed Columns

Branch: `feat/grid-right-fixed-columns`
Target file: `packages/cx/src/widgets/grid/Grid.tsx` (+ `Grid.scss`)

## Goal

Allow grid columns to be frozen to the **right** edge of the scroll area, in
addition to the existing left freezing — and support **mixed** layouts where
some columns are frozen left, some scroll, and some are frozen right:

```
[ L L ] [ s s s s s s …scroll… ] [ R R ]
 left      scrolling columns      right
fixed                             fixed
```

## Will it handle a mix of LHS + RHS?

**Yes — that is the core design goal.** Today `fixed` is a *binary* flag and
every render/sizing path does a two-way split (`Boolean(data.fixed) != fixedColumns`).
The plan replaces that with a **three-way classifier** (`left` / `scrolling` /
`right`). Because each column is independently assigned to exactly one of three
buckets, a grid can have any combination — left-only (back-compat), right-only,
or both at once. The left and right frozen blocks are independent flex children
on either side of the scrolling area, each with its own table + sync machinery.

### Column ordering constraint

Like today (where left-fixed columns must be authored leftmost), the buckets are
filled by flag **in natural column order**, with no reordering. So the expected
authoring order is:

```
[ all left-fixed columns ] [ all scrolling columns ] [ all right-fixed columns ]
```

A left-fixed column authored after a scrolling column will still be pulled into
the left block (matches current behavior), but visually that's confusing. We add
a dev-mode warning if a `fixed:"left"` column appears after a scrolling column,
or a `fixed:"right"` column appears before one.

---

## Current architecture (left-only)

- Scrollable grid root is `display:flex; flex-direction:row` (`Grid.scss:58`).
  Children rendered in order: `fixedColumnsContent` (left), then `content`
  (main scroll-area, `flex:1`) — `Grid.tsx:2576`.
- `exploreCleanup` counts a single `fixedColumnCount` / `hasFixedColumns`
  (`Grid.tsx:1043`).
- Columns are split into two tables by the binary test
  `Boolean(x.data.fixed) != fixedColumns`, repeated in: header (`1267`),
  rows (`2106`), group footer / footer (`1545`, `1642`), and the per-record
  `fixedVdom` builds (`1752`, `1769`, `1788`, `1832`).
- The left frozen table lives in its own scroller (`fixedScroller` /
  `fixed-scroll-area`) with overlays `fixedColumnsFixedHeader` /
  `fixedColumnsFixedFooter`.
- Vertical scroll synced main→fixed (`scrollTop`, `2730`) + a non-passive wheel
  handler `onFixedColumnsWheel` (`2763`).
- `componentDidUpdate` (`~3160-3313`) copies cell sizes / row heights between the
  main table and the frozen table and positions the overlays.
- A "dummy" header `<th>` and the `scrollColumnEl` spacer (width = scrollbar
  width) compensate for the main scroll area's vertical scrollbar (`1394`,
  `3180`, `3236`).

---

## Design

### 1. Prop model (back-compatible)

Change `fixed` from boolean to a union: `true | false | "left" | "right"`, where
`true` ≡ `"left"`.

Introduce a normalized internal field on the column data, e.g.
`freeze: "left" | "right" | null`, computed once during prepare/explore so the
hot render paths compare a string instead of re-deriving.

- `Grid.tsx:216` — `fixed?: BooleanProp` → `fixed?: Prop<boolean | "left" | "right">`
- `Grid.tsx:3937, 4082` (GridColumn / header configs) — same.
- `Grid.tsx:3982, 4108` defaults — add `freeze` default.
- `Grid.tsx:4129` `GridColumnHeaderCell.prototype.fixed = false`.
- Update `.d.ts` exports.

Normalization helper:
```
function normalizeFreeze(fixed) {
  if (fixed === "right") return "right";
  if (fixed === true || fixed === "left") return "left";
  return null;
}
```

### 2. Column classification — `exploreCleanup` (`Grid.tsx:1043`)

Replace single counter with three:
```
instance.fixedLeftColumnCount   = …
instance.fixedRightColumnCount  = …
instance.fixedColumnCount       = left + right   // keep for back-compat math
instance.hasFixedColumns        = (left + right) > 0
instance.hasLeftFixedColumns    = left > 0
instance.hasRightFixedColumns   = right > 0
```
Add CSS state classes `fixed-columns`, `fixed-columns-left`,
`fixed-columns-right`.

### 3. Generalize the split predicate

Every `Boolean(x.data.fixed) != fixedColumns` becomes a comparison against a
`region` argument that is one of `"left" | "scrolling" | "right"`:

```
function cellRegion(data) { return data.freeze ?? "scrolling"; }
// keep cell when: cellRegion(data) === region
```

Thread a `region` param (replacing the boolean `fixedColumns`) through:
- `renderHeader` (`1244`) — signature `(…, region)`; predicate at `1267`;
  dummy-spacer logic at `1394` only for `region==="scrolling"` **left** side;
  see §7 for the RHS scrollbar nuance.
- `renderRow` factory (`2055`/`2106`).
- group footer / footer renderers (`1514`/`1545`, `1625`/`1642`, `1702` corner).
- `renderGroupHeader`/`renderGroupFooter`/`renderFixedFooter` fixedVdom builds
  (`1752`, `1769`, `1788`, `1804-1838`).

Keep a thin back-compat boolean wrapper so existing call sites that pass
`fixed/fixedColumns` still resolve (or update all call sites — there are ~10).

### 4. Render output — add a right block

In `renderChildren`/main render (`~2189-2581`):
- Build `fixedLeftColumnsContent` (existing, renamed from `fixedColumnsContent`)
  and a parallel `fixedRightColumnsContent`.
- Per-record, build `fixedLeftChildren` and `fixedRightChildren`
  (rename `fixedChildren`; add the right twin everywhere it's pushed:
  `2207`, `2277`, `2308`, `2375`, `2437`).
- Right block JSX mirrors the left `fixed-scroll-area` / `fixed-table-wrapper`
  with refs `fixedRightTable` / `fixedRightScroller` and overlays
  `fixedRightColumnsFixedHeader` / `fixedRightColumnsFixedFooter`.
- Root render order (`2576`): `[fixedLeft] [content] [fixedRight]`. Because the
  root is `flex-direction:row`, the right block naturally sits last; ensure it
  has `flex: 0 0 auto`.

Header/footer props passed into `GridComponent` (`1119-1133`) gain right-side
counterparts: `fixedRightColumnsHeader`, `fixedRightColumnsFixedHeader`,
`fixedRightColumnsFixedFooter`.

### 5. DOM refs

Add to `this.dom`: `fixedRightTable`, `fixedRightScroller`,
`fixedRightColumnsFixedHeader`, `fixedRightColumnsFixedFooter`
(`Grid.tsx:1945-1950` typedef + ref callbacks). Add `fixedRightScrollerRef`.

### 6. Scroll sync + wheel

- Vertical sync (`onScroll`, `2722-2731`): also set
  `fixedRightScroller.scrollTop = scroller.scrollTop`.
- Wheel handler `onFixedColumnsWheel` (`2763`) + add/remove listeners
  (`2793`, `3073`): bind for the right scroller too.

### 7. Sizing in `componentDidUpdate` (`~3160-3313`)

Duplicate the frozen-table block for the right table:
- `syncHeaderHeights(table, fixedRightTable)` (`3167`).
- `copyCellSize` / `copyCellSizePrecise` for the right fixed header
  (`3173-3210`) and right fixed footer (`3212-3247`).
- `fixedRightTable.style.marginTop/Bottom = table.style.…` (`3310`).
- Position right overlays with `left:auto; right:0` and
  `width = fixedRightScroller.offsetWidth` (mirror of `3194-3197`,
  using `right` anchoring instead of `left`).

**Scrollbar nuance (the one place RHS ≠ mirror of LHS):** the main scroll
area's vertical scrollbar sits on its right edge — i.e. *between* the scrolling
columns and the right frozen block. Decisions:
- The "dummy" `<th>` + `scrollColumnEl` spacer (`1394`, `3180`, `3236`) that
  reserves scrollbar width stays attached to the **scrolling** header/footer's
  trailing edge (unchanged) — it correctly pushes the right frozen block clear
  of the scrollbar. No spacer is added to the right frozen table itself.
- Verify on overlay-scrollbar platforms (macOS) and classic-scrollbar
  (Windows) that the right block aligns flush; `this.scrollWidth` already
  measures the gutter.

### 8. CSS (`Grid.scss`)

Add right-side twins of the four left classes, anchored right with
`border-left` instead of `border-right`:
- `…-fixed-scroll-area` → add `…-fixed-right-scroll-area`
  (`border-left-style/width` instead of right; `584-605`).
- `…-fixed-fixed-header` → `…-fixed-right-fixed-header`
  (`right:0; left:auto; border-left`; `207-220`).
- `…-fixed-fixed-footer` → `…-fixed-right-fixed-footer` (`236-249`).
- Ensure right block is `flex: 0 0 auto` and the left one too (currently the
  left one isn't `flex:1`, so it's already shrink-to-fit — confirm).

### 9. Ancillary interaction logic

- **Column drag/drop** insertion index uses `fixedColumnCount + index`
  (`2903`). With a right block, dropping should be clamped to the scrolling
  region; compute insertion against `fixedLeftColumnCount` and forbid drops
  that cross into either frozen region (or allow, re-tagging `freeze`). MVP:
  disallow reordering into/out of frozen regions; document.
- **Cursor cell navigation** uses `cursorCellIndex >= fixedColumnCount` to pick
  the table to scroll into view (`3477-3485`). Since `visibleColumns` is the
  full ordered list, left indices `[0, L)`, scrolling `[L, N-R)`, right
  `[N-R, N)`. Update: cells in the right range belong to `fixedRightTable` and
  need no horizontal scroll-into-view (they're frozen).

### 10. Types & docs

- `Grid.d.ts` / config `.d.ts`: widen `fixed`.
- `docs/content/widgets/Grid*` + a gallery/litmus example showing mixed L/R.

---

## Touch list (quick reference)

| Area | Lines (approx) |
|---|---|
| `fixed` prop type | 216, 3937, 3982, 4082, 4108, 4129 |
| classify columns | 1043-1056 |
| header render + predicate + dummy | 1244-1411 |
| row render + predicate | 2055-2161 |
| footer / group footer / corner | 1514-1706, 1804-1838 |
| fixedVdom builds | 1724-1800 |
| GridComponent props | 1119-1133, 1915-1950 |
| render output (left+right blocks) | 2189-2581 |
| refs | 1945-1962, 2008-2010 |
| scroll/wheel sync | 2722-2795, 3073 |
| sizing in didUpdate | 3160-3313 |
| drag-drop / cursor | 2903, 3477-3485 |
| CSS | Grid.scss 58-108, 207-249, 584-605 |

## Effort & risk

- **~3-5 focused days.** No new algorithm; the bulk is the three-way refactor
  and duplicating the `componentDidUpdate` sizing block + CSS.
- **Risk areas to test in combination:** fixed header **and** fixed footer
  together; grouping with group headers/footers; `buffered` + `infinite`;
  `resizable` columns (width copy); cell editing (cursor across regions);
  the scrollbar gutter alignment on Win vs mac; RTL (`right`/`left` swap).

## Rollout

1. Prop normalization + classification + dev warnings (no visual change yet).
2. Three-way predicate refactor behind the existing left rendering (regression-
   safe: right bucket empty → identical output).
3. Add right block render + refs + CSS.
4. Add right sync + sizing.
5. Ancillary (drag/drop, cursor), docs, examples.

Each step is independently testable; steps 1-2 must not change current behavior.
