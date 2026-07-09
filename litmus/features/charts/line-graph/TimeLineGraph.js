import { Chart, Gridlines, LineGraph, NumericAxis, TimeAxis } from "cx/charts";
import { Svg, BoundedObject, ClipRect } from "cx/svg";
import { Controller, VDOM } from "cx/ui";
import { Button, FlexRow } from "cx/widgets";
import { getTopLevelBoundingClientRect } from "cx/util";

// A drag-to-zoom overlay for charts. It sits on top of the chart plot area,
// captures a drag, draws a translucent selection band while dragging, and — on
// mouse release — writes the selected range into the axis min/max bindings.
// Double-click resets the zoom.
//
// Which axes participate is inferred from the bindings you wire up (the same
// idea as MouseTracker/SnapPointFinder, which only track the axes you give them):
//   - bind `xMin`/`xMax` -> the selector zooms the x-axis
//   - bind `yMin`/`yMax` -> the selector zooms the y-axis
//   - bind both          -> rectangular (x + y) zoom
//
// An optional `onZoom(range, instance)` callback fires after a zoom is applied
// (and on double-click reset). `range` is `{ x, y, reset? }`, where `x`/`y` are
// `[min, max]` for the axes that changed or `null` otherwise; `reset` is `true`
// for a double-click reset.
//
// It relies on the axis calculators (available to any chart child via
// `context.axes[...]`) to convert pixel <-> value:
//   - trackValue(px, offset, constrain) : pixel -> value
//   - map(value)                        : value -> pixel (to draw the band)
//   - constrainValue(value)             : clamp to the current axis range
class RangeSelector extends BoundedObject {
   init() {
      // Infer active axes from which zoom-target bindings were provided.
      this.enableX = this.xMin !== undefined || this.xMax !== undefined;
      this.enableY = this.yMin !== undefined || this.yMax !== undefined;
      super.init();
   }

   declareData(...args) {
      return super.declareData(...args, {
         // transient selection band edges (values), set only while dragging
         x1: undefined,
         x2: undefined,
         y1: undefined,
         y2: undefined,
         // zoom targets — bound to the axes' min/max
         xMin: undefined,
         xMax: undefined,
         yMin: undefined,
         yMax: undefined,
      });
   }

   explore(context, instance) {
      instance.xAxis = context.axes && context.axes[this.xAxis];
      instance.yAxis = context.axes && context.axes[this.yAxis];
      super.explore(context, instance);
   }

   render(context, instance, key) {
      let { data, xAxis, yAxis } = instance;
      let { bounds } = data;
      if (!bounds || !bounds.valid()) return null;

      let useX = this.enableX;
      let useY = this.enableY;

      let children = [];

      // transparent capture surface over the whole plot area
      children.push(
         VDOM.createElement("rect", {
            key: "surface",
            x: bounds.l,
            y: bounds.t,
            width: bounds.width(),
            height: bounds.height(),
            fill: "transparent",
            style: { cursor: useX && useY ? "crosshair" : useX ? "ew-resize" : "ns-resize" },
            onMouseDown: (e) => this.handleMouseDown(e, instance),
            onDoubleClick: (e) => this.handleDoubleClick(e, instance),
         }),
      );

      // selection band (only while dragging)
      let dragging = (useX && data.x1 != null) || (useY && data.y1 != null);
      if (dragging) {
         let rx = bounds.l,
            ry = bounds.t,
            rw = bounds.width(),
            rh = bounds.height();

         if (useX && data.x1 != null && data.x2 != null && xAxis) {
            let p1 = xAxis.map(data.x1);
            let p2 = xAxis.map(data.x2);
            rx = Math.min(p1, p2);
            rw = Math.abs(p2 - p1);
         }
         if (useY && data.y1 != null && data.y2 != null && yAxis) {
            let q1 = yAxis.map(data.y1);
            let q2 = yAxis.map(data.y2);
            ry = Math.min(q1, q2);
            rh = Math.abs(q2 - q1);
         }

         children.push(
            VDOM.createElement("rect", {
               key: "band",
               x: rx,
               y: ry,
               width: Math.max(0, rw),
               height: Math.max(0, rh),
               fill: "rgba(120, 120, 120, 0.18)",
               stroke: "rgba(80, 80, 80, 0.7)",
               strokeWidth: 1,
               style: { pointerEvents: "none" },
            }),
         );
      }

      return VDOM.createElement("g", { key, className: data.classNames }, children);
   }

