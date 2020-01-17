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
        url: '~/docs/get-started',
        text: 'Overview',
        children: [
            {
                text: 'Intro',
                children: [
                    {
                        text: 'Introduction',
                        url: '~/docs/get-started/introduction',
                    },
                    {
                        text: 'Welcome',
                        url: '~/docs/get-started/welcome',
                    },
                    {
                        text: 'Getting Started',
                        url: '~/docs/get-started/getting-started',
                    },
                ],
            },
            {
                text: 'Pre-requsites',
                children: [
                    {
                        text: 'JSX',
                        url: '~/docs/get-started/jsx',
                    },
                    {
                        text: 'Breaking Changes',
                        url: '~/docs/get-started/breaking-changes',
                    },
                    {
                        text: 'Step by Step Tutorial',
                        url: '~/docs/get-started/step-by-step',
                    },
                    {
                        text: 'Feature List',
                        url: '~/docs/get-started/features',
                    },
                ],
            },
        ],
    },
    {
        url: '~/docs/concepts',
        text: 'Concepts',
        children: [
            {
                text: 'G1',
                children: [
                    {
                        text: 'Concept #1',
                        url: '~/docs/concepts/concept1',
                    },
                ],
            },
        ],
    },
];

export const Main = <cx>
    <PureContainer outerLayout={MasterLayout}>
        {/* <DocumentTitle text="Cx Docs"/>
        <Content name="aside" items={Contents}/>
    <Floater if-expr="{layout.touch}"/> */}
        <div class="sticky topbanner">
            <h3>Documentation</h3>

            <div class="topbanner_tabs">
                <Link href="~/docs/get-started" url-bind="url">
                    Overview
                </Link>
                <Link href="~/docs/concepts" url-bind="url">
                    Concepts
                </Link>
                <Link href="~/docs/widgets" url-bind="url">
                    Widgets
                </Link>
                <Link href="~/docs/charts" url-bind="url">
                    Charts
                </Link>
                <Link href="~/docs/examples" url-bind="url">
                    Examples
                </Link>
            </div>
        </div>
        <div class="docsmain" style="display: flex">
            <div class="gray sticky sidenav" style="top: 80px">
                <NavTree tree={docsNav} url-bind="url" />
            </div>
            <div class="docscontent" style="flex-grow: 1; height: 5000px; padding: 20px">
                <h1>Documentation</h1>
                <ContentRouter />
            </div>
        </div>
    </PureContainer>
</cx>;
