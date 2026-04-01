import {Md} from '../../../components/Md';
import widget from './Widget';
import classAndStyle from './classAndStyle';

export default {
    ...widget,
    ...classAndStyle,
    text: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Text to be displayed.
        </Md></cx>
    },
    query: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Search query.
        </Md></cx>
    },
    chunks: {
        type: 'string[]',
        description: <cx><Md>
            A list of text chunks to be displayed. Even chunks are displayed as common text, odd chunks are highlighted.
            In case this is not provided, the widget will calculate it based on `text` and `query`.
        </Md></cx>
    },
    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class. Default is `highlightedsearchtext`.
        </Md></cx>
    }
};