   handleMouseDown(e, instance) {
      let useX = this.enableX;
      let useY = this.enableY;
      let ax = instance.xAxis;
      let ay = instance.yAxis;
      if ((!useX || !ax) && (!useY || !ay)) return;

      e.preventDefault();
      e.stopPropagation();

      let svgEl = e.target.closest("svg");
      let svgBounds = getTopLevelBoundingClientRect(svgEl);

      // NumericScale.trackValue has a constrain bug, so we always track
      // unconstrained and clamp ourselves via constrainValue.
      let trackX = (clientX) => ax.constrainValue(ax.trackValue(clientX - svgBounds.left, 0, false));
      let trackY = (clientY) => ay.constrainValue(ay.trackValue(clientY - svgBounds.top, 0, false));

      let startPxX = e.clientX,
         startPxY = e.clientY;
      let startX = useX && ax ? trackX(startPxX) : null;
      let startY = useY && ay ? trackY(startPxY) : null;
      let lastPxX = startPxX,
         lastPxY = startPxY;
      let lastX = startX,
         lastY = startY;

      instance.store.batch(() => {
         if (useX && ax) {
            instance.set("x1", startX);
            instance.set("x2", startX);
         }
         if (useY && ay) {
            instance.set("y1", startY);
            instance.set("y2", startY);
         }
      });

      let move = (ev) => {
         instance.store.batch(() => {
            if (useX && ax) {
               lastPxX = ev.clientX;
               lastX = trackX(lastPxX);
               instance.set("x2", lastX);
            }
            if (useY && ay) {
               lastPxY = ev.clientY;
               lastY = trackY(lastPxY);
               instance.set("y2", lastY);
            }
         });
         ev.preventDefault();
      };

      let up = () => {
         window.removeEventListener("mousemove", move, true);
         window.removeEventListener("mouseup", up, true);

         let range = { x: null, y: null };

         instance.store.batch(() => {
            instance.set("x1", null);
            instance.set("x2", null);
            instance.set("y1", null);
            instance.set("y2", null);

            if (useX && ax && Math.abs(lastPxX - startPxX) >= 3) {
               range.x = [Math.min(startX, lastX), Math.max(startX, lastX)];
               instance.set("xMin", range.x[0]);
               instance.set("xMax", range.x[1]);
            }
            if (useY && ay && Math.abs(lastPxY - startPxY) >= 3) {
               range.y = [Math.min(startY, lastY), Math.max(startY, lastY)];
               instance.set("yMin", range.y[0]);
               instance.set("yMax", range.y[1]);
            }
         });

         if ((range.x || range.y) && this.onZoom) instance.invoke("onZoom", range, instance);
      };

      window.addEventListener("mousemove", move, true);
      window.addEventListener("mouseup", up, true);
   }

   handleDoubleClick(e, instance) {
      instance.store.batch(() => {
         if (this.enableX) {
            instance.set("xMin", null);
            instance.set("xMax", null);
         }
         if (this.enableY) {
            instance.set("yMin", null);
            instance.set("yMax", null);
         }
      });

      // reset is signalled with null ranges for the axes this selector controls
      if (this.onZoom)
         instance.invoke("onZoom", { x: null, y: null, reset: true }, instance);
   }
}

RangeSelector.prototype.xAxis = "x";
RangeSelector.prototype.yAxis = "y";
RangeSelector.prototype.anchors = "0 1 1 0";
RangeSelector.prototype.baseClass = "rangeselector";

