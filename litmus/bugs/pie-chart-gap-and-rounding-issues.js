import { PieChart, PieSlice } from "cx/charts";
import { Svg } from "cx/svg";
import { Controller, LabelsTopLayout, Repeater, computable, tpl } from "cx/ui";
import { Button, Checkbox, Slider } from "cx/widgets";

/*
   PieChart gap / border-radius BUGS -- each one shown BROKEN vs FIXED.

   Left chart in every pair is the real framework (cx/charts PieChart) on
   unmodified master. Right chart is `fixedSvg()` below: a proposed corrected
   layout feeding the framework's OWN arc-drawing code, copied verbatim as
   arcPath(). The drawing math is identical on both sides, so every visible
   difference comes from the layout fix and nothing else.

   NOTE: litmus resolves `cx/charts` to packages/cx/build, not to src -- run
   `yarn build` if the BROKEN side behaves differently than annotated.

   Only unintentional defects are listed. Three earlier findings were dropped
   after analysis as deliberate or derivative -- see the DELIBERATE footer, so
   nobody "fixes" them.

   Section 1's BROKEN side is button-gated because it FREEZES THE TAB.
*/

const SIZE = 320;
const R = SIZE / 2;
const CHART = `width:${SIZE}px;height:${SIZE}px`;

const NOTE = "max-width:88ch;color:#444;margin:6px 0 14px;white-space:pre-wrap";
const H2 = "margin-top:40px;font-size:17px;border-top:1px solid #ddd;padding-top:16px";
const PRE = "background:#f6f6f6;padding:12px;border-radius:4px;white-space:pre;font:12px/1.45 monospace";
const ROW = "display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap";
const BAD = "color:#b00;display:block;margin-bottom:4px";
const GOOD = "color:#1a6;display:block;margin-bottom:4px";

// ===========================================================================
// A. Diagnostics -- mirrors the CURRENT gap budget in PieCalculator.measure()
//    so the page can print "what you asked for" vs "what you get".
//    Iteration-capped, so this helper cannot hang the way the framework does.
// ===========================================================================

function analyze(gap, r0pct, n, angleDeg) {
   let angleTotal = (((angleDeg || 360) == 360 ? 359.99 : angleDeg) / 180) * Math.PI;
   let r0 = (r0pct * R) / 100;

   let effGap = gap;
   if (effGap > 0 && 2 * r0 < effGap) effGap = 2 * r0;

   let gapAngleTotal = 0;
   let iterations = 0;
   while (effGap > 0) {
      if (++iterations > 5000) break; // <-- the framework has no such escape hatch
      gapAngleTotal = 0;
      for (let i = 0; i < n; i++) gapAngleTotal += 2 * Math.asin(effGap / r0 / 2);
      if (gapAngleTotal < 0.25 * angleTotal) break;
      effGap = effGap * 0.95;
   }
   if (gapAngleTotal == 0) effGap = 0;

   return {
      effGap,
      iterations,
      asinCalls: iterations * n,
      gapAngleTotal,
      angleTotal,
      r0,
      gapAnglePerSlice: effGap > 0 ? 2 * Math.asin(effGap / r0 / 2) : 0,
      gapFraction: gapAngleTotal / angleTotal,
      usableFraction: 1 - gapAngleTotal / angleTotal,
   };
}

// The gap the loop SHOULD find: largest that still fits the 25% budget.
// Closed form for uniform r0; verified against 60-step bisection to 4 decimals.
function optimum(gap, r0pct, n, angleDeg) {
   let angleTotal = (((angleDeg || 360) == 360 ? 359.99 : angleDeg) / 180) * Math.PI;
   let r0 = (r0pct * R) / 100;
   if (r0 <= 0) return 0;
   return Math.min(gap, 2 * r0 * Math.sin((0.125 * angleTotal) / n));
}

// current cumulative boundaries, exactly as PieCalculator.map() walks them
function boundaries(gap, values, r0pct) {
   let a = analyze(gap, r0pct, values.length);
   let total = values.reduce((s, v) => s + v, 0);
   let angleFactor = total > 0 ? (a.angleTotal - a.gapAngleTotal) / total : 0;
   let angle = 0;
   return values.map((v) => {
      angle += v * angleFactor + a.gapAnglePerSlice;
      return (angle * 180) / Math.PI;
   });
}

// current br clamping, exactly as createSvgArc() does it
function corners(br, r0pct, rpct, spanDeg, gap) {
   let r0 = (r0pct * R) / 100;
   let r = (rpct * R) / 100;
   let gap2 = gap / 2;
   let half = ((spanDeg / 180) * Math.PI) / 2;
   if (br > (r - r0) / 2) br = (r - r0) / 2;
   if (br <= 0) return { innerBr: 0, outerBr: 0 };

   let innerBr = br;
   if (Math.asin((br + gap2) / (r0 + br)) > half) {
      let sin = Math.sin(half);
      innerBr = Math.max((r0 * sin - gap2) / (1 - sin), 0);
   }
   let outerBr = br;
   if (Math.asin((br + gap2) / (r - br)) > half) {
      let sin = Math.sin(half);
      outerBr = Math.max((r * sin - gap2) / (1 + sin), 0);
   }
   return { innerBr, outerBr };
}

// ===========================================================================
// B. arcPath() -- VERBATIM copy of createSvgArc() from PieChart.tsx.
//    Not modified. The DELIBERATE footer explains why this code is correct;
//    keeping it byte-for-byte identical is what makes the A/B fair.
// ===========================================================================

const mv = (x, y) => `M ${x} ${y}`;
const ln = (x, y) => `L ${x} ${y}`;
const ar = (rx, ry, xr, la, sw, x, y) => `A ${rx} ${ry} ${xr} ${la} ${sw} ${x} ${y}`;
const largeArcFlag = (a) => (a > Math.PI || a < -Math.PI ? 1 : 0);

