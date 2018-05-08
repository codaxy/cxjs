import { Link, Section } from "cx/widgets";

export default (
    <cx>
        <h2 putInto="header">About</h2>
        <Section mod="well" title="Cx App">
            <p ws>
                This is an application generated using Cx CLI. It's just a
                skeleton that provides a basic layout and a couple of demo
                pages.
            </p>

            <h6>Layout</h6>
            <p ws>
                This is a simple responsive layout with a side navigation that
                is initially closed on screens less than a 1000px wide.
            </p>

            <h6>Dashboard Page</h6>
            <p ws>
                A really simple dashboard with hardcoded data. It's there just
                to remind you that CxJS offers a nice charting package that can
                be used to build dashboards.
            </p>

            <h6>Users Page</h6>
            <p ws>
                A sample admin page demonstrating CRUD operations and search
                functionality.
            </p>
            <Link href="~/">Back</Link>
        </Section>
    </cx>
);
