import * as Cx from '../../core';
import * as React from 'react';
import { CursorPosition } from '../overlay/captureMouse';

// TODO: check props
export interface IDragSource {
   data?: Cx.StructuredProp,
   hideOnDrag?: boolean,
   handled?: boolean,
   // these DragSource properties are calculated and attached in ops.js
   width?: number,
   height?: number,
   margin?: string[]
}

export interface DragEvent {
   eventType: 'dragstart' | 'dragmove' | 'dragdrop',
   event: React.SyntheticEvent<any>,
   cursor: CursorPosition,
   source: IDragSource
}

interface DragDropOptions {
   sourceEl?: HTMLElement,
   clone?: any,
   source?: IDragSource,
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
export function registerDropZone(dropZone: IDropZone) : UnregisterFunction;

export function initiateDragDrop(e: DragEvent, options?: DragDropOptions, onDragEnd?: (e: DragEvent) => void) : void;

export function ddMouseDown(e: React.SyntheticEvent<any>) : void;

export function ddMouseUp() : void;

export function ddDetect(e: React.SyntheticEvent<any>) : void | true;

export function ddHandle(e: React.SyntheticEvent<any>) : void;

export function isDragHandleEvent(e: React.SyntheticEvent<any>) : boolean;