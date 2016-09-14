import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Content} from 'cx/ui/layout/Content';
import {Checkbox} from 'cx/ui/form/Checkbox';
import {TextField} from 'cx/ui/form/TextField';
import {Select, Option} from 'cx/ui/form/Select';
import {Repeater} from 'cx/ui/Repeater';
import {Text} from 'cx/ui/Text';
import {Controller} from 'cx/ui/Controller';

export const CssPage = <cx>

   <Md>
      # CSS

      Cx widgets are styled using CSS rules. By default, CSS follows these conventions:

      - Global reset rules are not part of the framework.
      Widgets should not cause any problems if combined with an existing CSS framework, e.g. Bootsrap.
      - All CSS rules are prefixed.
      - In order to make styling easy, all widgets should honor global theme variables for default colors and sizes.

      ## Conventions

      CSS rules follow a modified BEM methodology:

      0. Block element classes start with the prefix `cxb-`, e.g. `.cxb-window`.
      0. Element classes start with the prefix `cxe-` and include the parent block name, e.g. `.cxe-window-header`.
      0. Style modifiers start with the prefix `cxm-`, e.g. `.cxm-glow`.
      0. State modifiers start with the prefix `cxs-`, e.g. `.cxs-disabled`.

      ## SASS

      Cx widget code is located inside the `src/ui` directory. It's enough to import `index.scss` to your SASS project
      and all Cx styles will be pulled in. Alternatively, each widget has a corresponding SCSS file and you may
      manually add imports for files that you actually need.


      <CodeSplit>

      </CodeSplit>

   </Md>

</cx>

