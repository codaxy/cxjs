import { Link } from "cx/widgets";
import { ContentPlaceholder } from "cx/ui";
import Controller from "./Controller";

export default (
    <cx>
        <div
            controller={Controller}
            class={{
                layout: true,
                nav: { bind: "layout.aside.open" }
            }}
        >
            <main class="main" onMouseDownCapture="onMainClick">
                <ContentPlaceholder />
            </main>
            <header class="header">
                <i
                    class={{
                        hamburger: true,
                        open: { bind: "layout.aside.open" }
                    }}
                    onClick={(e, { store }) => {
                        store.toggle("layout.aside.open");
                    }}
                />
                <ContentPlaceholder name="header" />
            </header>
            <aside class="aside">
                <h1>Cx App</h1>
                <dl>
                    <dt>App</dt>
                    <dd>
                        <Link href="~/" url-bind="url">
                            Home
                        </Link>
                    </dd>
                    <dd>
                        <Link href="~/dashboard" url-bind="url">
                            Dashboard
                        </Link>
                    </dd>
                    <dd>
                        <Link href="~/about" url-bind="url">
                            About
                        </Link>
                    </dd>
                </dl>
                <dl>
                    <dt>Admin</dt>
                    <dd>
                        <Link href="~/users" url-bind="url" match="prefix">
                            Users
                        </Link>
                    </dd>
                </dl>
            </aside>
        </div>
    </cx>
);
