import {Content, HtmlElement, Checkbox, TextField, Select, Option, Repeater, Text} from 'cx/widgets';
import {Controller} from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';


export const CssPage = <cx>

    <Md>
        # CSS

        Styling of CSS widgets is a complex topic which covers a few subtopics:

        * [SASS/SCSS](#sass)
        * [Class prefixes and BESM convention](#class-prefixes-and-besm-convention)
        * [Variables and Maps](#variables-and-maps)
        * [Importing SCSS files](#importing-scss-files)
        * [Themes](#themes)
        * [Components](#components)

        ## SASS

        Styling of Cx widgets is implemented using Sass/SCSS. [Sass](http://sass-lang.com/)
        stands for Syntactically Awesome Style Sheets and it's a professional CSS extension language.
        SCSS stands for Sassy CSS and it's a flavor of Sass which uses CSS-like (bracket based)
        syntax instead of indentation.

        SCSS files are compiled into CSS using webpack's `sass-loader` which under the hood uses `node-sass`
        library.

        Before going further, users not familiar with Sass should learn the basic concepts, such as variables
        and mixins.

        ## Class prefixes and BESM convention

        All Cx CSS classes use the default prefix `cx`. Furthermore, CSS classes generated
        for each component follow the Block Element State Mod (BESM) convention.

        <CodeSplit>

            BESM convention is inspired by [BEM convention](http://getbem.com/naming/), however it's slightly more relaxed.

            0. Block element classes start with the prefix `cxb-`, e.g. `.cxb-window`.
            0. Element classes start with the prefix `cxe-` and include the parent block name, e.g. `.cxe-window-header`.
            0. State modifiers start with the prefix `cxs-`, e.g. `.cxs-disabled`.
            0. Style modifiers (mods) start with the prefix `cxm-`, e.g. `.cxm-glow`.

            <CodeSnippet putInto="code">{`
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

        ## Variables & Maps

        Cx offers many variables which can be used to tweak the appearance of Cx widgets.

        <CodeSplit>
        <CodeSnippet>{`
            $cx-default-font-size: 16px;
            $cx-default-input-border-color: #c2dad9;
        `}</CodeSnippet>
        </CodeSplit>

        Some widgets have many different states and each state have its visual properties.
        Cx uses SASS maps to represent multiple style rules corresponding to each state.

        <CodeSplit>
        <CodeSnippet>{`
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

        ### Global rules

        ## Importing SCSS files

        Here, we'll assume that your application is also using SCSS. The process
        of importing Cx is somewhat complicated if you need to tweak
        appearance of Cx widgets in your application.

        <CodeSplit>
        <CodeSnippet>{`
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
            <CodeSnippet>{`
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
            <CodeSnippet>{`
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

        ### Subclassing
    </Md>

</cx>

