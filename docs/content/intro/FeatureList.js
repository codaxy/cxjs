import { HtmlElement } from 'cx/widgets';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';



export const FeatureList = <cx>
    <Md>
        # List of Features

        All of the CxJS features are listed below:

        ## Core

        ### Data-Binding

        * Two-way data binding
        * Expressions
        * String templates
        * Computables
        * Value setters

        ### Controllers

        * computed values
        * triggers
        * callback methods

        ### Formatting

        * date
        * number
        * url
        * prefix/suffix
        * custom formats

        ### Localization

        * date
        * number
        * message


        ## Widgets

        ### Forms

        - TextField
        - TextArea
        - NumberField
        - DateField
        - ColorField
        - LookupField
            - multivalue
            - remote data
            - search
        - MonthField
        - Select
        - Checkbox
        - Radio
        - Calendar
        - MonthPicker
        - ColorPicker
        - Slider
        - Label
        - ValidationGroup
        - LabeledContainer


        ### Lists

        - Repeater
        - List
            - keyboard navigation
            - selection
        - Grid
            - keyboard navigation
            - selection
            - fixed headers
            - grouping
            - aggregates
            - multiple headers
            - merged header cells
            - complex header content
            - tree grid
            - inline editing
            - pagination

        ### Navigation and Routing

        - Menu
        - Submenu (Dropdown)
        - Tabs
        - Link (History)
        - Route
        - History
        - Url

        ### General Purpose Widgets

        - Button
        - UploadButton
        - HtmlElement
        - PureContainer

        ### Overlays

        - Overlay
        - Tooltip
        - Window
        - MsgBox


        ## Layout

        * Inner Layouts
            - LabelsLeftLayout
            - LabelsTopLayout
            - FirstVisibleChildLayout
            - UseParentLayout

        * Outer Layouts
            - ContentPlaceholder
            - Content


        ## Charts

        ### SVG Elements

        * Svg
        * Text
        * Rectangle
        * Ellipse
        * Line
        * ClipRect

        ### 2d Graphs

        * LineGraph
            - area
            - stacked
        * ColumnGraph
            - stacked
        * BarGraph
            - stacked
        * ScatterGraph
        * Column
            - stacked
        * Bar
            - stacked

        ### Axes

        * NumericAxis
        * CategoryAxis
        * TimeAxis
        * responsive
        * dynamic tick divisions
        * dynamic range selection

        ### Pie Charts

        * PieChart
        * PieSlice

        ### Helpers

        * Marker
            - draggable
        * Range
        * Legend
        * ColorMap
        * Gridlines

        ### CSS

        * Modified BEM convention
        * CSS prefix
        * SASS
        * Widget mods

    </Md>
</cx>

