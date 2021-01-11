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

            ## 21.1.0

            ### Change in invokeParentMethod

            Previously [`invokeParentMethod`](~/concepts/controllers#-code-invokeparentmethod-code-) could be used to invoke Controller's own method. If the specified method was not found on current
            Controller instance, parent instances would be checked until the one with the specified method is found.

            With this change, `invokeParentMethod` now **skips** the current Controller instance and tries to invoke the specified method
            in one of the parent instances, as the name suggests.
            This can cause the code to break if, for example, `invokeParentMethod` was used in one of the inline event handlers:
            <CodeSplit>
                <CodeSnippet>
                {`
                    <div controller={{
                        onSubmit(val) {
                            console.log('val', val)
                        }
                    }}>
                        <Button
                            onClick={(e, instance) => {
                                let controller = instance.controller;
                                // This will cause an error:
                                // Uncaught Error: Cannot invoke controller method "onSubmit" as controller is not assigned to the widget.
                                controller.invokeParentMethod('onSubmit', 1);
                            }}
                            text="Submit"
                        />
                    </div>
                `}
                </CodeSnippet>
            </CodeSplit>

            To fix this, make the following change in the `onClick` handler:
            <CodeSplit>
                <CodeSnippet>
                {`
                    onClick={(e, instance) => {
                        let controller = instance.controller;
                        // use invokeMethod instead of invokeParentMethod
                        controller.invokeMethod('onSubmit', 1);
                    }}
                `}
                </CodeSnippet>
            </CodeSplit>

            [`invokeMethod`](~/concepts/controllers#-code-invokemethod-code-) has the same behaviour as the previous implementation of `invokeParentMethod`, hence it can be used as a fail-safe replacement for
            `invokeParentMethod` in this version of CxJS.

            ## 20.1.0

            ### Format change for DateTimeField

            `DateTimeField` now expects regular formats, e.g. `datetime;yyyyMMMdd` (previously only `yyyyMMMdd` part was required).
            This change enables non-standard, custom formats to be used.


            ## 19.1.0

            ### Babel 7

            Starting with this version CxJS tooling requires Babel 7. New versions of the `babel-preset-cx-env`, `babel-plugin-transform-cx-jsx`,
            and `babel-plugin-transform-cx-imports` packages do not support Babel 6 anymore.

            These are the steps required to migrate your applications to Babel 7:

            In `package.json`, update the following packages:

            - `"babel-core"` => `"@babel/core": "^7.2.2"`,
            - `"babel-preset-env"` => `"@babel/preset-env": "^7.2.3"`
            - `"babel-polyfill"` => `"@babel/polyfill": "^7.2.5"`

            In `babel.config`, replace `useBuiltIns: true` with `useBuiltIns: 'usage'`.

            In `polyfill.js`, remove `import "babel-polyfill";`

            If some other Babel plugins are used please make sure that these are also upgraded to versions which target Babel 7.

            That's it.

            #### TypeScript

            One of the benefits that Babel 7 brings is support for TypeScript without the TypeScript tooling.
            You can easily enable TypeScript in your project by installing the `@babel/preset-typescript` npm package
            and registering the preset in your `babel.config` file.
            You'll also have to tweak rules in `webpack.config.js` to support `.ts` and `.tsx` files.

            Replace
            <CodeSplit>
                <CodeSnippet>
                    test: /\.js$/,
                    loader: 'babel-loader',
                </CodeSnippet>
            </CodeSplit>
            with:
            <CodeSplit>
                <CodeSnippet>
                    test: /\.(js|ts|tsx)$/,
                    loader: 'babel-loader',
                </CodeSnippet>
            </CodeSplit>

            You can now mix `.js`, `.ts` and `.tsx` files. However, some of the [JSX in TS related quirks still apply](https://github.com/codaxy/cx-typescript-boilerplate).

            ## 18.12.0

            ### Functional Components and CxJS attributes

            In order to support [store refs](https://github.com/codaxy/cxjs/issues/487) some changes were made to how
            functional components handle CxJS-specific attributes such as `visible`, `controller` and `layout`.

            For example, let's take a simple Tab component.

            <CodeSplit>
                <CodeSnippet>{`
                    const TabCmp = ({ prop1, children }) => <cx>
                       <div class="tab">
                          {children}
                       </div>
                    </cx>
                `}</CodeSnippet>
            </CodeSplit>

            In previous versions of CxJS, if the `visible` attribute is used on a functional component,
            it would be applied on all top-level elements.

            <CodeSplit>
                <CodeSnippet>{`
                    <TabCmp visible-expr="{tab} == 'tab1'">
                        Tab1 Content
                    </TabCmp>
                `}</CodeSnippet>
            </CodeSplit>

            This example above would expand to:

            <CodeSplit>
                <CodeSnippet>{`
                    <div visible-expr="{tab} == 'tab1'" class="tab">
                        Tab1 Content
                    </div>
                `}</CodeSnippet>
            </CodeSplit>

            From this version, a PureContainer wrapper is added to all functional components and all CxJS-specific attributes
            are applied on the wrapper element.

            <CodeSplit>
                <CodeSnippet>{`
                    <PureContainer visible-expr="{tab} == 'tab1'">
                        <div class="tab">
                            Tab1 Content
                        </div>
                    </PureContainer>
                `}</CodeSnippet>
            </CodeSplit>

            Please note that this is a breaking change only if top-level component is `Rescope`, `Restate` or `DataProxy`.

            With this change, both functional components and functional controllers can receive the `store` prop which
            enables [an alternative syntax for accessing data using store references](https://github.com/codaxy/cxjs/issues/487).

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
            This (`confirm`) function is not always necessary, but when needed. it's better to load these additional
            classes
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
