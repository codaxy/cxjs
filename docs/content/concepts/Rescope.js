import { Md } from '../../components/Md';
import { ImportPath } from '../../components/ImportPath';

import { enableFatArrowExpansion } from "cx/data";
enableFatArrowExpansion();

export const RescopePage = <cx>
    <Md>
        # Rescope
        <ImportPath path="import { Rescope } from 'cx/ui';" />

        The `Rescope` widget enables shorter data binding paths by selecting a common prefix.
        Check out the previous example to see how `Rescope` is used to display results.

        Within the scope, outside data may be accessed by using the `$root.` prefix. For example,
        `winner` and `$root.$page.results.winner` point to the same object.
    </Md>
</cx>
