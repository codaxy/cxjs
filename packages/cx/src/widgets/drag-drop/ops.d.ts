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

type DragEventHandler = (e: DragEvent) => void;

export interface IDropZone {
   onDropTest?: (e: DragEvent) => boolean;
   onDragStart?: DragEventHandler;
   onDragAway?: DragEventHandler;
   onDragEnd?: DragEventHandler;
   onDragMeasure?: (e: DragEvent) => { over: boolean, near: boolean };
   onDragLeave?: DragEventHandler;
   onDragOver?: DragEventHandler;
   onDragEnter?: DragEventHandler;
   onDrop?: DragEventHandler;
}

export function registerDropZone(dropZone: IDropZone) : () => void;

export function initiateDragDrop(e: DragEvent, options?: Cx.Config, onDragEnd?: (e: DragEvent) => void) : void;

