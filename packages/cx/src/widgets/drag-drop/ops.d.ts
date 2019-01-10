import * as Cx from '../../core';
import * as React from 'react';
import { CursorPosition } from '../overlay/captureMouse';
import { View } from '../../data/View';

export interface DragEvent {
   type: 'dragstart' | 'dragmove' | 'dragdrop',
   event: React.SyntheticEvent<any>,
   cursor: CursorPosition,
   source: {
      width: number,
      height: number,
      margin: string[],
      data?: any,
      store: View,
      [other: string]: any,
   },
   result?: any
}

interface DragDropOptions {
   sourceEl?: Element,
   clone?: any,
   source?: Cx.Config,
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

type UnregisterFunction = () => void;

/** Register a drop zone. Return value is a function that can be used to unregister the drop zone. */
export function registerDropZone(dropZone: IDropZone) : UnregisterFunction;

/** Initiate a drag-drop operation. */
export function initiateDragDrop(e: DragEvent, options?: DragDropOptions, onDragEnd?: (e?: DragEvent) => void) : void;

export function ddMouseDown(e: React.SyntheticEvent<any>) : void;

export function ddMouseUp() : void;

export function ddDetect(e: React.SyntheticEvent<any>) : void | true;

export function ddHandle(e: React.SyntheticEvent<any>) : void;

export function isDragHandleEvent(e: React.SyntheticEvent<any>) : boolean;