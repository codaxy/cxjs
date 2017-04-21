import * as Cx from '../../core';

import {Selection} from './Selection'

interface KeySelectionConfig {
   bind?: string;
   multiple?: boolean;
   keyField?: string;
   storage?: string;
   selection?: Cx.Prop<any>
}

export class KeySelection extends Selection {
   constructor(config: KeySelectionConfig);
}
