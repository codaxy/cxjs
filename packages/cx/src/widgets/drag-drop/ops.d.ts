import * as Cx from '../../core';
import * as React from 'react';
import { DragSourceProps } from './DragSource';


export interface DragEvent {
   eventType: string,
   event: React.SyntheticEvent<any>,
   // TODO: define type/interface in captureMouse ts file
   cursor: { clientX: number, clientY: number },
   source: DragSourceProps
}


export function initiateDragDrop(e: any, options: any, onDragEnd: any) : void;


