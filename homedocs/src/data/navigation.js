/** @typedef {{ title: string; slug: string, llms?: 'small' | 'full', description?: string }} NavItem */
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
          {
            title: "What is CxJS",
            slug: "what-is-cxjs",
            llms: "small",
            description:
              "Overview of CxJS framework, its purpose, and key features",
          },
          {
            title: "Hello World",
            slug: "hello-world",
            llms: "small",
            description: "Build your first CxJS application step by step",
          },
          {
            title: "Installation",
            slug: "installation",
            llms: "small",
            description: "Set up CxJS in your project using npm or yarn",
          },
          {
            title: "Themes",
            slug: "themes",
            description:
              "Apply and customize visual themes for your application",
          },
          {
            title: "Tailwind CSS",
            slug: "tailwind-css",
            llms: "small",
            description:
              "Integrate Tailwind CSS with CxJS for utility-first styling",
          },
          {
            title: "Application Templates",
            slug: "application-templates",
            description: "Starter templates and boilerplates for new projects",
          },
          {
            title: "AI (Skills)",
            slug: "ai",
            description: "Using AI coding assistants with CxJS",
          },
        ],
      },
      {
        title: "Basics",
        items: [
          {
            title: "JSX Syntax",
            slug: "jsx-syntax",
            llms: "small",
            description: "CxJS-specific JSX syntax and configuration options",
          },
          {
            title: "Typed Models",
            slug: "typed-models",
            llms: "small",
            description: "Define type-safe data models with createModel",
          },
          {
            title: "Store",
            slug: "store",
            llms: "small",
            description: "Central state container for application data",
          },
          {
            title: "Data Binding",
            slug: "data-binding",
            llms: "small",
            description: "Connect UI components to store data with bindings",
          },
          {
            title: "Controllers",
            slug: "controllers",
            llms: "small",
            description: "Encapsulate business logic and computed values",
          },
          {
            title: "Formatting",
            slug: "formatting",
            llms: "small",
            description: "Format numbers, dates, and text for display",
          },
        ],
      },
      {
        title: "Core Components",
        items: [
          {
            title: "HtmlElement",
            slug: "html-element",
            llms: "small",
            description:
              "Base component for rendering HTML elements with bindings",
          },
          {
            title: "PureContainer",
            slug: "pure-container",
            llms: "small",
            description: "Invisible container for grouping child components",
          },
          {
            title: "ContentResolver",
            slug: "content-resolver",
            llms: "small",
            description: "Dynamically resolve and render content based on data",
          },
        ],
      },
      {
        title: "Authoring Widgets",
        items: [
          {
            title: "Functional Components",
            slug: "functional-components",
            llms: "small",
            description: "Create reusable components with functions",
          },
          {
            title: "Custom Components",
            slug: "custom-components",
            description: "Build custom widget classes extending CxJS base",
          },
        ],
      },
      {
        title: "Migration",
        items: [
          {
            title: "Changelog",
            slug: "changelog",
            description: "Version history and release notes",
          },
          {
            title: "Breaking Changes",
            slug: "breaking-changes",
            description: "List of breaking changes between major versions",
          },
          {
            title: "Migration Guide",
            slug: "migration-guide",
            description: "Step-by-step guide for upgrading CxJS versions",
          },
        ],
      },
      {
        title: "Resources",
        items: [
          {
            title: "Sample Applications",
            slug: "sample-applications",
            description: "Example applications demonstrating CxJS patterns",
          },
          {
            title: "Component Libraries",
            slug: "component-libraries",
            description: "Add-on libraries that provide additional CxJS components",
          },
        ],
      },
    ],
  },
  {
    title: "Concepts",
    slug: "concepts",
    groups: [
      {
        title: "Data Views",
        items: [
          {
            title: "Overview",
            slug: "data-views",
            llms: "small",
            description: "Components that iterate and transform data",
          },
          {
            title: "Repeater",
            slug: "repeater",
            llms: "small",
            description: "Render a template for each item in an array",
          },
          {
            title: "Sandbox",
            slug: "sandbox",
            llms: "small",
            description: "Isolate store changes for cancel/save workflows",
          },
          {
            title: "PrivateStore",
            slug: "private-store",
            llms: "small",
            description: "Create isolated store instances for components",
          },
          {
            title: "DataProxy",
            slug: "data-proxy",
            llms: "small",
            description: "Transform data between parent and child stores",
          },
          {
            title: "Rescope",
            slug: "rescope",
            description: "Remap store paths for nested components",
          },
        ],
      },
      {
        title: "Selections",
        items: [
          {
            title: "Overview",
            slug: "selections",
            llms: "small",
            description: "Track selected items in lists and grids",
          },
          {
            title: "KeySelection",
            slug: "key-selection",
            llms: "small",
            description: "Select items by unique key identifier",
          },
          {
            title: "SimpleSelection",
            slug: "simple-selection",
            description: "Basic single-item selection",
          },
          {
            title: "PropertySelection",
            slug: "property-selection",
            description: "Selection stored in record properties",
          },
        ],
      },
      {
        title: "Routing",
        items: [
          {
            title: "Overview",
            slug: "routing",
            llms: "small",
            description: "Client-side routing and navigation",
          },
          {
            title: "Route",
            slug: "route",
            llms: "small",
            description: "Define routes and render content based on URL",
          },
          {
            title: "RedirectRoute",
            slug: "redirect-route",
            description: "Automatically redirect between routes",
          },
          {
            title: "Url",
            slug: "url",
            llms: "small",
            description: "Build and parse URLs with parameters",
          },
          {
            title: "History",
            slug: "history",
            llms: "small",
            description: "Manage browser history and navigation state",
          },
        ],
      },
      {
        title: "Drag & Drop",
        items: [
          {
            title: "Overview",
            slug: "drag-and-drop",
            llms: "small",
            description: "Implement drag and drop interactions",
          },
          {
            title: "DragSource",
            slug: "drag-source",
            description: "Make elements draggable",
          },
          {
            title: "DropZone",
            slug: "drop-zone",
            description: "Define areas that accept dropped items",
          },
          {
            title: "DragHandle",
            slug: "drag-handle",
            description: "Restrict drag initiation to specific handles",
          },
        ],
      },
      {
        title: "Advanced",
        items: [
          {
            title: "Keyboard Shortcuts",
            slug: "keyboard-shortcuts",
            description: "Register and handle keyboard shortcuts",
          },
          {
            title: "Localization",
            slug: "localization",
            description: "Translate UI text and format locale-specific data",
          },
          {
            title: "DetachedScope",
            slug: "detached-scope",
            description: "Render components outside the normal hierarchy",
          },
          {
            title: "IsolatedScope",
            slug: "isolated-scope",
            description: "Prevent store access from parent context",
          },
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
          {
            title: "Button",
            slug: "button",
            llms: "small",
            description: "Clickable button with various styles and states",
          },
          {
            title: "Tab",
            slug: "tabs",
            llms: "small",
            description: "Tabbed interface for switching between views",
          },
          {
            title: "Heading",
            slug: "heading",
            description: "Semantic heading elements (h1-h6)",
          },
          {
            title: "Text",
            slug: "text",
            llms: "small",
            description: "Text display with formatting and bindings",
          },
          {
            title: "Link",
            slug: "link",
            llms: "small",
            description: "Navigation links with routing support",
          },
          {
            title: "LinkButton",
            slug: "link-button",
            description: "Button styled as a link",
          },
          {
            title: "Icon",
            slug: "icon",
            llms: "small",
            description: "Display icons from icon libraries",
          },
          {
            title: "ProgressBar",
            slug: "progress-bar",
            description: "Visual progress indicator",
          },
          {
            title: "Resizer",
            slug: "resizer",
            description: "Draggable resize handle for panels",
          },
          {
            title: "HScroller",
            slug: "hscroller",
            description: "Horizontal scrolling container",
          },
          {
            title: "FlexBox",
            slug: "flexbox",
            description: "Flexbox-based layout container",
          },
          {
            title: "Section",
            slug: "section",
            description: "Card-like container with header and body",
          },
        ],
      },
      {
        title: "App Layout",
        items: [
          {
            title: "Outer Layouts",
            slug: "outer-layouts",
            llms: "small",
            description: "Page-level layout templates",
          },
          {
            title: "ContentPlaceholder",
            slug: "content-placeholder",
            llms: "small",
            description: "Named slots for content injection",
          },
          {
            title: "Content",
            slug: "content",
            llms: "small",
            description: "Inject content into layout placeholders",
          },
        ],
      },
      {
        title: "Inner Layouts",
        items: [
          {
            title: "Overview",
            slug: "inner-layouts",
            llms: "small",
            description: "Arrange form fields and labels",
          },
          {
            title: "LabelsLeftLayout",
            slug: "labels-left-layout",
            llms: "small",
            description: "Labels positioned to the left of fields",
          },
          {
            title: "LabelsTopLayout",
            slug: "labels-top-layout",
            llms: "small",
            description: "Labels positioned above fields",
          },
          {
            title: "FirstVisibleChildLayout",
            slug: "first-visible-child-layout",
            llms: "small",
            description: "Show only the first visible child",
          },
          {
            title: "UseParentLayout",
            slug: "use-parent-layout",
            llms: "small",
            description: "Inherit layout from parent component",
          },
        ],
      },
      {
        title: "Overlays",
        items: [
          {
            title: "Window",
            slug: "window",
            llms: "small",
            description: "Modal dialog window",
          },
          {
            title: "Overlay",
            slug: "overlay",
            description: "Positioned overlay container",
          },
          {
            title: "Tooltip",
            slug: "tooltip",
            llms: "small",
            description: "Hover tooltips and popovers",
          },
          {
            title: "Toast",
            slug: "toast",
            llms: "small",
            description: "Temporary notification messages",
          },
          {
            title: "MsgBox",
            slug: "msgbox",
            llms: "small",
            description: "Alert, confirm, and prompt dialogs",
          },
          {
            title: "FlyweightTooltipTracker",
            slug: "flyweight-tooltip-tracker",
            description: "Efficient tooltips for many elements",
          },
        ],
      },
      {
        title: "Menus",
        items: [
          {
            title: "Menu",
            slug: "menu",
            llms: "small",
            description: "Vertical menu with items and submenus",
          },
          {
            title: "ContextMenu",
            slug: "context-menu",
            llms: "small",
            description: "Right-click context menus",
          },
          {
            title: "Dropdown",
            slug: "dropdown",
            description: "Dropdown menu triggered by button",
          },
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
          {
            title: "TextField",
            slug: "text-field",
            llms: "small",
            description: "Single-line text input field",
          },
          {
            title: "TextArea",
            slug: "text-area",
            llms: "small",
            description: "Multi-line text input field",
          },
          {
            title: "NumberField",
            slug: "number-field",
            llms: "small",
            description: "Numeric input with formatting",
          },
          {
            title: "Checkbox",
            slug: "checkbox",
            llms: "small",
            description: "Boolean checkbox input",
          },
          {
            title: "Radio",
            slug: "radio",
            llms: "small",
            description: "Radio button for single selection",
          },
          {
            title: "Select",
            slug: "select",
            description: "Dropdown select input",
          },
          {
            title: "Switch",
            slug: "switch",
            llms: "small",
            description: "Toggle switch for boolean values",
          },
        ],
      },
      {
        title: "Validation",
        items: [
          {
            title: "Overview",
            slug: "validation",
            llms: "small",
            description: "Form validation concepts and patterns",
          },
          {
            title: "ValidationGroup",
            slug: "validation-group",
            llms: "small",
            description: "Group fields for collective validation",
          },
          {
            title: "Validator",
            slug: "validator",
            description: "Custom validation rules",
          },
          {
            title: "ValidationError",
            slug: "validation-error",
            description: "Display validation error messages",
          },
        ],
      },
      {
        title: "Lookups",
        items: [
          {
            title: "LookupField",
            slug: "lookup-field",
            llms: "small",
            description: "Searchable dropdown with remote data",
          },
          {
            title: "Custom Bindings",
            slug: "custom-lookup-bindings",
            description: "Bind multiple values from lookup",
          },
          {
            title: "Infinite List",
            slug: "infinite-lookup-list",
            description: "Load options on scroll",
          },
          {
            title: "Options Filter",
            slug: "lookup-options-filter",
            description: "Client-side option filtering",
          },
          {
            title: "Options Grouping",
            slug: "lookup-options-grouping",
            description: "Group options by category",
          },
        ],
      },
      {
        title: "Date & Time",
        items: [
          {
            title: "DateField",
            slug: "date-field",
            llms: "small",
            description: "Date picker input",
          },
          {
            title: "Calendar",
            slug: "calendar",
            description: "Calendar widget for date selection",
          },
          {
            title: "DateTimeField",
            slug: "date-time-field",
            description: "Combined date and time picker",
          },
          {
            title: "MonthField",
            slug: "month-field",
            description: "Month and year picker",
          },
          {
            title: "MonthPicker",
            slug: "month-picker",
            description: "Month selection calendar",
          },
        ],
      },
      {
        title: "File Upload",
        items: [
          {
            title: "UploadButton",
            slug: "upload-button",
            description: "File upload button",
          },
          {
            title: "Multi-file Upload",
            slug: "multi-file-upload",
            description: "Upload multiple files at once",
          },
        ],
      },
      {
        title: "Lists",
        items: [
          {
            title: "List",
            slug: "list",
            llms: "small",
            description: "Selectable list of items",
          },
          {
            title: "Grouping",
            slug: "list-grouping",
            description: "Group list items by category",
          },
          {
            title: "Forwarding Keyboard Inputs",
            slug: "list-forwarding-keyboard-inputs",
            description: "Forward keyboard events to the list",
          },
        ],
      },
      {
        title: "General",
        items: [
          {
            title: "ColorField",
            slug: "color-field",
            description: "Color picker input field",
          },
          {
            title: "ColorPicker",
            slug: "color-picker",
            description: "Color selection widget",
          },
          {
            title: "Slider",
            slug: "slider",
            llms: "small",
            description: "Range slider input",
          },
          { title: "Label", slug: "label", description: "Form field label" },
          {
            title: "FieldGroup",
            slug: "field-group",
            description: "Group related form fields",
          },
          {
            title: "LabeledContainer",
            slug: "labeled-container",
            llms: "small",
            description: "Container with label support",
          },
          {
            title: "HighlightedSearchText",
            slug: "highlighted-search-text",
            description: "Highlight matching search text",
          },
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
          {
            title: "Grid",
            slug: "grid",
            llms: "small",
            description: "Data grid with sorting, filtering, and selection",
          },
          {
            title: "Searching and Filtering",
            slug: "searching-and-filtering",
            llms: "small",
            description: "Filter grid data with search inputs",
          },
          {
            title: "Pagination",
            slug: "pagination",
            llms: "small",
            description: "Page through large datasets",
          },
          {
            title: "Multiple Selection",
            slug: "multiple-selection",
            description: "Select multiple grid rows",
          },
          {
            title: "Buffering",
            slug: "buffering",
            description: "Virtualized rendering for large datasets",
          },
          {
            title: "Infinite Scrolling",
            slug: "infinite-scrolling",
            description: "Load more data on scroll",
          },
        ],
      },
      {
        title: "Columns",
        items: [
          {
            title: "Complex Headers",
            slug: "complex-headers",
            description: "Multi-row and grouped column headers",
          },
          {
            title: "Header Menu",
            slug: "header-menu",
            description: "Column header dropdown menus",
          },
          {
            title: "Column Resizing",
            slug: "column-resizing",
            description: "Drag to resize column widths",
          },
          {
            title: "Dynamic Columns",
            slug: "dynamic-columns",
            description: "Add and remove columns dynamically",
          },
          {
            title: "Column Reordering",
            slug: "column-reordering",
            description: "Drag to reorder columns",
          },
          {
            title: "Fixed Columns",
            slug: "fixed-columns",
            description: "Lock columns to left or right edge",
          },
        ],
      },
      {
        title: "Rows",
        items: [
          {
            title: "Row Expanding",
            slug: "row-expanding",
            description: "Expand rows to show detail content",
          },
          {
            title: "Row Drag and Drop",
            slug: "row-drag-and-drop",
            description: "Reorder rows with drag and drop",
          },
        ],
      },
      {
        title: "Editing",
        items: [
          {
            title: "Cell Editing",
            slug: "cell-editing",
            description: "Edit individual cells inline",
          },
          {
            title: "Row Editing",
            slug: "row-editing",
            description: "Edit entire rows at once",
          },
          {
            title: "Inline Edit",
            slug: "inline-edit",
            description: "Edit data directly in the grid",
          },
          {
            title: "Form Edit",
            slug: "form-edit",
            description: "Edit rows in a separate form",
          },
        ],
      },
      {
        title: "Data Adapters",
        items: [
          {
            title: "Overview",
            slug: "data-adapters",
            description: "Transform data for grid display",
          },
          {
            title: "ArrayAdapter",
            slug: "array-adapter",
            description: "Simple array data source",
          },
          {
            title: "GroupAdapter",
            slug: "group-adapter",
            description: "Group and aggregate data",
          },
          {
            title: "TreeAdapter",
            slug: "tree-adapter",
            description: "Hierarchical tree data source",
          },
        ],
      },
      {
        title: "Grouping",
        items: [
          {
            title: "Grouping",
            slug: "grouping",
            llms: "small",
            description: "Group rows by column values",
          },
          {
            title: "Dynamic Grouping",
            slug: "dynamic-grouping",
            description: "User-controlled grouping options",
          },
        ],
      },
      {
        title: "Trees",
        items: [
          {
            title: "TreeNode",
            slug: "tree-node",
            llms: "small",
            description: "Expandable tree node component",
          },
          {
            title: "Tree Grid",
            slug: "tree-grid",
            llms: "small",
            description: "Grid with hierarchical data",
          },
          {
            title: "Searching Tree Grids",
            slug: "searching-tree-grids",
            description: "Search within tree structures",
          },
          {
            title: "Tree Operations",
            slug: "tree-operations",
            description: "Add, remove, and move tree nodes",
          },
          {
            title: "Tree Drag and Drop",
            slug: "tree-drag-and-drop",
            description: "Drag and drop in tree grids",
          },
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
          {
            title: "Svg",
            slug: "svg",
            llms: "small",
            description: "SVG container element",
          },
          {
            title: "Rectangle",
            slug: "rectangle",
            description: "SVG rectangle shape",
          },
          {
            title: "Ellipse",
            slug: "ellipse",
            description: "SVG ellipse and circle shapes",
          },
          { title: "Line", slug: "line", description: "SVG line element" },
          {
            title: "Text",
            slug: "text",
            description: "SVG text element with bindings",
          },
          {
            title: "ClipRect",
            slug: "clip-rect",
            description: "Clip content to rectangular region",
          },
          {
            title: "NonOverlappingRect",
            slug: "non-overlapping-rect",
            description: "Automatically position labels to avoid overlap",
          },
        ],
      },
      {
        title: "Chart Basics",
        items: [
          {
            title: "Overview",
            slug: "overview",
            llms: "small",
            description: "Introduction to CxJS charting",
          },
          {
            title: "Chart",
            slug: "chart",
            llms: "small",
            description: "Chart container with axes configuration",
          },
          {
            title: "Gridlines",
            slug: "gridlines",
            description: "Background grid lines for charts",
          },
          {
            title: "Legend",
            slug: "legend",
            description: "Chart legend for series identification",
          },
        ],
      },
      {
        title: "Axes",
        items: [
          {
            title: "NumericAxis",
            slug: "numeric-axis",
            llms: "small",
            description: "Axis for numeric data",
          },
          {
            title: "CategoryAxis",
            slug: "category-axis",
            llms: "small",
            description: "Axis for categorical data",
          },
          {
            title: "TimeAxis",
            slug: "time-axis",
            description: "Axis for date and time data",
          },
          {
            title: "Complex Labels",
            slug: "complex-axis-labels",
            description: "Custom axis label formatting",
          },
          {
            title: "Calculated Height",
            slug: "calculated-chart-height",
            description: "Dynamic chart height based on data",
          },
        ],
      },
      {
        title: "Line Graphs",
        items: [
          {
            title: "LineGraph",
            slug: "line-graph",
            llms: "small",
            description: "Line chart from data array",
          },
          {
            title: "Stacked Lines Example",
            slug: "stacked-lines",
            description: "Multiple stacked line series",
          },
        ],
      },
      {
        title: "Bars and Columns",
        items: [
          {
            title: "BarGraph",
            slug: "bar-graph",
            llms: "small",
            description: "Horizontal bar chart from data array",
          },
          {
            title: "Bar",
            slug: "bar",
            llms: "small",
            description: "Individual bar element",
          },
          {
            title: "ColumnGraph",
            slug: "column-graph",
            llms: "small",
            description: "Vertical column chart from data array",
          },
          {
            title: "Column",
            slug: "column",
            llms: "small",
            description: "Individual column element",
          },
          {
            title: "Stacked Bars Example",
            slug: "stacked-bars",
            description: "Stacked horizontal bars",
          },
          {
            title: "Stacked Columns Example",
            slug: "stacked-columns",
            description: "Stacked vertical columns",
          },
          {
            title: "Normalized Columns Example",
            slug: "normalized-columns",
            description: "100% stacked columns",
          },
          {
            title: "Auto Width Columns Example",
            slug: "auto-width-columns",
            description: "Automatically sized column widths",
          },
          {
            title: "Bar Bullets Example",
            slug: "bar-bullets",
            description: "Bar chart with bullet markers",
          },
          {
            title: "Scrollable Bars Example",
            slug: "scrollable-bars",
            description: "Scrollable bar chart for many items",
          },
          {
            title: "Timeline Example",
            slug: "timeline",
            description: "Timeline visualization with bars",
          },
          {
            title: "Combined Chart Example",
            slug: "combined-chart",
            description: "Mix bars with other chart types",
          },
        ],
      },
      {
        title: "Pie Charts",
        items: [
          {
            title: "PieChart",
            slug: "pie-chart",
            llms: "small",
            description: "Pie and donut charts",
          },
          {
            title: "PieLabel",
            slug: "pie-label",
            description: "Labels for pie slices",
          },
          {
            title: "Multi-level Pie Example",
            slug: "multi-level-pie",
            description: "Nested pie charts",
          },
        ],
      },
      {
        title: "Markers and Ranges",
        items: [
          {
            title: "Marker",
            slug: "marker",
            llms: "small",
            description: "Point marker on chart",
          },
          {
            title: "ScatterGraph",
            slug: "scatter-graph",
            llms: "small",
            description: "Scatter plot from data array",
          },
          {
            title: "MarkerLine",
            slug: "marker-line",
            llms: "small",
            description: "Vertical or horizontal reference line",
          },
          {
            title: "Range",
            slug: "range",
            description: "Shaded range area on chart",
          },
          {
            title: "RangeMarker",
            slug: "range-marker",
            description: "Range marker with labels",
          },
          {
            title: "Swimlane",
            slug: "swimlane",
            description: "Horizontal swimlane band",
          },
          {
            title: "Swimlanes",
            slug: "swimlanes",
            description: "Multiple swimlane bands",
          },
        ],
      },
      {
        title: "Utilities",
        items: [
          {
            title: "ColorMap",
            slug: "color-map",
            llms: "small",
            description: "Map data values to colors",
          },
          {
            title: "MouseTracker",
            slug: "mouse-tracker",
            description: "Track mouse position on chart",
          },
          {
            title: "MinMaxFinder",
            slug: "min-max-finder",
            description: "Find min/max values in data",
          },
          {
            title: "SnapPointFinder",
            slug: "snap-point-finder",
            description: "Snap cursor to nearest data point",
          },
          {
            title: "ValueAtFinder",
            slug: "value-at-finder",
            description: "Find value at cursor position",
          },
          {
            title: "PointReducers",
            slug: "point-reducers",
            description: "Aggregate and reduce chart data",
          },
          {
            title: "HoverSync",
            slug: "hover-sync",
            description: "Synchronize hover state across charts",
          },
          {
            title: "HoverSyncElement",
            slug: "hover-sync-element",
            description: "Apply hover effects to arbitrary elements",
          },
        ],
      },
    ],
  },
  {
    title: "Utilities",
    slug: "utilities",
    groups: [
      {
        title: "Data Operations",
        items: [
          {
            title: "updateArray",
            slug: "update-array",
            llms: "small",
            description: "Immutably update array elements",
          },
          {
            title: "append",
            slug: "append",
            llms: "small",
            description: "Append elements to array",
          },
          { title: "merge", slug: "merge", description: "Deep merge objects" },
          {
            title: "filter",
            slug: "filter",
            llms: "small",
            description: "Filter array with predicate",
          },
          {
            title: "moveElement",
            slug: "move-element",
            description: "Move element within array",
          },
          {
            title: "insertElement",
            slug: "insert-element",
            description: "Insert element at index",
          },
          {
            title: "diffArrays",
            slug: "diff-arrays",
            description: "Compare two arrays for differences",
          },
        ],
      },
      {
        title: "Tree Operations",
        items: [
          {
            title: "updateTree",
            slug: "update-tree",
            llms: "small",
            description: "Immutably update tree nodes",
          },
          {
            title: "findTreeNode",
            slug: "find-tree-node",
            llms: "small",
            description: "Find node in tree structure",
          },
          {
            title: "findTreePath",
            slug: "find-tree-path",
            description: "Get path to tree node",
          },
          {
            title: "removeTreeNodes",
            slug: "remove-tree-nodes",
            llms: "small",
            description: "Remove nodes from tree",
          },
        ],
      },
      {
        title: "Selectors & Computed",
        items: [
          {
            title: "Grouper",
            slug: "grouper",
            description: "Group and aggregate data",
          },
          {
            title: "getComparer",
            slug: "get-comparer",
            description: "Create comparison function",
          },
          {
            title: "Expression",
            slug: "expression",
            description: "Dynamic expression evaluation",
          },
        ],
      },
      {
        title: "Functions",
        items: [
          {
            title: "debounce",
            slug: "debounce",
            description: "Delay function execution",
          },
          {
            title: "validatedDebounce",
            slug: "validated-debounce",
            description: "Debounce with validation",
          },
          {
            title: "throttle",
            slug: "throttle",
            description: "Limit function call frequency",
          },
          {
            title: "shallowEquals",
            slug: "shallow-equals",
            description: "Shallow object comparison",
          },
          {
            title: "coalesce",
            slug: "coalesce",
            description: "Return first defined value",
          },
        ],
      },
      {
        title: "Search",
        items: [
          {
            title: "getSearchQueryPredicate",
            slug: "get-search-query-predicate",
            llms: "small",
            description: "Create search filter function",
          },
          {
            title: "getSearchQueryHighlighter",
            slug: "get-search-query-highlighter",
            description: "Highlight search matches",
          },
          {
            title: "escapeSpecialRegexCharacters",
            slug: "escape-special-regex-characters",
            description: "Escape regex special chars",
          },
        ],
      },
      {
        title: "Color",
        items: [
          {
            title: "parseColor",
            slug: "parse-color",
            description: "Parse color strings",
          },
          {
            title: "Color Conversions",
            slug: "color-conversions",
            description: "Convert between color formats",
          },
        ],
      },
      {
        title: "Date",
        items: [
          {
            title: "zeroTime",
            slug: "zero-time",
            description: "Set time to midnight",
          },
          {
            title: "monthStart",
            slug: "month-start",
            description: "Get first day of month",
          },
          {
            title: "dateDiff",
            slug: "date-diff",
            description: "Calculate date difference",
          },
          {
            title: "sameDate",
            slug: "same-date",
            description: "Compare dates ignoring time",
          },
          {
            title: "minDate / maxDate",
            slug: "min-max-date",
            description: "Find earliest or latest date",
          },
          {
            title: "encodeDate",
            slug: "encode-date",
            description: "Encode date as string",
          },
          {
            title: "parseDateInvariant",
            slug: "parse-date-invariant",
            description: "Parse date in invariant format",
          },
        ],
      },
      {
        title: "DOM",
        items: [
          {
            title: "findFirst / closest",
            slug: "find-first-closest",
            description: "Find DOM elements",
          },
          {
            title: "isFocusable",
            slug: "is-focusable",
            description: "Check if element is focusable",
          },
          {
            title: "getActiveElement",
            slug: "get-active-element",
            description: "Get currently focused element",
          },
          {
            title: "scrollElementIntoView",
            slug: "scroll-element-into-view",
            description: "Scroll element into viewport",
          },
          {
            title: "findScrollableParent",
            slug: "find-scrollable-parent",
            description: "Find scrollable ancestor",
          },
          {
            title: "getScrollerBoundingClientRect",
            slug: "get-scroller-bounding-client-rect",
            description: "Get scroller bounds",
          },
          {
            title: "getTopLevelBoundingClientRect",
            slug: "get-top-level-bounding-client-rect",
            description: "Get top-level element bounds",
          },
          {
            title: "getParentFrameBoundingClientRect",
            slug: "get-parent-frame-bounding-client-rect",
            description: "Get parent frame bounds",
          },
          {
            title: "KeyCode",
            slug: "key-code",
            description: "Keyboard key code constants",
          },
        ],
      },
      {
        title: "Type Guards",
        items: [
          {
            title: "isArray",
            slug: "is-array",
            llms: "small",
            description: "Check if value is array",
          },
          {
            title: "isObject",
            slug: "is-object",
            description: "Check if value is object",
          },
          {
            title: "isString",
            slug: "is-string",
            llms: "small",
            description: "Check if value is string",
          },
          {
            title: "isNumber",
            slug: "is-number",
            llms: "small",
            description: "Check if value is number",
          },
          {
            title: "isFunction",
            slug: "is-function",
            llms: "small",
            description: "Check if value is function",
          },
          {
            title: "isDefined",
            slug: "is-defined",
            llms: "small",
            description: "Check if value is defined",
          },
          {
            title: "isUndefined",
            slug: "is-undefined",
            llms: "small",
            description: "Check if value is undefined",
          },
          {
            title: "isNonEmptyArray",
            slug: "is-non-empty-array",
            llms: "small",
            description: "Check for non-empty array",
          },
          {
            title: "isPromise",
            slug: "is-promise",
            description: "Check if value is promise",
          },
          {
            title: "isDigit",
            slug: "is-digit",
            description: "Check if character is digit",
          },
          {
            title: "isTouchDevice",
            slug: "is-touch-device",
            description: "Detect touch-capable device",
          },
          {
            title: "isTouchEvent",
            slug: "is-touch-event",
            description: "Check if event is touch event",
          },
        ],
      },
      {
        title: "Misc",
        items: [
          {
            title: "Console",
            slug: "console",
            description: "Debug logging utilities",
          },
          {
            title: "Event Callbacks",
            slug: "event-callbacks",
            description: "Event handling helpers",
          },
          {
            title: "parseStyle",
            slug: "parse-style",
            description: "Parse CSS style strings",
          },
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
