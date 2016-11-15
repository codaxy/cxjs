import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Checkbox} from 'cx/ui/form/Checkbox';
import {TextField} from 'cx/ui/form/TextField';
import {Text} from 'cx/ui/Text';


export const JsxPage = <cx>
    <Md>
        # JSX

        JSX is a preprocessor step that adds XML syntax to JavaScript. Cx uses JSX to make its views much more elegant.

        ## Babel

        [Babel](https://babeljs.io/) is a tool which compiles ECMAScript 6 into ECMAScript 5 (JavaScript). Babel also understands JSX
        and compiles it into JavaScript. Babel has a plugin based architecture which enables that the process is highly configurable.

        Babel transpiles Cx (JSX) using the `babel-plugin-cx` package which is available over npm.

        ## Cx Syntax

        ### Data-binding Attributes

        ### Conditional Rendering

        ### Whitespace Handling

        ### `style` and `class`

        ### Controller Callbacks

        ### Inner Text

    </Md>
</cx>

