import {Content, HtmlElement, Checkbox, TextField, Select, Option, Repeater, Text} from 'cx/widgets';
import {Controller} from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';


export const CssPage = <cx>

    <Md>
        # CSS

        This article covers multiple aspects related to styling of Cx in your application:

        * [Sass/SCSS](#sass)
        * [Class prefixes and BESM convention](#class-prefixes-and-besm-convention)
        * [Variables and Maps](#variables-and-maps)
        * [Importing SCSS files](#importing-scss-files)
        * [Themes](#themes)
        * [Components](#components)

        ## Sass

        Styling of Cx widgets is implemented using Sass/SCSS. [Sass](http://sass-lang.com/)
        stands for Syntactically Awesome Style Sheets and it's a professional CSS extension language.
        SCSS stands for Sassy CSS and it's a flavor of Sass which uses CSS-like (bracket based)
        syntax instead of indentation.

        SCSS files are compiled into CSS using webpack's `sass-loader` which under the hood uses `node-sass`
        library.

        Before going further, users not familiar with Sass should learn the basic concepts, such as variables
        and mixins.

        ## Class prefixes and BESM convention

        All generated CSS classes use the default prefix `cx`. Furthermore, CSS classes generated
        for each component follow the Block Element State Mod (BESM) convention.

        <CodeSplit>

            BESM convention is inspired by [the BEM convention](http://getbem.com/naming/), which
            provides guidelines for naming CSS classes and performance. BESM convention is slightly
            more relaxed and more suitable for components which appear in many different states.

            0. Block element classes start with the prefix `cxb-`, e.g. `.cxb-window`.
            0. Element classes start with the prefix `cxe-` and include the parent block name, e.g.
            `.cxe-window-header`.
            0. State modifiers start with the prefix `cxs-`, e.g. `.cxs-disabled`.
            0. Style modifiers (mods) start with the prefix `cxm-`, e.g. `.cxm-glow`.

            <CodeSnippet putInto="code">{`
            ///HTML generated by the ColorField widget
            <div class="cxb-colorfield cxs-edit-mode cxs-visited">
                <input
                    class="cxe-colorfield-input"
                    type="text"
                    id="fld-1859"
                    value="#f88"
                >
                <div class="cxe-colorfield-tool">
                    <div style="background-color: rgba(255, 136, 136, 1);"></div>
                </div>
            </div>

            ///HTML generated by the Button widget with mod="primary"
            <button class="cxb-button cxm-primary" type="button">
                Primary
            </button>

            `}</CodeSnippet>
        </CodeSplit>

        By the convention, each component is represented by a single block-level element - `.cxb-`.
        Each block may contain sub-elements which do not have any standalone meaning.
        Element clases always include name of the block and (in Cx) use a different prefix - `.cxe-`.
        Components and elements may be in different states, which is represented by appending
        additional CSS classes - state classes - `.cxs`. Finally, `.cxm-` classes are appended to block
        for the purpose of changing component appearance, which is also known as modding.

        By using the BESM convention, Cx widgets are made very readable and easy to debug.
        It's not mandatory to use the same convention in your application.

        ## Variables and Maps

        Cx offers many variables which can be used to tweak the default appearance of Cx widgets.

        <CodeSplit>
            <CodeSnippet lang="scss">{`
                $cx-default-font-size: 16px;
                $cx-default-input-border-color: #c2dad9;
            `}</CodeSnippet>
        </CodeSplit>

        Some widgets have many different states and each state have its visual properties.
        Cx uses Sass maps to represent style rules corresponding to each state.

        <CodeSplit>
            <CodeSnippet lang="scss">{`
            $cx-list-item: (
                default: (),
                hover: (
                    background-color: rgba(128, 128, 128, 0.1),
                    outline: none
                ),
                hover-focus: (
                    background-color: rgba(123,190,255, 0.15),
                    outline: none,
                ),
                selected: (
                    background-color: rgba(128, 128, 128, 0.2),
                ),
                selected-focus: (
                    background-color: rgba(123,190,255, 0.4),
                    outline: none
                ),
                active: (
                ),
                disabled: (
                    color: rgba(128, 128, 128, .5),
                    background-color: rgba(128, 128, 128, .1),
                    cursor: default
                )
            ) !default;
            `}</CodeSnippet>
        </CodeSplit>

        CSS overrides should be used to override rules that are not covered
        with variables and maps.

        ### Global rules

        Sass maps are used for defining global rules. If you just need
        add/override a couple of rules, use `cx-deep-map-merge` instead
        of replacing the whole map.

        <CodeSplit>
            <CodeSnippet lang="scss">{`
            $cx-element-style-map: cx-deep-map-merge($cx-element-style-map, (
               html: (
                  background: #222
               ),
               a: (
                  text-decoration: none
               )
            ));
            `}</CodeSnippet>
        </CodeSplit>


        ## Importing SCSS files

        Here, we'll assume that your application is also using SCSS. The process
        of importing Cx is somewhat complicated if you need to tweak
        appearance of Cx widgets in your application.

        <CodeSplit>
            <CodeSnippet lang="scss">{`
            //here you have a chance to override Cx variables

            @import "~cx-core/src/variables";

            //before importing CSS you can override state-style-maps here

            //$cx-include-global-rules: false; //include global rules (reset)
            //$cx-include-all: true; //include CSS for all components
            @import "~cx-core/src/index";

            //if $cx-include-all is set to false
            //@include cx-textfield(); //include only components you need
            `}</CodeSnippet>
        </CodeSplit>

        ## Themes

        Cx offers a couple of [themes](http://cx.codaxy.com/themes) out of the box.
        Before using a theme install the theme's NPM package, e.g.

        ```
        npm install cx-theme-dark
        ```

        and then point your application to import Cx styles from the package.

        <CodeSplit>
            <CodeSnippet lang="scss">{`
            ...
            @import "~cx-theme-dark/src/variables";
            ...
            @import "~cx-theme-dark/src/index";
            ...
            `}</CodeSnippet>
        </CodeSplit>

        Some themes beside CSS include JavaScript changes as well. This requires
        that theme JavaScript files at the JavaScript entry point of your application.

        <CodeSplit>
            <CodeSnippet lang="scss">{`
                import "cx-theme-frost/src/index";
            `}</CodeSnippet>
        </CodeSplit>


        ## Components

        Component related SCSS code is placed next to the component JS implementation.
        For example, the `Button` component is implemented in `src/widgets/Button.js` and the
        same folder contains `Button.scss` and `Button.variables.scss`, which are related to styling.

        Components that offer unique styling have a separate file for defining variables.
        Simpler components may not need a separated file and only include a single
        SCSS files which outputs CSS classes required by the component.

        ### Subclassing Widgets

        Subclassing means creating new widgets based on existing ones.
        For example, let's create a new search field widget based on the text field widget.
        It should have round borders, no outer borders and a semi-transparent placeholder color.

        <CodeSplit>
            <CodeSnippet lang="scss">{`
                $searchfield-state-style-map: cx-merge-state-style-maps(
                  $cx-input-state-style-map, (
                    default: (
                      border-radius: 10px,
                      border-width: 0
                    )
                  )
                );

                @include cx-textfield('searchfield', $searchfield-state-style-map,
                  $placeholder: (
                    color: rgba(255, 255, 255, 0.5)
                  )
                );
            `}</CodeSnippet>
        </CodeSplit>

        You can use the new widget by specifying the base class.

        <CodeSplit>
            <CodeSnippet>{`
                <TextField baseClass="searchfield" ... />
            `}</CodeSnippet>
        </CodeSplit>

        The better way would be to subclass it in JavaScript too.

        <CodeSplit>
            <CodeSnippet>{`
                class SearchField extends TextField {}
                SearchField.prototype.baseClass = 'searchfield';
            `}</CodeSnippet>
        </CodeSplit>

        After that you can use it like this:

        <CodeSplit>
            <CodeSnippet>{`
                <SearchField ... />
            `}</CodeSnippet>
        </CodeSplit>

    </Md>
</cx>;

