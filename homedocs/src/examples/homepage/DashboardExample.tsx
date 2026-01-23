import { createModel } from "cx/data";
import {
  Controller,
  Repeater,
  ContentResolver,
  createFunctionalComponent,
  enableCultureSensitiveFormatting,
} from "cx/ui";
import { Svg, Text } from "cx/svg";
import {
  Chart,
  LineGraph,
  ColumnGraph,
  PieChart,
  PieSlice,
  Gridlines,
  TimeAxis,
  NumericAxis,
  CategoryAxis,
  Legend,
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
        <LineGraph
          data={idealData}
          xField="date"
          yField="tasks"
          colorIndex={8}
        />
        <LineGraph
          data={actualData}
          xField="date"
          yField="tasks"
          colorIndex={0}
        />
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
        />
      </Chart>
    </Svg>
  </DashboardWidget>
));

const SprintWidget = createFunctionalComponent(() => (
  <DashboardWidget title="Sprint Completion" icon="pie-chart">
    <Legend.Scope>
      <div class="flex items-center justify-center flex-1">
        <Svg class="self-stretch grow h-auto!">
          <PieChart>
            <Repeater records={sprintData} recordAlias={m.$record}>
              <PieSlice
                value={m.$record.count}
                colorIndex={m.$record.color}
                name={m.$record.text}
                r={90}
                r0={60}
              />
            </Repeater>
          </PieChart>
          <Text
            style="font-size: 18px; font-weight: 600"
            dy="0.4em"
            ta="middle"
          >
            85%
          </Text>
        </Svg>
        <Legend vertical class="ml-2 text-xs w-32" />
      </div>
    </Legend.Scope>
  </DashboardWidget>
));

const IssuesGridWidget = createFunctionalComponent(() => (
  <DashboardWidget title="Open Issues" icon="list-todo">
    <Grid
      records={issuesData}
      scrollable
      style="flex: 1"
      columns={[
        { field: "type", header: "Type" },
        { field: "count", header: "Count", align: "right" },
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
        { field: "user", header: "User", style: "width: 80px" },
        { field: "action", header: "Action" },
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
