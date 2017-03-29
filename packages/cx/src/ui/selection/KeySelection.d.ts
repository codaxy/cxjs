import * as Cx from '../../core';

import {Selection} from './Selection'

interface KeySelectionConfig {
   bind?: string;
}

export class KeySelection extends Selection {
   constructor(config: KeySelectionConfig);
}