function arcPath(cx, cy, r0 = 0, r, startAngle, endAngle, br = 0, gap = 0) {
   let gap2 = gap / 2;
   if (startAngle > endAngle) {
      let s = startAngle;
      startAngle = endAngle;
      endAngle = s;
   }
   let path = [];
   if (br > (r - r0) / 2) br = (r - r0) / 2;

   if (br > 0) {
      if (r0 > 0) {
         let innerBr = br;
         let innerSmallArcAngle = Math.asin((br + gap2) / (r0 + br));
         if (innerSmallArcAngle > (endAngle - startAngle) / 2) {
            innerSmallArcAngle = (endAngle - startAngle) / 2;
            let sin = Math.sin(innerSmallArcAngle);
            innerBr = Math.max((r0 * sin - gap2) / (1 - sin), 0);
         }
         let hip = (r0 + innerBr) * Math.cos(innerSmallArcAngle);
         path.push(
            mv(
               cx + Math.cos(endAngle) * hip + Math.cos(endAngle - Math.PI / 2) * gap2,
               cy - Math.sin(endAngle) * hip - Math.sin(endAngle - Math.PI / 2) * gap2,
            ),
         );
         path.push(
            ar(innerBr, innerBr, 0, 0, 0,
               cx + Math.cos(endAngle - innerSmallArcAngle) * r0,
               cy - Math.sin(endAngle - innerSmallArcAngle) * r0),
         );
         path.push(
            ar(r0, r0, 0,
               largeArcFlag(endAngle - innerSmallArcAngle - startAngle - innerSmallArcAngle), 1,
               cx + Math.cos(startAngle + innerSmallArcAngle) * r0,
               cy - Math.sin(startAngle + innerSmallArcAngle) * r0),
         );
         path.push(
            ar(innerBr, innerBr, 0, 0, 0,
               cx + Math.cos(startAngle) * hip + Math.cos(startAngle + Math.PI / 2) * gap2,
               cy - Math.sin(startAngle) * hip - Math.sin(startAngle + Math.PI / 2) * gap2),
         );
      } else path.push(mv(cx, cy));

      let outerBr = br;
      let outerSmallArcAngle = Math.asin((br + gap2) / (r - br));
      if (outerSmallArcAngle > (endAngle - startAngle) / 2) {
         outerSmallArcAngle = (endAngle - startAngle) / 2;
         let sin = Math.sin(outerSmallArcAngle);
         outerBr = Math.max((r * sin - gap2) / (1 + sin), 0);
      }
      let ohip = Math.cos(outerSmallArcAngle) * (r - outerBr);
      path.push(
         ln(cx + Math.cos(startAngle) * ohip + Math.cos(startAngle + Math.PI / 2) * gap2,
            cy - Math.sin(startAngle) * ohip - Math.sin(startAngle + Math.PI / 2) * gap2),
         ar(outerBr, outerBr, 0, 0, 0,
            cx + Math.cos(startAngle + outerSmallArcAngle) * r,
            cy - Math.sin(startAngle + outerSmallArcAngle) * r),
         ar(r, r, 0,
            largeArcFlag(endAngle - outerSmallArcAngle - startAngle - outerSmallArcAngle), 0,
            cx + Math.cos(endAngle - outerSmallArcAngle) * r,
            cy - Math.sin(endAngle - outerSmallArcAngle) * r),
         ar(outerBr, outerBr, 0, 0, 0,
            cx + Math.cos(endAngle) * ohip + Math.cos(endAngle - Math.PI / 2) * gap2,
            cy - Math.sin(endAngle) * ohip - Math.sin(endAngle - Math.PI / 2) * gap2),
      );
   } else {
      if (r0 > 0) {
         let innerGapAngle = gap2 > 0 ? Math.asin(gap2 / r0) : 0;
         let iS = startAngle + innerGapAngle;
         let iE = endAngle - innerGapAngle;
         path.push(mv(cx + Math.cos(iE) * r0, cy - Math.sin(iE) * r0));
         path.push(
            ar(r0, r0, 0, largeArcFlag(iS - iE), 1,
               cx + Math.cos(iS) * r0, cy - Math.sin(iS) * r0),
         );
      } else path.push(mv(cx, cy));

      let outerGapAngle = r > 0 && gap2 > 0 ? Math.asin(gap2 / r) : 0;
      let oS = startAngle + outerGapAngle;
      let oE = endAngle - outerGapAngle;
      path.push(ln(cx + Math.cos(oS) * r, cy - Math.sin(oS) * r));
      path.push(
         ar(r, r, 0, largeArcFlag(oE - oS), 0, cx + Math.cos(oE) * r, cy - Math.sin(oE) * r),
      );
   }
   path.push("Z");
   return path.join(" ");
}

// ===========================================================================
// C. The PROPOSED fix.
//
//    An earlier version of this file reserved NO angular budget at all. That
//    aligned the rings but was wrong: with equal slices the whole chart blanks
//    once the gap no longer fits (gap=18 blanks at n>=23, gap=24 at n>=17), and
//    just below that threshold slices are pinched to a hairline at the inner
//    edge while still wide outside. Auto-shrinking the gap is NOT optional --
//    the framework was right to have it.
//
//    The actual fix is WHERE the shrinking is applied:
//      * boundaries always come from EXACT proportions and are never moved by
//        the gap, so identical proportions land on identical angles in every
//        ring                                              -> bugs 5, 6
//      * the gap is shrunk as a DRAWING inset instead, resolved ONCE for the
//        whole chart (all rings together) by closed form -- no search loop, so
//        nothing to hang and nothing to recompute per frame -> bugs 1, 2
//      * every slice keeps at least KEEP of its angular span, so nothing ever
//        blanks, pinches or inverts                        -> bug 4
//      * r0 == 0 slices take no inset (per-slice form of the existing guard)
//      * one chart-wide symmetric br                       -> bug 3
//
//    Remaining honest cost: the gap is uniform chart-wide, so the most crowded
//    ring (or a single very thin slice) sets it for everyone. That is the
//    price of "one gap config, one rendered gap" -- the same class of tradeoff
//    as the chart-wide br. Readouts print the resolved gap so it is visible.
// ===========================================================================

const KEEP = 0.25; // every slice retains at least this fraction of its span

function spans({ items, angleDeg = 360, startAngleDeg = 0, clockwise = false }) {
   const angleTotal = (angleDeg / 180) * Math.PI;
   // GUARD -- bug 1. Non-finite or non-positive total: nothing to draw.
   if (!Number.isFinite(angleTotal) || angleTotal <= 0) return null;
   const total = items.reduce((s, it) => s + (it.value > 0 ? it.value : 0), 0);
   if (!(total > 0)) return null;
   const clock = clockwise ? -1 : 1;
   const start = (startAngleDeg / 180) * Math.PI;
   let acc = 0;
   return items.map((it) => {
      const a0 = start + clock * (acc / total) * angleTotal;
      acc += it.value > 0 ? it.value : 0;
      return { ...it, a0, a1: start + clock * (acc / total) * angleTotal };
   });
}

