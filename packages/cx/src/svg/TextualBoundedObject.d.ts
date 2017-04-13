import * as Cx from '../core';
import {BoundedObject, BoundedObjectProps} from './BoundedObject';

// no new props, but exporting for easier inheritance
export interface TextualBoundedObjectProps extends BoundedObjectProps {}

export class TextualBoundedObject extends BoundedObject {}