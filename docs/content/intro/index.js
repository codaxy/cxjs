export * from './About';
export * from './GettingStarted';
export * from './FeatureList';
export * from './CommandLine';
export * from './StepByStep';
export * from './Jsx';
export * from './BreakingChanges';
export * from './NpmPackages';

import { bumpVersion } from '../version';

//HMR
if (module.hot) {
    module.hot.accept();
    bumpVersion();
}