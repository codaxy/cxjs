import {HtmlElement} from 'cx/widgets';
import {Md} from '../components/Md';

export const Loading = <cx>
    <Md visible-bind="loading">
        # Loading

        Loading articles. Please wait...
    </Md>
</cx>