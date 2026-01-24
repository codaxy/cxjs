import { createModel } from "cx/data";
import {
  Controller,
  Repeater,
  ContentResolver,
  createFunctionalComponent,
  enableCultureSensitiveFormatting,
  expr,
  hasValue,
} from "cx/ui";
import { Svg, Text, Line, Rectangle } from "cx/svg";
import {
  Chart,
  LineGraph,
  ColumnGraph,
  PieChart,
  PieSlice,
  PieLabelsContainer,
  PieLabel,
  Gridlines,
  TimeAxis,
  NumericAxis,
  CategoryAxis,
  MouseTracker,
  ValueAtFinder,
  SnapPointFinder,
  Marker,
  MarkerLine,
} from "cx/charts";
import {
  FlexRow,
  Grid,
  Icon,
  Section,
  DragHandle,
  enableTooltips,
} from "cx/widgets";
import "../../icons/lucide";
import { DragSource, DropZone } from "cx/widgets";

enableTooltips();
enableCultureSensitiveFormatting();

// @model
interface WidgetConfig {
  id: number;
  type: string;
}

interface DashboardModel {
  widgets: WidgetConfig[];
  $widget: WidgetConfig;
  $widgetIndex: number;
  $record: any;
  cursor: { x: number };
  snapX: number | null;
  idealValue: number | null;
  actualValue: number | null;
}

const m = createModel<DashboardModel>();
// @model-end

// Data generation
const day = 24 * 60 * 60 * 1000;
const startDate = Date.now() - 30 * day;

// Burndown data
const idealData: { date: number; tasks: number }[] = [];
const actualData: { date: number; tasks: number }[] = [];
const tasks = 30;
let remaining = tasks;

for (let i = 0; i < 30; i++) {
  idealData.push({
    date: startDate + i * day,
    tasks: ((30 - i) / 30) * tasks,
  });
  actualData.push({
    date: startDate + i * day,
    tasks: remaining,
  });
  remaining -= 6 * (Math.random() - 0.3) * (tasks / 30);
  if (remaining < 0) remaining = 0;
}

// Issues data
const issuesData = [
  { type: "Bug", count: 8 },
  { type: "Feature", count: 24 },
  { type: "Docs", count: 12 },
  { type: "UX", count: 6 },
];

// Sprint completion data
const sprintData = [
  { text: "Open", count: 10, color: 12 },
  { text: "Fixed", count: 25, color: 7 },
  { text: "Verified", count: 30, color: 10 },
];

// Velocity data
const velocityData = [
  { sprint: "S1", points: 18 },
  { sprint: "S2", points: 24 },
  { sprint: "S3", points: 21 },
  { sprint: "S4", points: 28 },
  { sprint: "S5", points: 32 },
];

// Activity data
const activityData = [
  { id: 1, user: "Alice", action: "Completed task #42" },
  { id: 2, user: "Bob", action: "Created PR #128" },
  { id: 3, user: "Carol", action: "Reviewed PR #127" },
  { id: 4, user: "David", action: "Fixed bug #89" },
];

function swapElements<T>(array: T[], from: number, to: number): T[] {
  if (from === to) return array;
  const result = [...array];
  [result[from], result[to]] = [result[to], result[from]];
  return result;
}

// @controller
class DashboardController extends Controller {
  onInit() {
    this.store.set(m.widgets, [
      { id: 1, type: "burndown" },
      { id: 2, type: "issues-chart" },
      { id: 3, type: "sprint" },
      { id: 4, type: "issues-grid" },
      { id: 5, type: "velocity" },
      { id: 6, type: "activity" },
    ]);
  }
}
// @controller-end

// Widget wrapper component
const DashboardWidget = createFunctionalComponent(
  ({
    title,
    icon,
    children,
  }: {
    title: string;
    icon: string;
    children: any;
  }) => (
    <Section
      mod="card"
      class="h-full"
      bodyClass="flex flex-col"
      bodyStyle="padding: 8px; height: 240px;"
    >
      <DragHandle>
        <FlexRow align="center" class="mb-2 cursor-move">
          <Icon name={icon} class="w-4 h-4 mr-2 opacity-70" />
          <h4 class="m-0 text-sm font-medium">{title}</h4>
        </FlexRow>
      </DragHandle>
      {children}
    </Section>
  ),
);

