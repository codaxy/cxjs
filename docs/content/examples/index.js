export * as grid from './grid/';
export * as charts from './charts/';
export * as form from './form/';
export * as list from './list/';
export * as lookup from './lookup/';

import { bumpVersion } from '../version';

//HMR
if (module.hot) {
    module.hot.accept();
    bumpVersion();
}