import {Debug} from '../../../../util/Debug';
import {Bar as Bar1} from '../Bar';

Debug.log('The Bar class is from charts/series namespace is deprecated. Please use Bar from charts namespace instead.');

export const Bar = Bar1;