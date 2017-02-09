import {HtmlElement, PureContainer} from 'cx/widgets';
import {FirstVisibleChildLayout} from 'cx/ui';
import {Md} from '../components/Md';

export const PageNotFound = <cx>
    <PureContainer layout={FirstVisibleChildLayout}>
        <Md visible:expr="{error}">
            # Ooops

            Something went wrong. The content could not be loaded. This sometimes happens if the site is being updated.
            Please try refreshing the page.
        </Md>
        <Md>
            # Not Found

            Page that you're looking for could not be found.
        </Md>
    </PureContainer>
</cx>