// Individual widgets
const BurndownWidget = createFunctionalComponent(() => (
  <DashboardWidget title="Burndown" icon="trending-down">
    <Svg style="flex: 1; width: 100%; height: 100%;">
      <Chart
        margin="5 5 40 30"
        axes={{
          x: { type: TimeAxis, snapToTicks: false },
          y: { type: NumericAxis, vertical: true, snapToTicks: 0 },
        }}
      >
        <Gridlines />
        <MouseTracker
          x={m.cursor.x}
          tooltip={{
            destroyDelay: 5,
            createDelay: 5,
            trackMouse: true,
            placement: "right",
            items: (
              <div class="text-xs">
                <div class="font-bold mb-1" text={{ tpl: "{snapX:d;MMM dd}" }} />
                <div class="flex justify-between gap-4">
                  <span style="color: var(--cx-chart-color-8)">Ideal:</span>
                  <span text={{ tpl: "{idealValue:n;1}" }} />
                </div>
                <div class="flex justify-between gap-4">
                  <span style="color: var(--cx-chart-color-0)">Actual:</span>
                  <span text={{ tpl: "{actualValue:n;1}" }} />
                </div>
              </div>
            ),
          }}
        >
          <MarkerLine visible={hasValue(m.snapX)} x={m.snapX} />
          <SnapPointFinder
            cursorX={m.cursor.x}
            snapX={m.snapX}
            maxDistance={Infinity}
          >
            <ValueAtFinder at={m.snapX} value={m.idealValue}>
              <LineGraph
                data={idealData}
                xField="date"
                yField="tasks"
                colorIndex={8}
              />
            </ValueAtFinder>
          </SnapPointFinder>
          <Marker
            visible={hasValue(m.idealValue)}
            x={m.snapX}
            y={m.idealValue}
            colorIndex={8}
            size={6}
          />
          <ValueAtFinder at={m.snapX} value={m.actualValue}>
            <LineGraph
              data={actualData}
              xField="date"
              yField="tasks"
              colorIndex={0}
            />
          </ValueAtFinder>
          <Marker
            visible={hasValue(m.actualValue)}
            x={m.snapX}
            y={m.actualValue}
            colorIndex={0}
            size={6}
          />
        </MouseTracker>
      </Chart>
    </Svg>
  </DashboardWidget>
));

const IssuesChartWidget = createFunctionalComponent(() => (
  <DashboardWidget title="Issues by Type" icon="bar-chart">
    <Svg style="flex: 1; width: 100%; height: 100%;">
      <Chart
        margin="5 5 25 30"
        axes={{
          x: { type: CategoryAxis, snapToTicks: 0 },
          y: { type: NumericAxis, vertical: true, snapToTicks: 1 },
        }}
      >
        <Gridlines />
        <ColumnGraph
          data={issuesData}
          xField="type"
          yField="count"
          colorIndex={0}
          size={0.6}
          tooltip={{
            text: { tpl: "{$record.type}: {$record.count}" },
            placement: "up",
          }}
        />
      </Chart>
    </Svg>
  </DashboardWidget>
));

const sprintTotal = sprintData.reduce((sum, d) => sum + d.count, 0);

