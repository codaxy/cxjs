import * as Cx from '../../core';

import {Selection} from './Selection'

interface KeySelectionConfig {
   bind?: string;
   multiple?: boolean;
   keyField?: string;
   storage?: string;
}

export class KeySelection extends Selection {
   constructor(config: KeySelectionConfig);
}