class PageController extends Controller {
   onInit() {
      let v1 = 100;
      let v2 = 300;
      const start = new Date(2024, 0, 1).getTime();
      const day = 24 * 60 * 60 * 1000;
      const data = Array.from({ length: 200 }, (_, i) => ({
         date: start + i * day,
         value: (v1 = v1 + (Math.random() - 0.5) * 20),
         value2: (v2 = v2 + (Math.random() - 0.5) * 40),
      }));
      this.store.set("$page.points", data);
   }
}

function describeZoom(range, label) {
   if (range.reset) return `${label}: reset`;
   let d = (ms) => new Date(ms).toLocaleDateString();
   let parts = [];
   if (range.x) parts.push(`x ${d(range.x[0])} → ${d(range.x[1])}`);
   if (range.y) parts.push(`y ${range.y[0].toFixed(1)} → ${range.y[1].toFixed(1)}`);
   return `${label}: ${parts.join(", ")}`;
}

// A single chart bound to the shared x-range ($page.range) and its own y-range.
// `zoomY` decides whether the y-axis bindings are wired to the RangeSelector;
// when they are omitted, the selector zooms the x-axis only.
const ZoomChart = ({ label, lineStyle, yField, yRange, sel, zoomY }) => (
   <cx>
      <Svg style="width:800px; height:260px;">
         <Chart
            offset="20 -10 -40 60"
            axes={{
               x: (
                  <TimeAxis
                     min-bind="$page.range.from"
                     max-bind="$page.range.to"
                     snapToTicks={false}
                     minLabelDistance={60}
                     minTickDistance={60}
                  />
               ),
               y: <NumericAxis vertical min={{ bind: `${yRange}.from` }} max={{ bind: `${yRange}.to` }} />,
            }}
         >
            <Gridlines />
            <ClipRect>
               <LineGraph data-bind="$page.points" xField="date" yField={yField} name={yField} lineStyle={lineStyle} />
            </ClipRect>
            <RangeSelector
               x1={{ bind: `${sel}.x1` }}
               x2={{ bind: `${sel}.x2` }}
               xMin-bind="$page.range.from"
               xMax-bind="$page.range.to"
               y1={zoomY ? { bind: `${sel}.y1` } : undefined}
               y2={zoomY ? { bind: `${sel}.y2` } : undefined}
               yMin={zoomY ? { bind: `${yRange}.from` } : undefined}
               yMax={zoomY ? { bind: `${yRange}.to` } : undefined}
               onZoom={(range, inst) => inst.store.set("$page.status", describeZoom(range, label))}
            />
         </Chart>
      </Svg>
   </cx>
);

export default (
   <cx>
      <div class="widgets" style="padding-left: 30px" controller={PageController}>
         <p style="max-width: 820px; color: #555">
            Drag across a chart to zoom (applied on mouse release). Double-click a chart to reset. Both charts share the
            same time (x) axis, so zooming x in either one re-scales the other. Which axes a selector zooms is inferred
            from the bindings you wire: the <b>top</b> chart wires only <code>xMin/xMax</code> (x-only zoom); the{" "}
            <b>bottom</b> chart also wires <code>yMin/yMax</code>, so a drag zooms both axes (x is still shared, y is
            per-chart).
         </p>
         <FlexRow spacing style="margin-bottom: 10px" align="center">
            <Button
               onClick={(e, { store }) => {
                  store.set("$page.range", null);
                  store.set("$page.y1", null);
                  store.set("$page.y2", null);
                  store.set("$page.status", null);
               }}
            >
               Reset zoom
            </Button>
            <div style="color:#555; font-family:monospace" text-tpl="onZoom → {$page.status:s;—}" />
         </FlexRow>
         <ZoomChart label="Top" lineStyle="stroke: #555; stroke-width: 1.5" yField="value" yRange="$page.y1" sel="$page.sel1" />
         <ZoomChart label="Bottom" lineStyle="stroke: #888; stroke-width: 1.5" yField="value2" yRange="$page.y2" sel="$page.sel2" zoomY />
      </div>
   </cx>
);
