import * as Cx from "../core";
import { BoundedObject, BoundedObjectProps } from "./BoundedObject";

// no new props defined in NonOverlappingRect, so inheriting BoundedObject directly
export class NonOverlappingRect extends BoundedObject {}
