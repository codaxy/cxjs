// Regression page for #1337. Widgets declare defaults for some props (Field's
// emptyValue = null, LineGraph's active = true, Slider's to = 0). The default
// is written to the store when the widget initializes, whether the prop is
// bound with a binding object ({bind: ...} or the -bind shorthand) or an
// accessor chain. Before 26.10.0, accessor chains wrote nothing and the widget
// saw undefined instead.
//
// The page shows each widget twice, side by side, with the two binding styles.
// Each section says what you should see and how it looked before the fix.
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
         <h2 style="margin-top: 0">#1337: both binding styles write the widget's default to the store</h2>
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
                  "Both store <code>null</code>. Before 26.10.0, the accessor chain left the key out, so code " +
                  "that compared the values strictly (<code>=== null</code>, <code>a === b</code>) got different " +
                  "results."
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
                  "Both charts draw the line and store <code>active = true</code>. Clicking a legend entry hides " +
                  "its line and stores <code>false</code>. Before 26.10.0, the accessor-chain chart was empty, " +
                  "with axes at 0–100, because <code>active</code> was undefined and LineGraph draws nothing when " +
                  "it is falsy."
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
                  "Both handles move and both values become 1. Before 26.10.0, the accessor-chain slider did not " +
                  "move and its store value became <code>NaN</code>, because the wheel handler added the step to " +
                  "<code>undefined</code>."
               }
            />
            <p
               innerHtml={
                  "Before you scroll, both handles have <code>style=&quot;left: 0%&quot;</code> in the element " +
                  "inspector. Before 26.10.0, the accessor-chain handle rendered <code>left: NaN%</code>, which the " +
                  "browser ignored, so it only looked right by accident."
               }
            />
         </Section>
      </div>
   </cx>
);
