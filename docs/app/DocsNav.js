import { Controller } from 'cx/ui';
import { SideNav } from '../components/SideNav';
import { updateArray } from 'cx/data';

export const docsNavTree = [
    {
        url: '~/intro',
        text: 'Overview',
        children: [
            {
                text: 'Intro',
                children: [
                    { text: 'Introduction', url: '~/intro/welcome' },
                    { text: 'Getting Started', url: '~/intro/getting-started'}
                ],
            },
            {
                text: 'Pre-requsites',
                children: [
                    { text: 'JSX', url: '~/intro/jsx' },
                    { text: 'CLI', url: '~/intro/command-line' },
                    { text: 'NPM Packages', url: '~/intro/npm-packages' },
                    { text: 'Breaking Changes', url: '~/intro/breaking-changes' },
                    { text: 'Step by Step Tutorial', url: '~/intro/step-by-step' },
                    { text: 'Feature List', url: '~/intro/feature-list' }
                ],
            },
        ],
    },
    {
        url: '~/concepts',
        text: 'Concepts',
        children: [
            {
                text: 'G1',
                children: [
                    { text: 'Store', url: '~/concepts/store' },
                    { text: 'Widgets', url: '~/concepts/widgets' },
                    { text: 'Data Binding', url: '~/concepts/data-binding' },
                    { text: 'Data Views', url: '~/concepts/data-views' },
                    { text: 'Private Store', url: '~/concepts/private-stores' },
                    { text: 'Controllers', url: '~/concepts/controllers' },
                    { text: 'Inner Layouts', url: '~/concepts/inner-layouts' }
                ],
            },
            {
                text: 'G2',
                children: [
                    { text: 'Functional Components', url: '~/concepts/functional-components' },
                    { text: 'Outer Layouts', url: '~/concepts/outer-layouts' },
                    { text: 'Router', url: '~/concepts/router' },
                    { text: 'Selection', url: '~/concepts/selections' },
                    { text: 'CSS', url: '~/concepts/css' },
                    { text: 'Formatting', url: '~/concepts/formatting' },
                    { text: 'Localization', url: '~/concepts/localization' },
                    { text: 'Charts', url: '~/concepts/charts' },
                    { text: 'Drag & Drop', url: '~/concepts/drag-and-drop' }
                ]
            }
        ]
    },
    {
        url: '~/widgets',
        text: 'Widgets',
        children: [
            {
                text: 'Collections',
                children: [
                    { text: 'Grid', url: '~/widgets/grids' },
                    { text: 'Tree Grid', url: '~/widgets/tree-grid' },
                    { text: 'List', url: '~/widgets/lists' },

                ]
            },
            {
                text: 'Form',
                children: [
                    { text: 'TextField', url: '~/widgets/text-fields' },
                    { text: 'NumberField', url: '~/widgets/number-fields' },
                    { text: 'DateField', url: '~/widgets/date-fields' },
                    { text: 'LookupField', url: '~/widgets/lookup-fields' },
                    { text: 'Select', url: '~/widgets/select-fields' },
                    { text: 'TextArea', url: '~/widgets/text-areas' },
                    { text: 'DateTimeField', url: '~/widgets/date-time-fields' },
                    { text: 'Calendar', url: '~/widgets/calendars' },
                    { text: 'MonthField', url: '~/widgets/month-fields' },
                    { text: 'MonthPicker', url: '~/widgets/month-pickers' },
                    { text: 'ColorField', url: '~/widgets/color-fields' },
                    { text: 'ColorPicker', url: '~/widgets/color-pickers' },
                    { text: 'Sliders', url: '~/widgets/sliders' },
                    { text: 'Switches', url: '~/widgets/switches' },
                    { text: 'Labels', url: '~/widgets/labels' },
                    { text: 'LabeledContainer', url: '~/widgets/labeled-containers' },
                    { text: 'FieldGroup', url: '~/widgets/field-groups' },
                    { text: 'Validator', url: '~/widgets/validators' },
                    { text: 'ValidationGroup', url: '~/widgets/validation-groups' },
                ]
            }
        ]
    },
    {
        url: '~/charts',
        text: 'Charts',
        children: [
            {
                text: 'Charts',
                children: [
                    { text: 'General', url: '~/charts/charts' },
                    { text: 'PieChart', url: '~/charts/pie-charts' },
                    { text: 'LineGraph', url: '~/charts/line-graphs' },
                    { text: 'ColumnGraph', url: '~/charts/column-graphs' },
                    { text: 'BarGraph', url: '~/charts/bar-graphs' },
                    { text: 'ScatterGraph', url: '~/charts/scatter-graphs' },
                    { text: 'Column', url: '~/charts/columns' },
                    { text: 'Bar', url: '~/charts/bars' },
                    { text: 'MarkerLine', url: '~/charts/marker-lines' },
                    { text: 'Range', url: '~/charts/ranges' },
                ]
            },
            {
                text: 'Misc',
                children: [
                    { text: 'NumericAxis', url: '~/charts/numeric-axis' },
                    { text: 'CategoryAxis', url: '~/charts/category-axis' },
                    { text: 'TimeAxis', url: '~/charts/time-axis' },
                    { text: 'ColorMap', url: '~/charts/color-map' },
                    { text: 'Legend', url: '~/charts/legend' },
                    { text: 'Gridlines', url: '~/charts/gridlines' },
                    { text: 'MouseTracker', url: '~/charts/mouse-tracker' },
                    { text: 'PointReducer', url: '~/charts/point-reducers' },
                    { text: 'ValueAtFinder', url: '~/charts/value-at-finder' },
                    { text: 'SnapPointFinder', url: '~/charts/snap-point-finder' },
                    { text: 'MinMaxFinder', url: '~/charts/min-max-finder' }
                ]
            }
        ]
    }
];

// class CController extends Controller {
//     init() {
//         super.init();
//         this.store.init('docsNavTree', docsNavTree);

//         this.addTrigger('active-topic-expand', ['url'], (url) => {
//             this.store.update('docsNavTree', updateArray, t => ({
//                 ...t,
//                 expanded: true
//             }), t=>!t.expanded && t.children.some(x=>url.indexOf(x.url) == 0))
//         }, true);
//     }
// };

// export const DocsNav = <cx>
//     <div class="dxb-contents" controller={CController}>
//         <SideNav records-bind="docsNavTree"/>
//     </div>
// </cx>;
