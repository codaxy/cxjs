import * as Cx from '../../core';
import * as React from 'react';
import { DragSource } from './DragSource';


export interface DragEvent {
   eventType: string,
   event: React.SyntheticEvent<any>,
   cursor: any,
   source: any
}


export function initiateDragDrop(e: any, options: any, onDragEnd: any) : void;


