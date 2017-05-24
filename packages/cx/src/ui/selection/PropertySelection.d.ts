import * as Cx from '../../core';

import {Selection} from './Selection'

interface PropertySelectionConfig {
   selectedField?: string
   multiple?: boolean
   keyField?: string
   record?: Cx.Binding
   records?: Cx.Binding
   index?: Cx.Binding
   bind?: string
}

export class PropertySelection extends Selection {
   constructor(config: PropertySelectionConfig);
}
