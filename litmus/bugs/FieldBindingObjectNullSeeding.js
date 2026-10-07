// Reproduction for #1337. Widgets declare defaults for some props (Field's
// emptyValue = null, LineGraph's active = true, Slider's to = 0). Bound with a
// binding object ({bind: ...} or the -bind shorthand), the default is written
// to the store when the widget initializes. Bound with an accessor chain,
// nothing is written and the widget sees undefined instead.
//
// The page shows each widget twice, side by side, with the two binding styles.
// Each section says what you should see and what actually happens.
//
// Run: import Demo from "./bugs/FieldBindingObjectNullSeeding"; in litmus/index.js
import { computable } from "cx/ui";
import { createAccessorModelProxy } from "cx/data";
import { Slider, TextField } from "cx/widgets";
import { Svg } from "cx/svg";
import { Chart, Gridlines, Legend, LegendScope, LineGraph, NumericAxis } from "cx/charts";

const { $page } = createAccessorModelProxy();

const points = Array.from({ length: 11 }, (_, x) => ({ x, y: 10 + 5 * Math.sin(x / 2) }));

function describe(v) {
   if (v === undefined) return "undefined (not in the store)";
   if (Number.isNaN(v)) return "NaN";
   return JSON.stringify(v);
}

const StoreValue = ({ path }) => (
   <cx>
      <div style="font-family: monospace; font-size: 12px; margin-top: 6px">
         {path} = <strong text={computable(path, describe)} />
      </div>
   </cx>
);

const Column = ({ title, binding, children }) => (
   <cx>
      <div style="border: 1px solid #ddd; padding: 10px; min-width: 0">
         <div style="font-weight: bold">{title}</div>
         <div style="font-family: monospace; font-size: 12px; color: #666; margin-bottom: 8px">{binding}</div>
         {children}
      </div>
   </cx>
);

const Section = ({ title, children }) => (
   <cx>
      <section style="margin-bottom: 30px">
         <h3 style="margin: 0 0 6px">{title}</h3>
         {children}
      </section>
   </cx>
);

const columns = "display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 8px 0";

const chart = (active, color) => (
   <cx>
      <LegendScope>
         <Legend />
         <Svg style="width: 100%; height: 180px">
            <Chart offset="10 -10 -30 40" axes={{ x: { type: NumericAxis }, y: { type: NumericAxis, vertical: true } }}>
               <Gridlines />
               <LineGraph
                  data={points}
                  name="Series (click to toggle)"
                  lineStyle={`stroke: ${color}; stroke-width: 2`}
                  active={active}
               />
            </Chart>
         </Svg>
      </LegendScope>
   </cx>
);

export default (
   <cx>
      <div style="padding: 20px; max-width: 900px">
         <h2 style="margin-top: 0">#1337: the binding style decides whether the store gets the widget's default</h2>
         <p
            innerHtml={
               "Every pair below is the same widget with the same store path. The only difference is how the " +
               "prop is bound. Both columns should look and behave the same. Reload the page to start over."
            }
         />

         <Section title="1. TextField (declared default: emptyValue = null)">
            <p>Don't type anything. Expected: both store values are the same.</p>
            <div style={columns}>
               <Column title="Binding object" binding={'value={{ bind: "$page.fieldBind" }}'}>
                  <TextField value={{ bind: "$page.fieldBind" }} style="width: 100%" />
                  <StoreValue path="$page.fieldBind" />
               </Column>
               <Column title="Accessor chain" binding="value={$page.fieldChain}">
                  <TextField value={$page.fieldChain} style="width: 100%" />
                  <StoreValue path="$page.fieldChain" />
               </Column>
            </div>
            <p
               innerHtml={
                  "Actual: the binding object stores <code>null</code>, while the accessor chain leaves the key " +
                  "out. Code that compares these values strictly (<code>=== null</code>, <code>a === b</code>) " +
                  "gets different results."
               }
            />
         </Section>

         <Section title="2. LineGraph (declared default: active = true)">
            <p>Both charts plot the same data. Expected: both draw the line.</p>
            <div style={columns}>
               <Column title="Binding object" binding={'active={{ bind: "$page.chartBind" }}'}>
                  {chart({ bind: "$page.chartBind" }, "#1f77b4")}
                  <StoreValue path="$page.chartBind" />
               </Column>
               <Column title="Accessor chain" binding="active={$page.chartChain}">
                  {chart($page.chartChain, "#d62728")}
                  <StoreValue path="$page.chartChain" />
               </Column>
            </div>
            <p
               innerHtml={
                  "Actual: the accessor-chain chart is empty, because <code>active</code> is undefined and " +
                  "LineGraph draws nothing when it is falsy. Its axes fall back to 0–100 because the graph does " +
                  "not report its data range either. The legend still shows the entry as on. Clicking the entry " +
                  "draws the line, because the toggle writes <code>!undefined</code>, which is <code>true</code>."
               }
            />
         </Section>

         <Section title="3. Slider (declared default: to = 0)">
            <p
               innerHtml={
                  "Hover over each slider and scroll the mouse wheel down. Expected: both handles move right one " +
                  "step and both store values become 1."
               }
            />
            <div style={columns}>
               <Column title="Binding object" binding={'value={{ bind: "$page.sliderBind" }} wheel'}>
                  <Slider value={{ bind: "$page.sliderBind" }} wheel style="width: 100%" />
                  <StoreValue path="$page.sliderBind" />
               </Column>
               <Column title="Accessor chain" binding="value={$page.sliderChain} wheel">
                  <Slider value={$page.sliderChain} wheel style="width: 100%" />
                  <StoreValue path="$page.sliderChain" />
               </Column>
            </div>
            <p
               innerHtml={
                  "Actual: the accessor-chain slider does not move, and its store value becomes <code>NaN</code>. " +
                  "The wheel handler adds the step to the current value, and <code>undefined + 1</code> is " +
                  "<code>NaN</code>."
               }
            />
            <p
               innerHtml={
                  "Before you scroll, both handles already look the same, but only by accident. The accessor-chain " +
                  "slider calculates its handle position from undefined and renders <code>left: NaN%</code>. The " +
                  "browser ignores that invalid value, so the handle falls back to the left edge. You can see it " +
                  "in the element inspector: the binding-object handle has <code>style=&quot;left: 0%&quot;</code> " +
                  "and the accessor-chain handle has no style at all."
               }
            />
         </Section>
      </div>
   </cx>
);
