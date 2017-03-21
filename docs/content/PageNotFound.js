import {HtmlElement, PureContainer} from 'cx/widgets';
import {FirstVisibleChildLayout} from 'cx/ui';
import {Md} from '../components/Md';

export const PageNotFound = <cx>
    <PureContainer layout={FirstVisibleChildLayout}>
        <Md visible:expr="{error}">
            # Error

            Something went wrong. The content could not be loaded. This sometimes happens when the site is being updated.
            Please try refreshing the page.
        </Md>
        <Md>
            # Page Not Found

            Page that you're looking for could not be found.
        </Md>
    </PureContainer>
</cx>