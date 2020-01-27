import {DocumentTitle, PureContainer, Content, Link} from 'cx/widgets';
import {HtmlElement} from 'cx/widgets';
import {Layout} from './Layout';
import {Contents} from '../content/Contents';
import {ContentRouter} from '../content/ContentRouter';
import {Floater} from '../components/Floater';
import { MasterLayout } from '../../misc/layout';
import { NavTree } from '../../misc/components/NavTree';

const docsNav = [
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
                text: 'Grid',
                children: [
                    { text: 'Simple grid', url: '~/widgets/grid-simple' },
                    { text: 'Pagination', url: '~/widgets/grid-pagination' },
                    { text: 'Buffering', url: '~/widgets/grid-buffering' },
                    { text: 'Multiple selection', url: '~/widgets/grid-multiple-selection' },
                    { text: 'Grouping', url: '~/widgets/grid-grouping' },
                    { text: 'Dynamic grouping', url: '~/widgets/grid-dynamic-grouping' },
                    { text: 'Form editing', url: '~/widgets/grid-form-editing' },
                    { text: 'Row editing', url: '~/widgets/grid-row-editing' },
                    { text: 'Cell editing', url: '~/widgets/grid-cell-editing' },
                    { text: 'Inline editing', url: '~/widgets/grid-inline-editing' },
                    { text: 'Tree grid', url: '~/widgets/tree-grid' },
                    { text: 'Header menu', url: '~/widgets/grid-header-menu' },
                    { text: 'Complex headers', url: '~/widgets/grid-complex-headers' },
                    { text: 'Infinite scrolling', url: '~/widgets/grid-infinite-scrolling' },
                    { text: 'Row expanding', url: '~/widgets/grid-row-expanding' },
                    { text: 'Column resizing', url: '~/widgets/grid-column-resizing' },
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
    }
];

export const Main = <cx>
    <PureContainer outerLayout={MasterLayout}>
        {/* <DocumentTitle text="Cx Docs"/>
        <Content name="aside" items={Contents}/>
    <Floater if-expr="{layout.touch}"/> */}
        <div class="sticky topbanner">
            <h3>Documentation</h3>

            <div class="topbanner_tabs">
                <Link href="~/intro" url-bind="url">
                    Overview
                </Link>
                <Link href="~/concepts" url-bind="url">
                    Concepts
                </Link>
                <Link href="~/widgets" url-bind="url">
                    Widgets
                </Link>
                <Link href="~/charts" url-bind="url">
                    Charts
                </Link>
                <Link href="~/examples" url-bind="url">
                    Examples
                </Link>
            </div>
        </div>
        <div class="docsmain" style="display: flex">
            <div class="gray sticky sidenav" style="top: 80px">
                <NavTree tree={docsNav} url-bind="url" />
            </div>
            <div class="docscontent" style="flex-grow: 1; height: 5000px; padding: 20px">
                {/* <h1>Documentation</h1> */}
                <ContentRouter />
            </div>
        </div>
    </PureContainer>
</cx>;
