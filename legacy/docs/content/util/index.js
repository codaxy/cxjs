export * from './Color';
export * from './Date';
export * from './Dom';
export * from './Misc';



import { bumpVersion } from '../version';

//HMR
if (module.hot) {
    module.hot.accept();
    bumpVersion();
}