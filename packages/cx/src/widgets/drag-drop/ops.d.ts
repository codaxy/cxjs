import * as Cx from '../../core';
import * as React from 'react';
import { DragSourceProps } from './DragSource';
import { DropZone } from './DropZone';
import { CursorPosition } from '../overlay/captureMouse';

export interface DragEvent {
   eventType: string,
   event: React.SyntheticEvent<any>,
   cursor: CursorPosition,
   source: DragSourceProps
}

export function initiateDragDrop(e: DragEvent, options?: Cx.Config, onDragEnd?: (e: DragEvent) => void) : void;

export function registerDropZone(dropZone: DropZone) : () => void;

