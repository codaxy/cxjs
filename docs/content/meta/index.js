export * from './OpenSourceSoftware';
export * from './CxCredit';
export * from './Versioning';

import { bumpVersion } from '../version';

//HMR
if (module.hot) {
    module.hot.accept();
    bumpVersion();
}