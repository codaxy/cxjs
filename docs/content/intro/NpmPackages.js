import {HtmlElement, Link} from 'cx/widgets';
import {Md} from '../../components/Md';

export const NpmPackages = <cx>
    <Md>
        # NPM Packages

        CxJS includes a number of NPM packages used for different purposes.
        This article provides a brief overview of all packages and links
        to npm homepages where you can find more information about each package.

        ### General
        <table class="dxb-table">
            <tbody>
            <tr>
                <th><a href="https://www.npmjs.com/package/cx">cx</a></th>
                <td ws>
                    This is the main package of the CxJS framework containing widgets, charts, data-binding and other UI
                    related elements.
                </td>
            </tr>

            <tr>
                <th><a href="https://www.npmjs.com/package/cx-cli">cx-cli</a></th>
                <td ws>
                    <Link href="~/intro/command-line">Command Line Interface</Link> used to speed up development of CxJS applications.
                </td>
            </tr>

            </tbody>
        </table>

        ### Integration

        <table class="dxb-table">
            <tbody>
            <tr>
                <th>
                    <a href="https://www.npmjs.com/package/cx-redux">cx-redux</a>
                </th>
                <td ws>
                    Enables use of <a href="http://redux.js.org/">Redux</a> for application state management.
                    See <a href="https://github.com/codaxy/cxjs/tree/master/packages/cx-redux">Source Code</a>
                    and <a href="https://github.com/codaxy/cx-redux-examples">Demo Project</a>.
                </td>
            </tr>

            <tr>
                <th>
                    <a href="https://www.npmjs.com/package/cx-google-maps">cx-google-maps</a>
                </th>
                <td ws>
                    CxJS wrapper for <a href="https://github.com/tomchentw/react-google-maps">react-google-maps</a>.
                    See the <a href="https://codaxy.github.io/cx-google-maps/">Demo app</a>
                    and <a href="https://github.com/codaxy/cx-google-maps">Source Code</a>.
                </td>
            </tr>

            </tbody>
        </table>

        ### Virtual DOM

        Virtual DOM packages are used to connect Cx with a library used for DOM manipulation.

        <table class="dxb-table">
            <tbody>
            <tr>
                <th><a href="https://www.npmjs.com/package/cx-react">cx-react</a></th>
                <td ws>Use <a href="https://facebook.github.io/react/">React</a> for rendering.</td>
            </tr>
            <tr>
                <th><a href="https://www.npmjs.com/package/cx-inferno">cx-inferno</a></th>
                <td ws>Use <a href="https://infernojs.org/">Inferno</a> for rendering.</td>
            </tr>
            <tr>
                <th><a href="https://www.npmjs.com/package/cx-preact">cx-preact</a></th>
                <td ws>Use <a href="https://preactjs.com/">Preact</a> for rendering.</td>
            </tr>

            </tbody>
        </table>

        ### Themes

        Theme packages enable simple CxJS theming.

        <table class="dxb-table">
            <tbody>
            <tr>
                <th><a href="https://www.npmjs.com/package/cx-theme-frost">cx-theme-frost</a></th>
                <td>Frost theme.</td>
            </tr>
            <tr>
                <th><a href="https://www.npmjs.com/package/cx-theme-dark">cx-theme-dark</a></th>
                <td>Dark theme.</td>
            </tr>
            <tr>
                <th><a href="https://www.npmjs.com/package/cx-theme-material">cx-theme-material</a></th>
                <td>Material theme.</td>
            </tr>
            <tr>
                <th><a href="https://www.npmjs.com/package/cx-theme-marine">cx-theme-marine</a></th>
                <td>Material theme.</td>
            </tr>
            </tbody>
        </table>

        ## Babel

        There are a couple of packages for configuring Babel.

        <table class="dxb-table">
            <tbody>
            <tr>
                <th><a
                    href="https://www.npmjs.com/package/babel-plugin-transform-cx-jsx">babel-plugin-transform-cx-jsx</a>
                </th>
                <td ws>Converts <Link href="~/intro/jsx">JSX</Link> into JS.</td>
            </tr>
            <tr>
                <th><a href="https://www.npmjs.com/package/babel-plugin-transform-cx-imports">babel-plugin-transform-cx-imports</a>
                </th>
                <td ws>
                    Rewrites imports to access widgets from the `src` folder which results with smaller bundles in
                    scenarios when
                    tree-shaking doesn't work well.
                </td>
            </tr>
            <tr>
                <th><a href="https://www.npmjs.com/package/babel-preset-cx-env">babel-preset-cx-env</a></th>
                <td ws>
                    Adds <code>babel-preset-env</code> and other Babel and
                    Cx plugins required for CxJS applications.
                </td>
            </tr>

            </tbody>
        </table>

        ## Misc

        <table class="dxb-table">
            <tbody>

            <tr>
                <th>
                    <a href="https://www.npmjs.com/package/cx-scss-manifest-webpack-plugin">cx-scss-manifest-webpack-plugin</a>
                </th>
                <td ws>
                    Inspects application source code and generates a SCSS manifest file for importing
                    only the required elements from CxJS SCSS library.
                </td>
            </tr>
            </tbody>
        </table>
    </Md>
</cx>

