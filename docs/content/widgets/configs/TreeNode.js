import {Md} from '../../../components/Md';
import container from './HtmlElement';

export default {
    ...container,
    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied to the element. Default is 'treenode'.
        </Md></cx>
    },

    expanded: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            A value indicating if tree node is expanded or not.
        </Md></cx>
    },
    leaf: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            A value indicating if tree node is a leaf node or not. Leaf nodes cannot have any children.
        </Md></cx>
    },
    loading: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            A value indicating if tree node is currently loading its children.
        </Md></cx>
    },
    level: {
        type: 'number',
        key: true,
        description: <cx><Md>
            A value indicating the depth level inside the tree used for indenting.
        </Md></cx>
    },
    text: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Text to be displayed alongside the icon.
        </Md></cx>
    },
    icon: {
        type: 'string',
        key: true,
        description: <cx><Md>
            An icon to be displayed. If not set, default icons will be used.
        </Md></cx>
    },
    loadingIcon: {
        type: 'string',
        description: <cx><Md>
            Icon to be used while in loading state. Default is `loading`.
        </Md></cx>
    },
    folderIcon: {
        type: 'string',
        description: <cx><Md>
            Icon to be used to represent folders. Default is `folder`.
        </Md></cx>
    },
    openFolderIcon: {
        type: 'string',
        description: <cx><Md>
            Icon to be used to represent open folders. Default is `folder-open`.
        </Md></cx>
    },
    itemIcon: {
        type: 'string',
        description: <cx><Md>
            Icon to represent leaf nodes. Default is `loading`.
        </Md></cx>
    }
};
