import {Md} from '../../components/Md';

import {HtmlElement} from 'cx/ui/HtmlElement';


export const Versioning = <cx>
    <Md>
        # Versioning

        Cx uses a custom versioning format:

        `yy`.`mm`.`release`

        - `yy` - Year of the release
        - `mm` - Month of the release
        - `patch` - Serial number of the release (reset each month)

        ### Breaking Changes

        Each month brings a new minor version and an opportunity for publishing breaking changes.
        When possible, a breaking change will be announced as a warning in dev build of Cx.

        ### Bugfixes

        Bugfixes will be merged into a couple of previous versions.

        ### New Features

        New features will be released each month and as a nightly build.
    </Md>
</cx>

