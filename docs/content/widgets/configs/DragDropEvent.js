import {Md} from '../../../components/Md';
import classAndStyle from './classAndStyle';
import pureContainer from './PureContainer';

export default {
    ...classAndStyle,
    ...pureContainer,
    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied to the element. Default value is 'dragsource'.
        </Md></cx>
    },
    innerHtml: {
        type: 'string',
        alias: 'html',
        description: <cx><Md>
            HTML to be injected into the element.
        </Md></cx>
    },
    text: {
        type: 'string',
        alias: 'innerText',
        description: <cx><Md>
            Inner text contents.
        </Md></cx>
    },
    tooltip: {
        type: 'string/object',
        description: <cx><Md>
            Tooltip configuration. For more info see [Tooltips](~/widgets/tooltips).
        </Md></cx>
    }
};
