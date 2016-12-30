// export * from './LayoutIssue';
// export * from './ShouldUpdate';
// export * from './Svgs';
// export * from './Inferno';
export * from './RepeaterCache';

import { bumpVersion } from '../version';

//HMR
if (module.hot) {
    module.hot.accept();
    bumpVersion();
}