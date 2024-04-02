# Changelog

<!--- ## Unreleased -->

## `cx@24.4.2`

**Fixes**

-  Addressed a bug where RangeMarkers were not functioning correctly when used alongside SWC.

## `cx@24.4.1`

**Features**

-  Enhanced dropInsertionIndex positioning within the grid
-  Introduced CultureScope widget
-  Introduced RangeMarker widget
-  Added functionality for adjusting pie chart gaps

**Fixes**

-  Types for ColumnGraph and LineGraph

## `cx@24.3.3`

**Features**

-  Swimlanes widget
-  Allow aggregates via aggregateAlias inside Grid

**Fixes**

-  Fix getCursorPos properly resolves position within iframes in Firefox
-  Fix drag and drop withing iframes

## `cx@24.3.0`

-  Support specifying `borderRadius` on `PieChart` slices.

## `cx@24.2.0`

**Features**

-  Documentation updates and additions
-  Currency formatting features
-  Field configurations and enhancements
-  Localization examples and updates
-  Row reordering, drag-and-drop for CodeSnippet
-  Configuration props for data views
-  Copy button tooltip and display enhancements

## `cx@24.1.3`

**Features**

-  Support tooltips and additional configuration on field icons

## `cx@24.1.0`

**Features**

-  Allow using the `fmt` function inside expressions and string templates. For example, this template works: `{[fmt({amount}, ``currency;${{currency}};0;2``)]}`
-  Add number formatting flags, i.e. n;0;2;+ca; `+` to show sign for positive number, `c` for compact number formatting, `a` for accounting mode (brackets for negative numbers)
-  Add `Culture.setNumberCulture` and `Culture.setDateTimeCulture` methods which enable using different cultures for numbers and date formatting.

## `cx@23.4.1`

**Features**

-  Allow Validator to render children, i.e. ValidationError (undocumented)

## `cx@23.4.0`

**Fixes**

-  Expose SimpleSelection (undocumented)

## `cx@23.3.1`

**Fixes**

-  Allow up to eight typed parameters in triggers and computables
-  Allow entering negative decimal numbers in NumberFields with reactOn="change"

## `cx@23.3.0`

**Fixes**

-  Fix `quoteStr` handling of special characters (used for multiline string templates)

## `cx@23.2.1`

**Features**

-  Allow Grid to render children, i.e. loading mask

**Fixes**

-  Make AccessorChain<T> assignable to AccessorChain<any>

## `cx@23.2.0`

**Features**

-  Dart Sass compatibility (see [Breaking Changes](https://docs.cxjs.io/intro/breaking-changes))
-  Dropping IE support

## `cx@22.11.3`

**Fixes**

-  Typing for `Dropdown.relatedElement`
-  Typing for `List.keyField`

## `cx@22.11.2`

**Features**

-  Add the `constrain` property to limit NumberField inputs

**Fixes**

-  Typing for Url.setBaseFromScript
-  Typing for the `bind` function
-  Typing for the LineGraph
-  Propagate colSpan to grid column footers

## `cx@22.11.1`

**Features**

-  Add the `dayData` property for calendar day styling

**Fixes**

-  Add typing for LookupField bindings
-  Improve typing for openContextMenu

## `cx@22.10.3`

**Features**

-  Add LookupField onCreateVisibleOptionsFilter callback docs and example

## `cx@22.10.2`

**Fixes**

-  Properly sort by the second column if the values in first column are null

## `cx@22.10.1`

**Fixes**

-  Recalculate the widget on store change to correctly propagate the new store to widget's children

** Features**

-  Add the onTrackMappedRecords callback for easier manipulation of sorted and filtered grid data
-  Document onGetGrouping

## `cx@22.10.0`

**Fixes**

-  Prevent late autofocus for touch devices

## `cx@22.9.0`

**Fixes**

-  Add text ellipsis to all form fields
-  Fix problems with datetime field dropdowns

## `cx@22.8.2`

**Fixes**

-  Various typing improvements

## `cx@22.8.0`

**Fixes**

-  Allow onContextMenu on all HTML elements in TypeScript
-  Properly handle context menus within windows and dropdowns
-  Allow get/set props in TypeScript
-  Allow accessor chains for the Sandbox.storage prop
-  Orient vertical Sliders to be bottom up, instead of top to bottom with the invert flag to control the behavior

## `cx@22.7.1`

**Fixes**

-  Render overlay backdrop before the body and allow propagation of `mousedown` event to to allow integration of other libraries (i.e. prosemirror) which catch events on the document level.

## `cx@22.7.0`

**New Features**

-  TreeAdapter now supports preserving expanded state through a flag `restoreExpandedNodesOnLoad`
-  Added an example for stateful tree grids

## `cx@22.6.3`

**New Features**

-  TreeAdapter now support the flag `hideRootNodes`
-  Added the function `findTreePath` to `cx/data`.

**Fixes**

-  Typings for MenuItem
-  Typings for PieSlice
-  Skip focusing disabled LookupField options
-  Typings for Window

## `cx@22.6.0`

**Fixes**

-  Fix for onCellEdited firing twice (#982)
-  Fix for grid cell editing not working in the first column (#980)
-  Allow accessor chains for `value` and `text` props in lookup fields

## `cx@22.5.3`

-  Allow tooltips in grid headers (#977)

## `cx@22.5.2`

-  Fix MenuItem typing

## `cx@22.5.1`

**Fixes**

-  Fix typings for the `Repeater` widget

## `cx@22.5.0`

**Fixes**

-  Fix bugs related to `startWithMonday` in `Calendar` widgets
-  Typing improvements
-  Fix detection of touch events inside modal windows
