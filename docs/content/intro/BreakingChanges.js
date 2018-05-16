import {HtmlElement, Button, enableMsgBoxAlerts} from 'cx/widgets';
import {Rescope} from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';

export const BreakingChanges = <cx>
    <Rescope bind="$page">
        <Md>
            # Breaking Changes

            Sometimes we are forced to introduce breaking changes to the framework.
            This page will provide information about breaking changes and how to migrate your applications to the latest
            versions of the framework.

            ## 17.12.0

            ### `babel-preset-env`

            `babel-preset-env` is now a peer dependency of `babel-preset-cx-env`. Therefore it needs
            to be installed in your project.
            This change enables the `babel-preset-env` package to be updated independently from the
            `babel-preset-cx-env`
            package.

            <CodeSplit>
                <CodeSnippet>
                    npm install babel-preset-env --saveDev
                    yarn add babel-preset-env --dev
                </CodeSnippet>
            </CodeSplit>

            ### `-bind`, `-tpl`, `-expr` syntax

            Data-binding attributes can now be written in an alternative syntax with a dash instead of a colon, for
            example `value-bind` instead of `value:bind`. Although not necessarily a breaking change, both methods are
            supported which solves a long standing problem of syntax errors that [Visual Studio
            Code](https://code.visualstudio.com) reports if XML namespaces are used inside JSX.

            ## 17.7.0

            This release adds support for CxJS applications with an extremely short start up time such as [CxJS Hacker
            News](https://github.com/codaxy/cxjs-hackernews).
            Bigger applications will improve startup time through incremental app loading and adopting [the app shell
            architecture](https://developers.google.com/web/fundamentals/architecture/app-shell).

            In order for us to support minimal application shells some internal CxJS dependencies had to be broken.

            ### Confirmation Dialogs

            The `Button` requires `MsgBox` and `Window` components in order to support user confirmation dialogs.
            This (`confirm`) function is not always necessary, but when needed. it's better to load these additional classes
            after the application launch.

            <CodeSplit>

                In order to enable CxJS based confirmation dialogs, use the `enableMsgBoxAlerts` method.
                Otherwise, the browser default `prompt` dialog will appear.

                <div class="widgets">
                    <Button
                        mod="danger"
                        text={{bind: "$page.showDialogText", defaultValue: "Click Here"}}
                        confirm="Would you like to use CxJS based dialogs?"
                        onClick={(e, {store}) => {
                            enableMsgBoxAlerts();
                            store.set('$page.showDialogText', "Click Here Again");
                        }}
                    />
                </div>

                <CodeSnippet putInto="code">{`
                    <Button
                        mod="danger"
                        text={{ bind: "$page.showDialogText", defaultValue: "Click Here" }}
                        confirm="Would you like to use CxJS based dialogs?"
                        onClick={(e, {store})=>{
                            enableMsgBoxAlerts();
                            store.set('$page.showDialogText', "Click Here Again");
                        }}
                    />
                `}</CodeSnippet>

                To enable the confirmation function on application startup, use the following snippet:

                <CodeSplit>
                    <CodeSnippet>{`
                    import {enableMsgBoxAlerts} from 'cx/widgets';

                    enableMsgBoxAlerts();
                `}</CodeSnippet>
                </CodeSplit>
            </CodeSplit>

            ### Tooltips

            Tooltips are not automatically loaded anymore. The following example will not work because
            tooltips first need to be enabled using the `enableTooltips` method.

            <CodeSplit>
                <CodeSnippet>
                    {`<div tooltip="Some tooltip" />`}
                </CodeSnippet>

                Use the following code to enable tooltips:

                <CodeSnippet>{`
                import {enableTooltips} from 'cx/widgets';

                enableTooltips();
                `}</CodeSnippet>
            </CodeSplit>

            ### Culture-Sensitive Number, Date and Currency Formatting

            Culture-sensitive formats for dates and numbers are not automatically registered.
            Formatting is auto-enabled if `NumberField`, `DateField` or any other culture dependent widget is used;
            otherwise it needs to be enabled using the `enableCultureSensitiveFormatting` method.

            <CodeSplit>
                <CodeSnippet>{`
                import {enableCultureSensitiveFormatting} from 'cx/ui';

                enableCultureSensitiveFormatting();
                `}</CodeSnippet>
            </CodeSplit>

            ### Fat Arrow Expansion

            In order to support fat arrows in expressions CxJS includes a transformer which rewrites fat arrows into
            the standard function notation. This allows fat arrows to be used in Internet Explorer and older
            versions of Safari, like in the following example.

            <CodeSplit>
                <CodeSnippet>
                    {`<div text:expr="{data}.filter(a=>a.value > 10).join(', ')" />`}
                </CodeSnippet>

                Code from the snippet above will not work in IE anymore because fat arrow expansion is now optional and
                needs to be enabled using the `enableFatArrowExpansion` method.

                <CodeSnippet>{`
                import {enableFatArrowExpansion} from 'cx/data';

                enableFatArrowExpansion();
                `}</CodeSnippet>
            </CodeSplit>


            ### Enable All

            For apps that do not use code-splitting and the developers want to enable all internal dependencies,
            you may use `enableAllInternalDependencies` and everything will be as it was in previous versions.

            <CodeSplit>
                <CodeSnippet>{`
                import {enableAllInternalDependencies} from 'cx/widgets';

                enableAllInternalDependencies();
                `}</CodeSnippet>
            </CodeSplit>

            ## 17.4.0

            We're proud to announce that we obtained ownership of the `cx` package at
            [npmjs](https://www.npmjs.com/package/cx)
            and therefore our `cx-core` package will be replaced with `cx` and deprecated.

            To migrate your apps, please do the following:

            In `package.json` replace `cx-core` with `cx`.
            ```
            yarn remove cx-core
            yarn add cx
            ```

            Additionally, if `babel-plugin-transform-cx-imports` is used with `useSrc` option,
            in `webpack.config.js` `cx` package should be whitelisted
            instead of `cx-core` in the `babel-loader` configuration.

            ```
            test: /\.js$/,
            loader: 'babel-loader',
            include: /(app|cx)/, //previously (app|cx-core)
            ```

            If `cx-core` reference is used in `.scss` files, replace it with `cx`.

            ```
            @import "~cx/src/variables"; //cx-core => cx
            @import "~cx/src/index"; //cx-core => cx
            ```

            After you're done, please upgrade all Cx related packages to the latest version.
            ```
            yarn upgrade-interactive
            ```
            Also, upgrade `cx-cli` tools globally.
            ```
            yarn global add cx-cli
            ```

            That's it.

            The `cx-core` package will continue to work, but we recommend that all users to switch
            to the new package. The benefit of this change is that the code completion will now work as IDEs will now be
            able to find the `cx` package.
        </Md>
    </Rescope>
</cx>
