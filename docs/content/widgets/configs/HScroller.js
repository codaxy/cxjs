import {Md} from '../../../components/Md';

import container from './PureContainer';
import classAndStyle from './classAndStyle';
import {CodeSplit} from "../../../components/CodeSplit";

export default {
    ...container,
    ...classAndStyle,
    scrollIntoViewSelector: {
        type: 'string',
        key: true,
        description: <cx><Md>
            A [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) used to find an element
            which should be scrolled into view.
        </Md></cx>
    },

};