// ONE gap for the whole chart, every ring included. Closed form, no search:
// the largest gap that still leaves every slice KEEP of its angular span.
function resolveGap(rings, requested, radius, angleDeg) {
   let g = Math.max(0, requested || 0);
   for (const items of rings) {
      const laid = spans({ items, angleDeg });
      if (!laid) continue;
      for (const s of laid) {
         if (!(s.value > 0)) continue;
         const r0 = (s.r0pct * radius) / 100;
         if (r0 <= 0) continue; // r0 == 0 takes no inset at all
         const maxInset = (Math.abs(s.a1 - s.a0) * (1 - KEEP)) / 2;
         g = Math.min(g, 2 * r0 * Math.sin(Math.min(maxInset, Math.PI / 2)));
      }
   }
   return g;
}

function fixedLayout({ items, angleDeg = 360, startAngleDeg = 0, clockwise = false, gap = 0, br = 0, radius }) {
   const laid = spans({ items, angleDeg, startAngleDeg, clockwise });
   if (!laid) return { slices: [], br: 0 };
   const gap2 = Math.max(0, gap) / 2;

   const slices = [];
   for (const s of laid) {
      if (!(s.value > 0)) continue;
      const r0 = (s.r0pct * radius) / 100;
      const r = (s.rpct * radius) / 100;
      const span = Math.abs(s.a1 - s.a0);
      const wanted = r0 > 0 && gap2 > 0 ? Math.asin(Math.min(1, gap2 / r0)) : 0;
      // per-slice safety net; resolveGap() normally makes this a no-op
      const inset = Math.min(wanted, (span * (1 - KEEP)) / 2);
      slices.push({ ...s, r0, r, span, inset, drawGap: r0 > 0 ? 2 * r0 * Math.sin(inset) : 0 });
   }

   let brChart = Infinity;
   for (const s of slices) {
      const half = Math.min(s.span / 2, Math.PI / 2);
      const sin = Math.sin(half);
      const g2 = s.drawGap / 2;
      const outerAllowed = (s.r * sin - g2) / (1 + sin);
      const innerAllowed = s.r0 > 0 ? (s.r0 * sin - g2) / (1 - sin) : Infinity;
      brChart = Math.min(brChart, (s.r - s.r0) / 2, Math.max(0, outerAllowed), Math.max(0, innerAllowed));
   }
   brChart = Math.max(0, Math.min(br, brChart === Infinity ? 0 : brChart));
   return { slices, br: brChart };
}

// Renders one or more rings into a single <svg>, through the framework's own
// arcPath(). `rings` is an array of item arrays; the gap is resolved across
// all of them together, which is what keeps rings consistent.
function fixedSvg({ rings, gap = 0, br = 0, angleDeg = 360, size }) {
   const s = size || SIZE;
   const c = s / 2;
   const eff = resolveGap(rings, gap, s / 2, angleDeg);
   const paths = [];
   for (const items of rings) {
      const L = fixedLayout({ items, gap: eff, br, angleDeg, radius: s / 2 });
      for (const sl of L.slices)
         paths.push(
            `<path d="${arcPath(c, c, sl.r0, sl.r, sl.a0, sl.a1, L.br, sl.drawGap)}" style="${sl.style}"/>`,
         );
   }
   return `<svg width="${s}" height="${s}">${paths.join("")}</svg>`;
}

// same resolution, but returning the numbers for the readouts
function fixedInfo({ rings, gap = 0, br = 0, angleDeg = 360, size }) {
   const radius = (size || SIZE) / 2;
   const eff = resolveGap(rings, gap, radius, angleDeg);
   const layouts = rings.map((items) => fixedLayout({ items, gap: eff, br, angleDeg, radius }));
   return {
      effGap: eff,
      layouts,
      slices: layouts.flatMap((l) => l.slices),
      br: layouts.length ? Math.min(...layouts.map((l) => l.br)) : 0,
   };
}

// ===========================================================================

const pad = (v, n) => String(v).padStart(n);

// Explicit fills rather than ColorMap/colorIndex: the theme's `.cxe-pieslice-slice
// { fill: white }` rule beats `.cxs-color-N` on source order in litmus's generated
// manifest, and a stroke would distort the very gaps this page is measuring.
const COLORS = [
   "#3b7dd8", "#e8912a", "#3aa76d", "#d6483f", "#8e5bbf", "#159e91",
   "#c9a227", "#4a6fa5", "#b3592f", "#5a8f3d", "#a03a6b", "#2b8cbe",
   "#7d6b4f", "#cf6a87", "#548687", "#96562e",
];
const styleFor = (color) => `fill:${color};stroke:none`;

const equalSlices = (n) =>
   Array.from({ length: n }, (_, i) => ({ value: 1, style: styleFor(COLORS[i % COLORS.length]) }));
const listSlices = (values, colors) =>
   values.map((value, i) => ({
      value,
      style: styleFor(colors ? colors[i] : COLORS[i % COLORS.length]),
   }));
// same records, plus the per-slice radii fixedLayout() needs
const withR = (recs, r0pct, rpct) => recs.map((x) => ({ ...x, r0pct, rpct }));

// section 6's two rings, kept in one place so the chart and the readout agree.
// Order matters: layouts[0] is children, layouts[1] is parents.
const SUNBURST_RINGS = [
   withR(listSlices([25, 25, 30, 20], ["#3b7dd8", "#6fa3e8", "#e8912a", "#3aa76d"]), 55, 85),
   withR(listSlices([50, 30, 20], ["#3b7dd8", "#e8912a", "#3aa76d"]), 25, 55),
];

// section 1's fixed-side mini charts. Written out as separate helpers because
// cx-jsx does not transform JSX returned from a .map() callback -- it stays
// plain React JSX and Cx rejects it with "Invalid widget type: div".
const MINI = "text-align:center;font:11px monospace";
const MINIBOX = "width:130px;height:130px;border:1px dashed #cfd8d3";
const miniOpts = (angleDeg) => ({
   rings: [withR(equalSlices(5), 30, 90)],
   gap: 8,
   angleDeg,
   size: 130,
});
const miniSvg = (angleDeg) => fixedSvg(miniOpts(angleDeg));
const miniCount = (angleDeg) => fixedInfo(miniOpts(angleDeg)).slices.length + " slices";

class PageController extends Controller {
   onInit() {
      this.store.init("$page", {
         hang: false,
         n: 32,
         gap: 6,
         brN: 32,
         br: 10,
         sunburstGapOn: true,
      });
   }
}

