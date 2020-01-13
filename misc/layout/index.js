import { ContentPlaceholder, Link } from 'cx/widgets';
import { Animicon } from '../components/Animicon';
import { SideDrawer } from '../components/SideDrawer';

export const MasterLayout = <cx>
    <div class="app">
        <header ws class="master_header">
            <div class="master_topbar">
                <div class="master_hamburger">
                    <Animicon
                        shape={{ bind: 'master.drawer.icon', defaultValue: null }}
                        onClick={(e, { store }) => {
                            store.update('master.drawer.icon', shape => {
                                switch (shape) {
                                    case 'arrow':
                                        return 'close';

                                    case 'close':
                                        return null;

                                    default:
                                        return 'arrow';
                                }
                            });
                        }}
                    />
                </div>
                <img class="master_logo" src="~/assets/img/cxjs.svg" />
                <Link href="~/" url-bind="url">
                    Home
                </Link>
                <Link href="~/docs" url-bind="url" match="subroute">
                    Docs
                </Link>
                <Link href="~/gallery" url-bind="url" match="subroute">
                    Gallery
                </Link>
                <Link href="~/fiddle" url-bind="url" match="subroute">
                    Fiddle
                </Link>
                <a style="margin-left: auto"> GH</a> | <a>CS</a>
            </div>
        </header>
        <ContentPlaceholder />
        <footer></footer>
        <SideDrawer out-bind="master.drawer.icon">
            <div class="sidenav">
                {/* <NavTree tree={docsTree} url-bind="url" showCategory /> */}
                <div visible-expr="{master.drawer.icon} == 'close'">
                    <div class="sidenav_section">
                        <Link href="~/">Home</Link>
                    </div>
                    <div class="sidenav_section">
                        <Link href="~/docs">Docs</Link>

                        <Link href="~/docs/overview" url-bind="url" match="subroute" mod="subsystem">
                            Overview
                        </Link>
                        <Link href="~/docs/concepts" url-bind="url" match="subroute" mod="subsystem">
                            Concepts
                        </Link>
                        <Link href="~/docs/widgets" url-bind="url" match="subroute" mod="subsystem">
                            Widgets
                        </Link>
                        <Link href="~/docs/charts" url-bind="url" match="subroute" mod="subsystem">
                            Charts
                        </Link>
                        <Link href="~/docs/examples" url-bind="url" match="subroute" mod="subsystem">
                            Examples
                        </Link>
                    </div>
                    <div class="sidenav_section">
                        <Link href="~/gallery" match="subroute">
                            Gallery
                        </Link>
                    </div>
                    <div class="sidenav_section">
                        <Link href="~/fiddle" match="subroute">
                            Fiddle
                        </Link>
                    </div>
                </div>
            </div>
        </SideDrawer>
    </div>
</cx>