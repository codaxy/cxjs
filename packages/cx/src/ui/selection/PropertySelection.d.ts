import * as Cx from '../../core';

import {Selection} from './Selection'

interface PropertySelectionConfig {
   selectedField?: string;
   multiple?: boolean;
}

export class PropertySelection extends Selection {
   constructor(config: PropertySelectionConfig);
}