const SprintWidget = createFunctionalComponent(() => (
  <DashboardWidget title="Sprint Completion" icon="pie-chart">
    <Svg class="self-stretch grow h-auto!">

      <PieLabelsContainer>
        <PieChart>
          <Repeater records={sprintData} recordAlias={m.$record}>
            <PieSlice
              value={m.$record.count}
              colorIndex={m.$record.color}
              name={m.$record.text}
              r={80}
              r0={50}
              innerPointRadius={80}
              outerPointRadius={95}
            >
              <Line style="stroke: currentColor; opacity: 0.5" />
              <PieLabel
                anchors="1 1 1 1"
                distance={50}
                lineStroke="currentColor"
              >
                <Text
                  value={expr(
                    m.$record.text,
                    m.$record.count,
                    (text, count) =>
                      `${text} (${Math.round((count / sprintTotal) * 100)}%)`,
                  )}
                  style="font-size: 11px"
                  dominantBaseline="middle"
                  autoTextAnchor
                  anchors="0.5 1 0.5 0"
                  margin="0 3 0 3"
                />
              </PieLabel>
            </PieSlice>
          </Repeater>
        </PieChart>
      </PieLabelsContainer>
      <Text
        textAnchor="middle"
        dominantBaseline="middle"
        style="font-size: 18px; font-weight: 600"
      >
        85%
      </Text>
    </Svg>
  </DashboardWidget>
));

const IssuesGridWidget = createFunctionalComponent(() => (
  <DashboardWidget title="Open Issues" icon="list-todo">
    <Grid
      records={issuesData}
      scrollable
      style="flex: 1"
      defaultSortField="count"
      defaultSortDirection="DESC"
      columns={[
        { field: "type", header: "Type", sortable: true },
        { field: "count", header: "Count", align: "right", sortable: true },
      ]}
    />
  </DashboardWidget>
));

const VelocityWidget = createFunctionalComponent(() => (
  <DashboardWidget title="Team Velocity" icon="zap">
    <Svg style="flex: 1; width: 100%; height: 100%;">
      <Chart
        margin="5 5 25 30"
        axes={{
          x: { type: CategoryAxis, snapToTicks: 0 },
          y: { type: NumericAxis, vertical: true, snapToTicks: 1 },
        }}
      >
        <Gridlines />
        <ColumnGraph
          data={velocityData}
          xField="sprint"
          yField="points"
          colorIndex={4}
          size={0.6}
          tooltip={{
            text: { tpl: "{$record.sprint}: {$record.points} points" },
            placement: "up",
          }}
        />
      </Chart>
    </Svg>
  </DashboardWidget>
));

const ActivityWidget = createFunctionalComponent(() => (
  <DashboardWidget title="Recent Activity" icon="activity">
    <Grid
      records={activityData}
      scrollable
      style="flex: 1"
      columns={[
        { field: "user", header: "User", style: "width: 80px", sortable: true },
        { field: "action", header: "Action", sortable: true },
      ]}
    />
  </DashboardWidget>
));

// Widget map for ContentResolver
const widgetMap: Record<string, any> = {
  burndown: <BurndownWidget />,
  "issues-chart": <IssuesChartWidget />,
  sprint: <SprintWidget />,
  "issues-grid": <IssuesGridWidget />,
  velocity: <VelocityWidget />,
  activity: <ActivityWidget />,
};

// @index
export default (
  <div
    controller={DashboardController}
    class="p-4 bg-gray-100 min-h-[450px] rounded-lg"
  >
    <div class="grid grid-cols-3 gap-3">
      <Repeater
        records={m.widgets}
        recordAlias={m.$widget}
        indexAlias={m.$widgetIndex}
        keyField="id"
      >
        <DropZone
          onDropTest={(e) => e.source.data.type === "widget"}
          onDrop={(e, { store }) => {
            store.update(
              m.widgets,
              swapElements,
              e.source.data.index,
              store.get(m.$widgetIndex),
            );
          }}
          inflate={100}
          overStyle="outline: 2px solid #60a5fa; outline-offset: 2px;"
        >
          <DragSource
            data={{ index: m.$widgetIndex, type: "widget" }}
            handled
            cloneStyle={{ opacity: 0.8, transform: "rotate(1deg)" }}
          >
            <ContentResolver
              params={{ type: m.$widget.type }}
              onResolve={(params) => widgetMap[params.type]}
            />
          </DragSource>
        </DropZone>
      </Repeater>
    </div>
  </div>
);
// @index-end
