import { HtmlElement, Button, enableMsgBoxAlerts } from 'cx/widgets';
import { Rescope } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';

export const BreakingChanges = <cx>
    <Rescope bind="$page">
        <Md>
            # Breaking Changes

            From time to time we're forced to introduce breaking changes to the framework.
            This page will serve to document such events and provide information how to migrate your apps.

            ## 17.12.0

            ### `babel-preset-env`

            Since this version `babel-preset-env` is a peerDependency of `babel-preset-cx-env`. That means that it needs
            to be installed. This allows that `babel-preset-cx-env` is not tied to new releases of `babel-preset-env`.

            <CodeSplit>
                <CodeSnippet>
                npm install babel-preset-env --saveDev
                yarn add babel-preset-env --dev
                </CodeSnippet>
            </CodeSplit>

            ### `-bind`, `-tpl`, `-expr` syntax

            Data-binding attributes can now be written in an alternative syntax with a dash,
            e.g. `value-bind` instead of `value:bind`. This solves
            a long standing problem that VSCode reports syntax errors if XML namespaces are used inside JSX.
            This is not really a breaking change. Both methods are supported.

            ## 17.7.0

            This release is about supporting minimal, progressive Cx applications that start really quickly,
            like [CxJS Hacker News](https://github.com/codaxy/cxjs-hackernews).
            Bigger applications may also benefit from these changes by adopting [the app shell architecture](https://developers.google.com/web/fundamentals/architecture/app-shell)
            which allows quick startup through incremental app loading.

            To support minimal application shells some internal CxJS dependencies had to be broken.

            ### Confirmation Dialogs

            To support user confirmation, `Button` required `MsgBox` and `Window` components. This (`confirm`) functionality
            is not always needed. When required, it's better to load these additional classes after the application starts.

            <CodeSplit>

                To enable CxJS based confirmation dialogs, call the `enableMsgBoxAlerts` method.
                Otherwise, browser's default `prompt` dialog will appear.

                <div class="widgets">
                    <Button
                        mod="danger"
                        text={{ bind: "$page.showDialogText", defaultValue: "Click Me" }}
                        confirm="Would you like to use CxJS based dialogs?"
                        onClick={(e, {store})=>{
                            enableMsgBoxAlerts();
                            store.set('$page.showDialogText', "Click Me Again");
                        }}
                    />
                </div>

                <CodeSnippet putInto="code">{`
                    <Button
                        mod="danger"
                        text={{ bind: "$page.showDialogText", defaultValue: "Click Me" }}
                        confirm="Would you like to use CxJS based dialogs?"
                        onClick={(e, {store})=>{
                            enableMsgBoxAlerts();
                            store.set('$page.showDialogText', "Click Me Again");
                        }}
                    />
                `}</CodeSnippet>

                To enable confirmations on application startup, use the following snippet:

                <CodeSplit>
                    <CodeSnippet>{`
                    import {enableMsgBoxAlerts} from 'cx/widgets';

                    enableMsgBoxAlerts();
                `}</CodeSnippet>
                </CodeSplit>
            </CodeSplit>

            ### Tooltips

            Tooltips are not implicitly loaded anymore. For example,

            <CodeSplit>
                <CodeSnippet>
                    {`<div tooltip="Some tooltip" />`}
                </CodeSnippet>

                will not just work. Now, it's required to enable tooltips using the `enableTooltips` method.

                <CodeSnippet>{`
                import {enableTooltips} from 'cx/widgets';

                enableTooltips();
                `}</CodeSnippet>
            </CodeSplit>

            ### Culture-Sensitive Number, Date and Currency Formatting

            Culture-sensitive number and date formats are not automatically registered anymore for the same reasons.
            Formatting is auto-enabled if `NumberField`, `DateField` or any other culture dependent widget is used,
            otherwise it needs to be enabled using the `enableCultureSensitiveFormatting`.

            <CodeSplit>
                <CodeSnippet>{`
                import {enableCultureSensitiveFormatting} from 'cx/ui';

                enableCultureSensitiveFormatting();
                `}</CodeSnippet>
            </CodeSplit>

            ### Fat Arrow Expansion

            To support fat arrows in expressions, CxJS includes a transformer which transforms fat arrows into
            standard function notation. This is needed to support fat arrows in Internet Explorer and older
            versions of Safari.

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

            For apps that do not use code-splitting and want to enable all internal dependencies,
            you may use `enableAllInternalDependencies` and everything will be as it was in previous versions.

            <CodeSplit>
                <CodeSnippet>{`
                import {enableAllInternalDependencies} from 'cx/widgets';

                enableAllInternalDependencies();
                `}</CodeSnippet>
            </CodeSplit>

            ## 17.4.0

            We're happy to announce that we obtained ownership of the `cx` package at [npmjs](https://www.npmjs.com/package/cx)
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
            include: /(app|cx)/,  //previously (app|cx-core)
            ```

            If `cx-core` reference is used `.scss` files, replace it with `cx`.

            ```
            @import "~cx/src/variables";    //cx-core => cx
            @import "~cx/src/index";        //cx-core => cx
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

            The `cx-core` package will continue to work for some time, however, it's advisable for all users to switch to the new
            package. The benefit of this change is that code completion will now work as IDEs will be able to find the
            `cx` package.
        </Md>
    </Rescope>
</cx>
