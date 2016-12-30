export * from './Svgs';
export * from './Texts';
export * from './Rectangles';
export * from './Lines';
export * from './Ellipses';
export * from './ClipRects';

import { bumpVersion } from '../version';

//HMR
if (module.hot) {
    module.hot.accept();
    bumpVersion();
}