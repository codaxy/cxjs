import { Section } from "cx/widgets";

export default (
    <cx>
        <h2 putInto="header">Home</h2>

        <Section mod="card">
            <img src="~/assets/img/welcome.png" style="height: 100px" />
            <p>Your app is now running. Let's get started.</p>
            <h6>1. Routing</h6>
            <p ws>
                Navigate through the pages to see if all pages load correctly.
                Bear in mind that routing is done completely client-side. No
                server calls are made to load pages. This is ok for smaller
                apps. If your app gets big and slow, you should consider{" "}
                <a
                    href="https://webpack.js.org/guides/code-splitting/"
                    target="_blank"
                >
                    Code Splitting
                </a>.
            </p>

            <h6>2. Hot Module Replacement (HMR)</h6>
            <p ws>
                This app is using webpack development server which offers hot
                module replacement. After you can change the source code the
                browser will automatically update the page on each save without
                refreshing. There is an error on this page, let's fix it. Next
                section should be called SCSS instead of CSS. Open{" "}
                <code>app/routes/default/index.js</code>
                and change the text.
            </p>

            <h6>3. CSS</h6>
            <p ws>
                CSS for this application is generated using Sass(SCSS)
                configured as a webpack plugin. Sass provides variables, mixins
                and other helpful features for authoring CSS. Let's try it. Go
                to <code>app/layout/index.scss</code> and change the{" "}
                <code>$header-color</code>.
                <code>#3b4888</code> looks nice. You should also consider using
                one of
                <a href="https://gallery.cxjs.io" target="_blank">
                    available CxJS themes
                </a>.
            </p>

            <h6>Next Steps</h6>
            <p ws>
                If you haven't done so already, you should now star CxJS on
                <a href="https://github.com/codaxy/cxjs" target="_blank">
                    GitHub
                </a>. While there, you can glance at the source code of CxJS and
                our demo applications. There are plenty of{" "}
                <a href="https://cxjs.io/examples" target="_blank">
                    examples on our website
                </a>
                and you should definitely get familiar{" "}
                <a href="https://cxjs.io/docs" target="_blank">
                    CxJS documentation
                </a>. If you have any problems you may{" "}
                <a href="https://cxjs.io">contact us for support</a>, ask a
                question on{" "}
                <a
                    href="http://stackoverflow.com/questions/tagged/cxjs"
                    target="_blank"
                >
                    StackOverflow
                </a>
                or report{" "}
                <a href="https://github.com/codaxy/cxjs/issues">
                    a bug at GitHub
                </a>.
            </p>
        </Section>
    </cx>
);
