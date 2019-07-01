import {Md} from '../../../components/Md';
import pureContainer from '../../widgets/configs/PureContainer';

export default {
    ...pureContainer,
    
    data: {
        key: true,
        type: 'object',
        description: <cx><Md>
            Object whose property names represent the internal bindings under which the property values are available within the `PrivateStore`.
        </Md></cx>
    },
    detached: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Improve performance by detaching `PrivateStore` subtree from the rest of the page. 
            Detached content renders in its own render loop and uses a `data` declaration to determine which changes can go in or out.
            Detached render loops break the use of `context`, so some advanced Cx features, such as layouts, may not work.
        </Md></cx>
    },
    deferredUntilIdle: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Improves performance by deferring the render until the browser is idle.
        </Md></cx>
    },
    idleTimeout: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Time limit in milliseconds a browser can defer the render.
        </Md></cx>
    }
};