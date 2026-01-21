/** @typedef {{ title: string; slug: string }} NavItem */
/** @typedef {{ title: string; items: NavItem[] }} NavGroup */
/** @typedef {{ title: string; slug: string; groups: NavGroup[] }} NavCategory */

/** @type {NavCategory[]} */
export const navigation = [
  {
    title: "Introduction",
    slug: "intro",
    groups: [
      {
        title: "Getting Started",
        items: [
          { title: "What is CxJS", slug: "what-is-cxjs" },
          { title: "Hello World", slug: "hello-world" },
          { title: "Installation", slug: "installation" },
          { title: "Themes", slug: "themes" },
          { title: "Tailwind CSS", slug: "tailwind-css" },
          { title: "Application Templates", slug: "application-templates" },
        ],
      },
      {
        title: "Basics",
        items: [
          { title: "JSX Syntax", slug: "jsx-syntax" },
          { title: "Typed Models", slug: "typed-models" },
          { title: "Store", slug: "store" },
          { title: "Data Binding", slug: "data-binding" },
          { title: "Controllers", slug: "controllers" },
          { title: "Formatting", slug: "formatting" },
        ],
      },
      {
        title: "Core Components",
        items: [
          { title: "HtmlElement", slug: "html-element" },
          { title: "PureContainer", slug: "pure-container" },
          { title: "ContentResolver", slug: "content-resolver" },
        ],
      },
      {
        title: "Authoring Widgets",
        items: [
          { title: "Functional Components", slug: "functional-components" },
          { title: "Custom Components", slug: "custom-components" },
        ],
      },
      {
        title: "Migration",
        items: [
          { title: "Changelog", slug: "changelog" },
          { title: "Breaking Changes", slug: "breaking-changes" },
          { title: "Migration Guide", slug: "migration-guide" },
        ],
      },
      {
        title: "Resources",
        items: [{ title: "Sample Applications", slug: "sample-applications" }],
      },
    ],
  },
  {
    title: "Concepts",
    slug: "concepts",
    groups: [
      {
        title: "Selections",
        items: [
          { title: "Overview", slug: "selections" },
          { title: "KeySelection", slug: "key-selection" },
          { title: "SimpleSelection", slug: "simple-selection" },
          { title: "PropertySelection", slug: "property-selection" },
        ],
      },
      {
        title: "Routing",
        items: [
          { title: "Overview", slug: "routing" },
          { title: "Route", slug: "route" },
          { title: "RedirectRoute", slug: "redirect-route" },
          { title: "Url", slug: "url" },
          { title: "History", slug: "history" },
        ],
      },
      {
        title: "Data Views",
        items: [
          { title: "Overview", slug: "data-views" },
          { title: "Repeater", slug: "repeater" },
          { title: "Sandbox", slug: "sandbox" },
          { title: "PrivateStore", slug: "private-store" },
          { title: "DataProxy", slug: "data-proxy" },
          { title: "Rescope", slug: "rescope" },
        ],
      },
      {
        title: "Drag & Drop",
        items: [
          { title: "Overview", slug: "drag-and-drop" },
          { title: "DragSource", slug: "drag-source" },
          { title: "DropZone", slug: "drop-zone" },
          { title: "DragHandle", slug: "drag-handle" },
        ],
      },
      {
        title: "Advanced",
        items: [
          { title: "Keyboard Shortcuts", slug: "keyboard-shortcuts" },
          { title: "Localization", slug: "localization" },
          { title: "DetachedScope", slug: "detached-scope" },
          { title: "IsolatedScope", slug: "isolated-scope" },
        ],
      },
    ],
  },
  {
    title: "Layout",
    slug: "layout",
    groups: [
      {
        title: "General Purpose",
        items: [
          { title: "Button", slug: "button" },
          { title: "Tab", slug: "tabs" },
          { title: "Heading", slug: "heading" },
          { title: "Text", slug: "text" },
          { title: "Link", slug: "link" },
          { title: "LinkButton", slug: "link-button" },
          { title: "Icon", slug: "icon" },
          { title: "ProgressBar", slug: "progress-bar" },
          { title: "Resizer", slug: "resizer" },
          { title: "HScroller", slug: "hscroller" },
          { title: "FlexBox", slug: "flexbox" },
          { title: "Section", slug: "section" },
        ],
      },
      {
        title: "App Layout",
        items: [
          { title: "Outer Layouts", slug: "outer-layouts" },
          { title: "ContentPlaceholder", slug: "content-placeholder" },
          { title: "Content", slug: "content" },
        ],
      },
      {
        title: "Inner Layouts",
        items: [
          { title: "Overview", slug: "inner-layouts" },
          { title: "LabelsLeftLayout", slug: "labels-left-layout" },
          { title: "LabelsTopLayout", slug: "labels-top-layout" },
          {
            title: "FirstVisibleChildLayout",
            slug: "first-visible-child-layout",
          },
          { title: "UseParentLayout", slug: "use-parent-layout" },
        ],
      },
      {
        title: "Overlays",
        items: [
          { title: "Window", slug: "window" },
          { title: "Overlay", slug: "overlay" },
          { title: "Tooltip", slug: "tooltip" },
          { title: "Toast", slug: "toast" },
          { title: "MsgBox", slug: "msgbox" },
          {
            title: "FlyweightTooltipTracker",
            slug: "flyweight-tooltip-tracker",
          },
        ],
      },
      {
        title: "Menus",
        items: [
          { title: "Menu", slug: "menu" },
          { title: "ContextMenu", slug: "context-menu" },
          { title: "Dropdown", slug: "dropdown" },
        ],
      },
    ],
  },
  {
    title: "Forms",
    slug: "forms",
    groups: [
      {
        title: "Fields",
        items: [
          { title: "TextField", slug: "text-field" },
          { title: "TextArea", slug: "text-area" },
          { title: "NumberField", slug: "number-field" },
          { title: "Checkbox", slug: "checkbox" },
          { title: "Radio", slug: "radio" },
          { title: "Select", slug: "select" },
          { title: "Switch", slug: "switch" },
        ],
      },
      {
        title: "Validation",
        items: [
          { title: "Overview", slug: "validation" },
          { title: "ValidationGroup", slug: "validation-group" },
          { title: "Validator", slug: "validator" },
          { title: "ValidationError", slug: "validation-error" },
        ],
      },
      {
        title: "Lookups",
        items: [
          { title: "LookupField", slug: "lookup-field" },
          { title: "Custom Bindings", slug: "custom-lookup-bindings" },
          { title: "Infinite List", slug: "infinite-lookup-list" },
          { title: "Options Filter", slug: "lookup-options-filter" },
          { title: "Options Grouping", slug: "lookup-options-grouping" },
        ],
      },
      {
        title: "Date & Time",
        items: [
          { title: "DateField", slug: "date-field" },
          { title: "Calendar", slug: "calendar" },
          { title: "DateTimeField", slug: "date-time-field" },
          { title: "MonthField", slug: "month-field" },
          { title: "MonthPicker", slug: "month-picker" },
        ],
      },
      {
        title: "File Upload",
        items: [
          { title: "UploadButton", slug: "upload-button" },
          { title: "Multi-file Upload", slug: "multi-file-upload" },
        ],
      },
      {
        title: "Lists",
        items: [
          { title: "List", slug: "list" },
          { title: "Grouping", slug: "list-grouping" },
        ],
      },
      {
        title: "General",
        items: [
          { title: "ColorField", slug: "color-field" },
          { title: "ColorPicker", slug: "color-picker" },
          { title: "Slider", slug: "slider" },
          { title: "Label", slug: "label" },
          { title: "FieldGroup", slug: "field-group" },
          { title: "LabeledContainer", slug: "labeled-container" },
          { title: "HighlightedSearchText", slug: "highlighted-search-text" },
        ],
      },
    ],
  },
  {
    title: "Tables",
    slug: "tables",
    groups: [
      {
        title: "Basics",
        items: [
          { title: "Grid", slug: "grid" },
          { title: "Searching and Filtering", slug: "searching-and-filtering" },
          { title: "Pagination", slug: "pagination" },
          { title: "Multiple Selection", slug: "multiple-selection" },
          { title: "Buffering", slug: "buffering" },
          { title: "Infinite Scrolling", slug: "infinite-scrolling" },
        ],
      },
      {
        title: "Columns",
        items: [
          { title: "Complex Headers", slug: "complex-headers" },
          { title: "Header Menu", slug: "header-menu" },
          { title: "Column Resizing", slug: "column-resizing" },
          { title: "Dynamic Columns", slug: "dynamic-columns" },
          { title: "Column Reordering", slug: "column-reordering" },
          { title: "Fixed Columns", slug: "fixed-columns" },
        ],
      },
      {
        title: "Rows",
        items: [
          { title: "Row Expanding", slug: "row-expanding" },
          { title: "Row Drag and Drop", slug: "row-drag-and-drop" },
        ],
      },
      {
        title: "Editing",
        items: [
          { title: "Cell Editing", slug: "cell-editing" },
          { title: "Row Editing", slug: "row-editing" },
          { title: "Inline Edit", slug: "inline-edit" },
          { title: "Form Edit", slug: "form-edit" },
        ],
      },
      {
        title: "Data Adapters",
        items: [
          { title: "Overview", slug: "data-adapters" },
          { title: "ArrayAdapter", slug: "array-adapter" },
          { title: "GroupAdapter", slug: "group-adapter" },
          { title: "TreeAdapter", slug: "tree-adapter" },
        ],
      },
      {
        title: "Grouping",
        items: [
          { title: "Grouping", slug: "grouping" },
          { title: "Dynamic Grouping", slug: "dynamic-grouping" },
        ],
      },
      {
        title: "Trees",
        items: [
          { title: "TreeNode", slug: "tree-node" },
          { title: "Tree Grid", slug: "tree-grid" },
          { title: "Searching Tree Grids", slug: "searching-tree-grids" },
          { title: "Tree Operations", slug: "tree-operations" },
          { title: "Tree Drag and Drop", slug: "tree-drag-and-drop" },
        ],
      },
    ],
  },
  {
    title: "Charts",
    slug: "charts",
    groups: [
      {
        title: "SVG Primitives",
        items: [
          { title: "Svg", slug: "svg" },
          { title: "Rectangle", slug: "rectangle" },
          { title: "Ellipse", slug: "ellipse" },
          { title: "Line", slug: "line" },
          { title: "Text", slug: "text" },
          { title: "ClipRect", slug: "clip-rect" },
          { title: "NonOverlappingRect", slug: "non-overlapping-rect" },
        ],
      },
      {
        title: "Chart Basics",
        items: [
          { title: "Overview", slug: "overview" },
          { title: "Chart", slug: "chart" },
          { title: "Gridlines", slug: "gridlines" },
          { title: "Legend", slug: "legend" },
        ],
      },
      {
        title: "Axes",
        items: [
          { title: "NumericAxis", slug: "numeric-axis" },
          { title: "CategoryAxis", slug: "category-axis" },
          { title: "TimeAxis", slug: "time-axis" },
          { title: "Complex Labels", slug: "complex-axis-labels" },
          { title: "Calculated Height", slug: "calculated-chart-height" },
        ],
      },
      {
        title: "Line Graphs",
        items: [
          { title: "LineGraph", slug: "line-graph" },
          { title: "Stacked Lines Example", slug: "stacked-lines" },
        ],
      },
      {
        title: "Bars and Columns",
        items: [
          { title: "BarGraph", slug: "bar-graph" },
          { title: "Bar", slug: "bar" },
          { title: "ColumnGraph", slug: "column-graph" },
          { title: "Column", slug: "column" },
          { title: "Stacked Bars Example", slug: "stacked-bars" },
          { title: "Stacked Columns Example", slug: "stacked-columns" },
          { title: "Normalized Columns Example", slug: "normalized-columns" },
          { title: "Auto Width Columns Example", slug: "auto-width-columns" },
          { title: "Bar Bullets Example", slug: "bar-bullets" },
          { title: "Scrollable Bars Example", slug: "scrollable-bars" },
          { title: "Timeline Example", slug: "timeline" },
          { title: "Combined Chart Example", slug: "combined-chart" },
        ],
      },
      {
        title: "Pie Charts",
        items: [
          { title: "PieChart", slug: "pie-chart" },
          { title: "PieLabel", slug: "pie-label" },
          { title: "Multi-level Pie Example", slug: "multi-level-pie" },
        ],
      },
      {
        title: "Markers and Ranges",
        items: [
          { title: "Marker", slug: "marker" },
          { title: "ScatterGraph", slug: "scatter-graph" },
          { title: "MarkerLine", slug: "marker-line" },
          { title: "Range", slug: "range" },
          { title: "RangeMarker", slug: "range-marker" },
          { title: "Swimlane", slug: "swimlane" },
          { title: "Swimlanes", slug: "swimlanes" },
        ],
      },
      {
        title: "Utilities",
        items: [
          { title: "ColorMap", slug: "color-map" },
          { title: "HoverSync", slug: "hover-sync" },
          { title: "MouseTracker", slug: "mouse-tracker" },
          { title: "MinMaxFinder", slug: "min-max-finder" },
          { title: "SnapPointFinder", slug: "snap-point-finder" },
          { title: "ValueAtFinder", slug: "value-at-finder" },
          { title: "PointReducers", slug: "point-reducers" },
        ],
      },
    ],
  },
  {
    title: "Utilities",
    slug: "utilities",
    groups: [
      {
        title: "Data",
        items: [
          { title: "updateTree", slug: "update-tree" },
          { title: "findTreeNode", slug: "find-tree-node" },
          { title: "removeTreeNodes", slug: "remove-tree-nodes" },
        ],
      },
      {
        title: "Functions",
        items: [
          { title: "Color", slug: "color" },
          { title: "Date", slug: "date" },
          { title: "DOM", slug: "dom" },
          { title: "Misc", slug: "misc" },
        ],
      },
    ],
  },
];

/**
 * @param {string} categorySlug
 * @returns {NavCategory | undefined}
 */
export function getNavigationForCategory(categorySlug) {
  return navigation.find((cat) => cat.slug === categorySlug);
}

/**
 * @param {string} pathname
 * @returns {NavCategory | undefined}
 */
export function getCurrentCategory(pathname) {
  return navigation.find((cat) => pathname.includes(`/docs/${cat.slug}/`));
}
