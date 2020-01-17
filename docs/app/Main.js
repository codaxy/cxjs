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
                    {text: 'Introduction', url: '~/intro/welcome'},
                    {text: 'Getting Started', url: '~/intro/getting-started'}
                ],
            },
            {
                text: 'Pre-requsites',
                children: [
                    {text: 'JSX', url: '~/intro/jsx'},
                    {text: 'CLI', url: '~/intro/command-line'},
                    {text: 'NPM Packages', url: '~/intro/npm-packages'},
                    {text: 'Breaking Changes', url: '~/intro/breaking-changes'},
                    {text: 'Step by Step Tutorial', url: '~/intro/step-by-step'},
                    {text: 'Feature List', url: '~/intro/feature-list'},
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