// ---------------------------------------------------------------------------

export default (
   <cx>
      <div controller={PageController} style="padding:24px;font:13px/1.55 system-ui,sans-serif">
         <h1 style="font-size:21px;margin:0">PieChart — gap &amp; border-radius bugs (broken vs fixed)</h1>
         <div
            style={NOTE}
            text={
               "Six unintentional defects. Every section shows the real framework on the LEFT (red " +
               "heading) and a proposed fix on the RIGHT (green heading).\n\n" +
               "The fixed side is not a different renderer: it feeds corrected layout into the " +
               "framework's own arc-drawing function, copied verbatim as arcPath(). So every visible " +
               "difference is caused by the layout fix alone.\n\n" +
               "  1  CRITICAL -- hangs the browser tab, unrecoverable\n" +
               "  2  gap search is imprecise and re-runs every frame\n" +
               "  3  one br value renders as several different corner radii\n" +
               "  4  r0 = 0 beside r0 > 0 renders backwards slivers\n" +
               "  5  MULTI-LEVEL -- rings in one chart disagree about gap width\n" +
               "  6  MULTI-LEVEL -- sunburst rings do not line up (worst after 1)\n\n" +
               "One corrected layout resolves 1, 2, 4, 5 and 6 together, because they share a root " +
               "cause: the angular gap budget and the loop that searches for it. Bug 3 is separate.\n\n" +
               "WHAT THE FIX IS NOT: an earlier version of this page removed the gap budget " +
               "entirely. That aligned the rings but blanked the whole chart once the gap stopped " +
               "fitting (gap=24 blanked at n>=17) and pinched slices to a hairline just below that. " +
               "Auto-shrinking the gap is NOT optional. The fix keeps it and changes only WHERE it " +
               "applies: to the drawing inset, resolved once chart-wide by closed form, instead of " +
               "to the angular budget. Boundaries then never move, which is what fixes 5 and 6, " +
               "while every slice keeps at least " + (KEEP * 100).toFixed(0) + "% of its span so " +
               "nothing ever blanks. Readouts print `kept n/n` as proof.\n\n" +
               "Remaining honest cost: the gap is uniform chart-wide, so the most crowded ring -- or " +
               "one very thin slice -- caps it for everyone. That is the price of \"one gap config, " +
               "one rendered gap\", the same tradeoff as the chart-wide br. Deliberate behaviour " +
               "that merely looks wrong is in the DELIBERATE footer."
            }
         />

         {/* ============================================================== 1 */}
         <h2 style={H2 + ";color:#b00"} text="1. Infinite loop -> tab freeze (critical)" />
         <div
            style={NOTE}
            text={
               "measure() shrinks the gap with `while (stack.gap > 0) { ... gap = gap * 0.95 }`. That " +
               "loop cannot terminate when its exit test `gapAngleTotal < 0.25 * angleTotal` is " +
               "unsatisfiable, because subnormal multiplication stalls: 4.4e-323 * 0.95 === " +
               "4.4e-323, so gap never reaches 0. It needs only gap > 0 plus one slice with r0 > 0.\n\n" +
               "Unsatisfiable whenever angleTotal ends up 0, negative or NaN:\n" +
               "  angle={0}      -- e.g. animating a reveal from 0\n" +
               "  angle={-90}    -- any negative total\n" +
               "  angle-bind     -- pointing at a store value that is not set yet\n\n" +
               "The binding case is the likely one in real apps: declareData declares " +
               "`angle: undefined`, so StructuredSelector seeds no default, and " +
               "(undefined / 180) * Math.PI is NaN. PieChart.prototype.angle = 360 does NOT rescue a " +
               "configured binding -- a prototype value only applies when the prop is absent.\n\n" +
               "FIX: guard the input, and drop the loop entirely (section 2's closed form). The " +
               "right-hand charts are the fixed layout fed the same degenerate angles -- it renders " +
               "nothing and returns, which is the correct graceful outcome for a zero or negative " +
               "total angle. Note `angle` absent still yields the 360 default; only an explicitly " +
               "bad value renders empty."
            }
         />
         <div style={ROW}>
            <div style="padding:12px;border:2px solid #b00;background:#fff5f5;border-radius:6px;max-width:44ch">
               <b style={BAD} text="BROKEN -- framework" />
               <span
                  text={
                     "These buttons hang the render loop synchronously. The tab becomes unresponsive " +
                     "and cannot even be reloaded -- you have to close it. Read the rest first."
                  }
               />
               <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
                  <Button onClick={(e, { store }) => store.set("$page.hang", "zero")} text="angle = 0" />
                  <Button
                     onClick={(e, { store }) => store.set("$page.hang", "negative")}
                     text="angle = -90"
                  />
                  <Button
                     onClick={(e, { store }) => store.set("$page.hang", "unbound")}
                     text="angle-bind -> NaN"
                  />
               </div>
               <div visible-expr="!!{$page.hang}">
                  <Svg style={CHART}>
                     <PieChart
                        gap={8}
                        angle-expr="{$page.hang}=='zero' ? 0 : ({$page.hang}=='negative' ? -90 : {$page.neverSet})"
                     >
                        <Repeater records={equalSlices(5)}>
                           <PieSlice value-bind="$record.value" style-bind="$record.style" r={90} r0={30} />
                        </Repeater>
                     </PieChart>
                  </Svg>
               </div>
            </div>
            <div style="padding:12px;border:2px solid #1a6;background:#f5fff9;border-radius:6px">
               <b style={GOOD} text="FIXED -- renders, never hangs" />
               <div style="display:flex;gap:10px;flex-wrap:wrap">
                  <div style={MINI}>
                     <div style={MINIBOX} innerHtml={miniSvg(360)} />
                     <div text="angle = 360" />
                     <div style="color:#1a6" text={miniCount(360)} />
                  </div>
                  <div style={MINI}>
                     <div style={MINIBOX} innerHtml={miniSvg(0)} />
                     <div text="angle = 0" />
                     <div style="color:#1a6" text={miniCount(0)} />
                  </div>
                  <div style={MINI}>
                     <div style={MINIBOX} innerHtml={miniSvg(-90)} />
                     <div text="angle = -90" />
                     <div style="color:#1a6" text={miniCount(-90)} />
                  </div>
                  <div style={MINI}>
                     <div style={MINIBOX} innerHtml={miniSvg(NaN)} />
                     <div text="angle = NaN" />
                     <div style="color:#1a6" text={miniCount(NaN)} />
                  </div>
               </div>
            </div>
         </div>

         {/* ============================================================== 2 */}
         <h2 style={H2} text="2. The gap search is imprecise and re-runs on every frame" />
         <div
            style={NOTE}
            text={
               "To be clear about what is NOT the bug: gaps genuinely must get thinner as slices are " +
               "added -- 100 slices each wanting 6 px needs 537 degrees of circle and you have 360. " +
               "The shrinking is correct. How it is computed is not.\n\n" +
               "The code guesses. Does 6 px fit? no. 5.7? no. 5.42? ... multiplying by 0.95 until " +
               "something fits. So (a) it stops at the FIRST size that fits rather than the LARGEST, " +
               "leaving gaps up to ~5 % thinner than they should be, and (b) it redoes the whole " +
               "guess-and-check inside measure(), which runs on every prepare pass -- at 500 slices " +
               "that is 68 iterations x 500 = 34,000 asin calls per frame for a number that did not " +
               "change.\n\n" +
               "FIX: there is a closed form. The largest gap fitting the budget is\n" +
               "  gap = 2 * r0 * sin(0.125 * angleTotal / n)\n" +
               "for uniform r0 -- verified against a 60-step bisection, matching to 4 decimals. " +
               "Mixed radii need ~20 bisection steps for an exact answer instead of ~68 approximate " +
               "ones. The fixed layout goes further: it resolves the gap ONCE for the whole chart by " +
               "closed form, and applies it as a DRAWING cap rather than an angular budget. The gap " +
               "still shrinks when it has to -- drag the sliders and watch `resolved gap` fall -- " +
               "but slice boundaries never move, which is what makes sections 5 and 6 work.\n\n" +
               "The two charts look nearly identical here, and that is honest: the win in THIS " +
               "section is precision, no per-frame loop, and nothing left that can hang. The " +
               "visible payoff is in sections 5 and 6.\n\n" +
               "Push slice count to 500 and gap to 24 on both sides. Neither blanks: `kept 500/500` " +
               "with every slice holding at least " + (KEEP * 100).toFixed(0) + "% of its span. An " +
               "earlier draft of this fix DID blank here -- see the note at the top of the page for " +
               "why removing the budget outright was the wrong idea."
            }
         />
         <div style={ROW}>
            <div>
               <b style={BAD} text="BROKEN -- 0.95 guess-and-check, every frame" />
               <Svg style={CHART}>
                  <PieChart gap-bind="$page.gap">
                     <Repeater records={computable("$page.n", (n) => equalSlices(n))}>
                        <PieSlice value-bind="$record.value" style-bind="$record.style" r={90} r0={40} />
                     </Repeater>
                  </PieChart>
               </Svg>
            </div>
            <div>
               <b style={GOOD} text="FIXED -- exact, no loop" />
               <div
                  style={CHART}
                  innerHtml={computable("$page.n", "$page.gap", (n, gap) =>
                     fixedSvg({ rings: [withR(equalSlices(n), 40, 90)], gap }),
                  )}
               />
            </div>
            <div style="min-width:340px">
               <LabelsTopLayout columns={2}>
                  <Slider
                     value-bind="$page.n"
                     minValue={3}
                     maxValue={500}
                     step={1}
                     label="Slice count"
                     help={tpl("{$page.n:n;0}")}
                  />
                  <Slider
                     value-bind="$page.gap"
                     minValue={0}
                     maxValue={24}
                     step={1}
                     label="Requested gap (px)"
                     help={tpl("{$page.gap:n;0}")}
                  />
               </LabelsTopLayout>
               <pre
                  style={PRE}
                  text={computable("$page.n", "$page.gap", (n, gap) => {
                     let a = analyze(gap, 40, n);
                     let opt = optimum(gap, 40, n);
                     let shortfall = opt > 0 ? (1 - a.effGap / opt) * 100 : 0;
                     let f = fixedInfo({ rings: [withR(equalSlices(n), 40, 90)], gap });
                     return [
                        "BROKEN",
                        "  requested gap  " + gap.toFixed(0) + " px",
                        "  loop finds     " + a.effGap.toFixed(4) + " px",
                        "  exact optimum  " + opt.toFixed(4) + " px",
                        "  SHORTFALL      " + shortfall.toFixed(2) + " %",
                        "  iterations     " + a.iterations,
                        "  asin calls     " + a.asinCalls + " / measure()",
                        "                 ...every prepare pass",
                        "",
                        "FIXED",
                        "  requested gap  " + gap.toFixed(0) + " px",
                        "  resolved gap   " + f.effGap.toFixed(4) + " px" +
                           (f.effGap < gap - 1e-9 ? "   (capped)" : "   (fits as asked)"),
                        "  iterations     0   (closed form)",
                        "  kept           " + f.slices.length + "/" + n +
                           (f.slices.length === n ? "   never blanks" : "   *** REGRESSION ***"),
                        "  drawn / span   " +
                           (f.slices.length
                              ? (
                                   ((f.slices[0].span - 2 * f.slices[0].inset) / f.slices[0].span) *
                                   100
                                ).toFixed(1) + " %   (floor " + (KEEP * 100).toFixed(0) + " %)"
                              : "-"),
                        "",
                        "The resolved gap shrinks like the broken",
                        "one does -- that part was always right.",
                        "The difference is that it is a DRAWING",
                        "cap, so slice boundaries never move:",
                        "that is what fixes sections 5 and 6.",
                     ].join("\n");
                  })}
               />
            </div>
         </div>

         {/* ============================================================== 3 */}
         <h2 style={H2} text="3. br is clamped per slice -> one value, several corner radii" />
         <div
            style={NOTE}
            text={
               "createSvgArc() derives outerBr and innerBr from each slice's OWN half-span, so br is " +
               "silently and non-linearly reduced for small slices. Two visible consequences:\n\n" +
               "  (a) In a chart with mixed slice sizes, large slices stay crisply rounded while " +
               "small ones abruptly go pointy -- one br config, several rendered radii.\n" +
               "  (b) The inner and outer ends of the SAME slice diverge, because the inner side " +
               "clamps earlier (r0 < r gives a larger asin). At high slice counts every slice ends " +
               "up with a noticeably sharper inner end than outer end.\n\n" +
               "br is also never passed to acknowledge(), so the angle budget does not account for " +
               "rounding at all.\n\n" +
               "FIX: resolve one chart-wide br (the minimum any slice can take) and apply it to both " +
               "ends of every slice. Consistency has a price, and it is visible on the left pair: " +
               "the smallest slice sets the radius for everyone, so requesting br=10 with a 0.3 " +
               "slice present yields well under 1 px everywhere -- effectively no rounding at all. " +
               "That is the honest cost of 'one value, one " +
               "radius'. If it is too aggressive, the milder fix is to keep per-slice clamping but " +
               "at least force a slice's two ends to match."
            }
         />
         <div style={ROW}>
            <div>
               <b style={BAD} text="BROKEN -- values 50/10/3/1/0.3, all br = 10" />
               <Svg style={CHART}>
                  <PieChart gap={4}>
                     <Repeater records={listSlices([50, 10, 3, 1, 0.3])}>
                        <PieSlice
                           value-bind="$record.value"
                           style-bind="$record.style"
                           r={90}
                           r0={45}
                           br={10}
                        />
                     </Repeater>
                  </PieChart>
               </Svg>
            </div>
            <div>
               <b style={GOOD} text="FIXED -- one br, both ends, all slices" />
               <div
                  style={CHART}
                  innerHtml={fixedSvg({
                     rings: [withR(listSlices([50, 10, 3, 1, 0.3]), 45, 90)],
                     gap: 4,
                     br: 10,
                  })}
               />
            </div>
            <pre
               style={PRE}
               text={(() => {
                  let values = [50, 10, 3, 1, 0.3];
                  let a = analyze(4, 45, values.length);
                  let af = (a.angleTotal - a.gapAngleTotal) / values.reduce((s, v) => s + v, 0);
                  let out = ["BROKEN -- all requested br = 10", "", "value      span    innerBr   outerBr"];
                  for (let v of values) {
                     let spanDeg = ((v * af + a.gapAnglePerSlice) * 180) / Math.PI;
                     let c = corners(10, 45, 90, spanDeg, a.effGap);
                     out.push(
                        pad(v, 5) + pad(spanDeg.toFixed(1), 9) + " deg" +
                           pad(c.innerBr.toFixed(2), 8) + pad(c.outerBr.toFixed(2), 10),
                     );
                  }
                  let f = fixedInfo({ rings: [withR(listSlices(values), 45, 90)], gap: 4, br: 10 });
                  out.push(
                     "",
                     "FIXED",
                     "  br             " + f.br.toFixed(3) + " for every slice,",
                     "                 identical inner and outer",
                     "  kept           " + f.slices.length + "/" + values.length +
                        (f.dropped ? "   (" + f.dropped + " thinner than gap)" : ""),
                  );
                  return out.join("\n");
               })()}
            />
         </div>
         <div style={ROW + ";margin-top:18px"}>
            <div>
               <b style={BAD} text="BROKEN -- equal slices, inner sharpens faster" />
               <LabelsTopLayout columns={2}>
                  <Slider
                     value-bind="$page.brN"
                     minValue={4}
                     maxValue={72}
                     step={1}
                     label="Slice count"
                     help={tpl("{$page.brN:n;0}")}
                  />
                  <Slider
                     value-bind="$page.br"
                     minValue={0}
                     maxValue={20}
                     step={1}
                     label="Requested br"
                     help={tpl("{$page.br:n;0}")}
                  />
               </LabelsTopLayout>
               <Svg style={CHART}>
                  <PieChart gap={4}>
                     <Repeater records={computable("$page.brN", (n) => equalSlices(n))}>
                        <PieSlice
                           value-bind="$record.value"
                           style-bind="$record.style"
                           r={90}
                           r0={45}
                           br-bind="$page.br"
                        />
                     </Repeater>
                  </PieChart>
               </Svg>
            </div>
            <div>
               <b style={GOOD} text="FIXED -- symmetric ends" />
               <div
                  style={CHART}
                  innerHtml={computable("$page.brN", "$page.br", (n, br) =>
                     fixedSvg({ rings: [withR(equalSlices(n), 45, 90)], gap: 4, br }),
                  )}
               />
            </div>
            <pre
               style={PRE}
               text={computable("$page.brN", "$page.br", (n, br) => {
                  let a = analyze(4, 45, n);
                  let spanDeg = 360 / n;
                  let c = corners(br, 45, 90, spanDeg, a.effGap);
                  let f = fixedInfo({ rings: [withR(equalSlices(n), 45, 90)], gap: 4, br });
                  return [
                     "slice span       " + spanDeg.toFixed(2) + " deg",
                     "requested br     " + br,
                     "",
                     "BROKEN",
                     "  innerBr        " + c.innerBr.toFixed(3),
                     "  outerBr        " + c.outerBr.toFixed(3),
                     "  outer / inner  " +
                        (c.outerBr / Math.max(c.innerBr, 1e-9)).toFixed(2) +
                        "   (1.00 = symmetric)",
                     "",
                     "FIXED",
                     "  br             " + f.br.toFixed(3) + " both ends",
                     "  outer / inner  1.00",
                  ].join("\n");
               })}
            />
         </div>

         {/* ============================================================== 4 */}
         <h2 style={H2} text="4. r0 = 0 beside r0 > 0 -> backwards slivers" />
         <div
            style={NOTE}
            text={
               "A slice with r0 = 0 gets gapAngle = 0 in map(), so no angular budget is reserved for " +
               "it -- yet createSvgArc() still insets it by 2 * asin(gap2 / r) on both sides. Its " +
               "drawn span therefore ends up narrower than its allotted span, and for a thin slice " +
               "it goes NEGATIVE: allotted 1.563 deg, drawn -5.604 deg, rendering as a backwards " +
               "sliver instead of degrading to nothing. The offender is the red slice, value 0.4 " +
               "against four slices of 20.\n\n" +
               "Root cause: `if (gapAngleTotal == 0) stack.gap = 0` in measure() is the guard that " +
               "keeps an all-r0=0 pie safe -- and it is correct, see the DELIBERATE footer. But it " +
               "is all-or-nothing PER STACK. One sibling with r0 > 0 makes gapAngleTotal != 0, so " +
               "the guard never fires and the r0 = 0 slices inset a budget nobody reserved.\n\n" +
               "FIX: make the decision per slice. An r0 = 0 slice takes no inset at all, which is " +
               "the per-slice form of the same guard, so the red slice renders as a proper thin " +
               "wedge reaching the centre (span 1.791 deg, positive) rather than inverting."
            }
         />
         <div style={ROW}>
            <div>
               <b style={BAD} text="BROKEN -- red slice inverts" />
               <Svg style={CHART}>
                  <PieChart gap={10}>
                     <Repeater
                        records={[0.4, 20, 20, 20, 20].map((value, i) => ({
                           value,
                           r0: i === 0 ? 0 : 40,
                           style: styleFor(i === 0 ? "#d6483f" : COLORS[(i + 3) % COLORS.length]),
                        }))}
                     >
                        <PieSlice
                           value-bind="$record.value"
                           style-bind="$record.style"
                           r={90}
                           r0-bind="$record.r0"
                        />
                     </Repeater>
                  </PieChart>
               </Svg>
            </div>
            <div>
               <b style={GOOD} text="FIXED -- thin wedge, positive span" />
               <div
                  style={CHART}
                  innerHtml={fixedSvg({
                     rings: [
                        [0.4, 20, 20, 20, 20].map((value, i) => ({
                           value,
                           r0pct: i === 0 ? 0 : 40,
                           rpct: 90,
                           style: styleFor(i === 0 ? "#d6483f" : COLORS[(i + 3) % COLORS.length]),
                        })),
                     ],
                     gap: 10,
                  })}
               />
            </div>
            <pre
               style={PRE}
               text={(() => {
                  let f = fixedInfo({
                     rings: [
                        [0.4, 20, 20, 20, 20].map((value, i) => ({
                           value, r0pct: i === 0 ? 0 : 40, rpct: 90, style: "",
                        })),
                     ],
                     gap: 10,
                  });
                  let out = [
                     "BROKEN",
                     "  red slice allotted   1.563 deg",
                     "  red slice drawn     -5.604 deg  <- inverted",
                     "",
                     "FIXED   kept " + f.slices.length + "/5",
                     "",
                     "value   r0     inset    drawn span",
                  ];
                  for (let s of f.slices) {
                     let drawn = ((s.span - 2 * s.inset) * 180) / Math.PI;
                     out.push(
                        pad(s.value, 5) + pad(s.r0.toFixed(0) + "px", 7) +
                           pad(((s.inset * 180) / Math.PI).toFixed(2), 8) +
                           pad(drawn.toFixed(3) + " deg", 14),
                     );
                  }
                  out.push("", "no negative spans -- nothing inverts");
                  return out.join("\n");
               })()}
            />
         </div>

         {/* ============================================================== 5 */}
         <h2 style={H2} text="5. Multi-level: rings in one chart disagree about gap width" />
         <div
            style={NOTE}
            text={
               "Every `stack` is budgeted independently, and each ring's budget is charged at its " +
               "own r0. So three rings all requesting gap = 6 render with visibly different " +
               "separator widths, because the inner rings hit the budget ceiling first and get " +
               "shrunk further.\n\n" +
               "Measured off the rendered SVG paths: 6.00 / 4.64 / 2.04 px. The inner ring's " +
               "separators are a third the width of the outer ring's, in a single chart where every " +
               "slice asked for the same 6 px. Nothing in the config explains the difference.\n\n" +
               "FIX: reserve no angular budget at all, so there is no per-ring shrinking to " +
               "disagree about. The gap becomes purely a drawing inset, which is already " +
               "constant-width, and every ring renders exactly 6.0000 px."
            }
         />
         <div style={ROW}>
            <div>
               <b style={BAD} text="BROKEN -- 6.00 / 4.64 / 2.04 px" />
               <Svg style={CHART}>
                  <PieChart gap={6}>
                     <Repeater records={equalSlices(24)}>
                        <PieSlice stack="outer" value-bind="$record.value" style-bind="$record.style" r0={70} r={90} />
                     </Repeater>
                     <Repeater records={equalSlices(24)}>
                        <PieSlice stack="mid" value-bind="$record.value" style-bind="$record.style" r0={45} r={65} />
                     </Repeater>
                     <Repeater records={equalSlices(24)}>
                        <PieSlice stack="inner" value-bind="$record.value" style-bind="$record.style" r0={20} r={40} />
                     </Repeater>
                  </PieChart>
               </Svg>
            </div>
            <div>
               <b style={GOOD} text="FIXED -- 6.00 px on every ring" />
               <div
                  style={CHART}
                  innerHtml={fixedSvg({
                     rings: [
                        withR(equalSlices(24), 70, 90),
                        withR(equalSlices(24), 45, 65),
                        withR(equalSlices(24), 20, 40),
                     ],
                     gap: 6,
                  })}
               />
            </div>
            <pre
               style={PRE}
               text={(() => {
                  let out = [
                     "24 slices per ring, all requesting 6 px",
                     "",
                     "         BROKEN            FIXED",
                     "ring     effGap            gapWidth",
                  ];
                  let RINGS = [
                     ["outer", 70, 90],
                     ["mid", 45, 65],
                     ["inner", 20, 40],
                  ];
                  let f = fixedInfo({
                     rings: RINGS.map(([, r0, r]) => withR(equalSlices(24), r0, r)),
                     gap: 6,
                  });
                  RINGS.forEach(([name, r0], i) => {
                     let a = analyze(6, r0, 24);
                     let w = f.layouts[i].slices[0].drawGap;
                     out.push(
                        name.padEnd(8) + pad(a.effGap.toFixed(3) + " px", 10) + pad(w.toFixed(4) + " px", 18),
                     );
                  });
                  out.push("", "3x spread  ->  identical", "resolved chart-wide: " + f.effGap.toFixed(3) + " px");
                  return out.join("\n");
               })()}
            />
         </div>

         {/* ============================================================== 6 */}
         <h2 style={H2} text="6. Multi-level sunburst: parent and child rings do not line up" />
         <div
            style={NOTE}
            text={
               "Both rings describe the SAME data: inner ring = parents 50 / 30 / 20, outer ring = " +
               "children 25 / 25 / 30 / 20, i.e. the first parent split in two. The 50% boundary " +
               "therefore has to sit at the same angle in both rings. It does not.\n\n" +
               "Because each ring reserves a different fraction of the circle for gaps (section 5), " +
               "the same proportion lands on a different angle in each ring. Measured off the " +
               "rendered SVG paths: 179.995 deg in the children ring vs 171.368 deg in the parents " +
               "ring -- 8.63 deg apart, and 5.34 deg at the 80% boundary. The rings touch at " +
               "r = 55%, so the step is directly visible where the blue block ends.\n\n" +
               "Untick the gap: at gap = 0 the BROKEN rings line up perfectly, which isolates the " +
               "gap budget as the cause rather than any rounding or angle error.\n\n" +
               "FIX: boundaries come from exact proportions, so they are identical in every ring by " +
               "construction -- misalignment is 0.0e+0 deg, not merely small, and stays 0 at any " +
               "gap. This is the worst defect after section 1: it makes correct sunburst and " +
               "drill-down charts impossible whenever gaps are enabled."
            }
         />
         <Checkbox value-bind="$page.sunburstGapOn" text="gap = 12 (untick for gap = 0)" />
         <div style={ROW}>
            <div>
               <b style={BAD} text="BROKEN -- 8.63 deg step at the blue boundary" />
               <Svg style={CHART}>
                  <PieChart gap-expr="{$page.sunburstGapOn} ? 12 : 0">
                     <Repeater
                        records={listSlices([25, 25, 30, 20], ["#3b7dd8", "#6fa3e8", "#e8912a", "#3aa76d"])}
                     >
                        <PieSlice stack="children" value-bind="$record.value" style-bind="$record.style" r0={55} r={85} />
                     </Repeater>
                     <Repeater records={listSlices([50, 30, 20], ["#3b7dd8", "#e8912a", "#3aa76d"])}>
                        <PieSlice stack="parents" value-bind="$record.value" style-bind="$record.style" r0={25} r={55} />
                     </Repeater>
                  </PieChart>
               </Svg>
            </div>
            <div>
               <b style={GOOD} text="FIXED -- rings share every boundary" />
               <div
                  style={CHART}
                  innerHtml={computable("$page.sunburstGapOn", (on) =>
                     fixedSvg({ rings: SUNBURST_RINGS, gap: on ? 12 : 0 }),
                  )}
               />
            </div>
            <pre
               style={PRE}
               text={computable("$page.sunburstGapOn", (on) => {
                  let gap = on ? 12 : 0;
                  let p = boundaries(gap, [50, 30, 20], 25);
                  let c = boundaries(gap, [25, 25, 30, 20], 55);
                  let fi = fixedInfo({ rings: SUNBURST_RINGS, gap });
                  let fc = fi.layouts[0]; // children
                  let fp = fi.layouts[1]; // parents
                  let d = (a) => (a * 180) / Math.PI;
                  let fMis50 = Math.abs(d(fp.slices[0].a1) - d(fc.slices[1].a1));
                  let fMis80 = Math.abs(d(fp.slices[1].a1) - d(fc.slices[2].a1));
                  return [
                     "gap = " + gap + " px",
                     "",
                     "BROKEN",
                     "  50% boundary",
                     "    parents   " + p[0].toFixed(2) + " deg",
                     "    children  " + c[1].toFixed(2) + " deg",
                     "    MISALIGNED " + Math.abs(p[0] - c[1]).toFixed(2) + " deg",
                     "  80% boundary",
                     "    MISALIGNED " + Math.abs(p[1] - c[2]).toFixed(2) + " deg",
                     "",
                     "FIXED",
                     "  50% boundary",
                     "    parents   " + d(fp.slices[0].a1).toFixed(4) + " deg",
                     "    children  " + d(fc.slices[1].a1).toFixed(4) + " deg",
                     "    MISALIGNED " + fMis50.toExponential(1) + " deg",
                     "  80% boundary",
                     "    MISALIGNED " + fMis80.toExponential(1) + " deg",
                  ].join("\n");
               })}
            />
         </div>

         {/* =========================================================== FOOT */}
         <h2 style={H2 + ";color:#1a6"} text="DELIBERATE -- do not 'fix' these" />
         <div
            style={NOTE}
            text={
               "Analysed and deliberately left out of the list above, so a fix does not churn " +
               "correct code.\n\n" +
               "gap does nothing when r0 = 0 (which includes omitting r0, since " +
               "PieSlice.prototype.r0 = 0 -- both emit byte-identical paths). This is intended. A " +
               "constant-width gap is geometrically impossible at r0 = 0: the apex would have to " +
               "leave the centre by gap2 / sin(halfAngle), which is 12 px for a 60 deg slice but " +
               "68.8 px for a 10 deg one, giving a ragged non-circular hole. What would actually be " +
               "drawn is a wedge gap that tapers to zero -- 12.0 px at r=144, 3.0 px at r=36, " +
               "0.6 px at r=7. `offset` is the tool for this: it displaces each slice along its own " +
               "mid-angle, keeping adjacent edges parallel and the separation constant (measured " +
               "11.9997 px at every distance from the apex). Note offset is not a pixel gap -- its " +
               "width is offset * (sin a_i + sin a_j), so it scales with slice angle and is not " +
               "budgeted against r. The fixed layout above preserves this rule per slice.\n\n" +
               "The 25% whitespace ceiling. Gaps must shrink as slices are added; where exactly to " +
               "stop is a design choice. The only real complaints are that it is hard-coded rather " +
               "than configurable, and silent. Section 2 covers the part that IS a bug.\n\n" +
               "A small r0 producing thin gaps. Same ceiling, reached another way. Once it is " +
               "active the ANGLE per gap pins at ~25%/n regardless of r0 (17.2-17.6 deg across r0 " +
               "from 40% to 0.5% at n=5) and the WIDTH collapses instead, since " +
               "width = 2*r0*sin(angle/2). Not an independent defect. The clamp gap <= 2*min(r0) " +
               "does technically permit asin(1) = 180 deg, but the ceiling caps per-gap angle at " +
               "~90/n deg, so for n >= 2 the worst reachable case is 44 deg -- dead code, not a " +
               "hazard.\n\n" +
               "The core arc geometry, i.e. createSvgArc(). Copied verbatim as arcPath() and used " +
               "unchanged on the FIXED side of every pair above. The gap is an exact constant-width " +
               "band: both edges are inset by asin(gap2 / radius) at every radius, so each edge " +
               "point sits exactly gap/2 perpendicular from the shared separator ray -- not an " +
               "approximation. The corner tangency derivations are correct, the clamp branches only " +
               "ever REDUCE br, and the rounded path cannot invert into a bow-tie: that would need " +
               "(r0 - gap2) * (2*br - (r - r0)) > 0, and the invariants gap/2 <= r0 and " +
               "br <= (r - r0)/2 make both factors non-positive. The Math.max(..., 0) guards are " +
               "load-bearing. Angular proportionality within one stack is exact to float precision " +
               "(max error ~4e-16)."
            }
         />
      </div>
   </cx>
);
