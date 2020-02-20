import * as Cx from '../../core';
import * as React from 'react';

type MouseEventHandler = (e: React.SyntheticEvent<any>, captureData: Cx.Config) => void;

export interface CursorPosition {
   clientX: number,
   clientY: number
}

/**
 * Returns the object representing cursor position
 * @param e - Event
 * @returns {{ clientX: number, clientY: number }}
 */
export function getCursorPos(e: React.SyntheticEvent<any>): CursorPosition;

export function captureMouse(
   e: React.SyntheticEvent<any>,
   onMouseMove?: MouseEventHandler,
   onMouseUp?: (e: React.SyntheticEvent<any>) => void,
   captureData?: Cx.Config,
   cursor?: string
): void;

export function captureMouse2(
   e: React.SyntheticEvent<any>,
   options: {
      onMouseMove?: MouseEventHandler,
      onMouseUp?: (e: React.SyntheticEvent<any>) => void,
      onDblClick?: (e: React.SyntheticEvent<any>) => void,
      captureData?: Cx.Config,
      cursor?: string
   }
): void;

export function captureMouseOrTouch(
   e: React.SyntheticEvent<any>,
   onMouseMove?: MouseEventHandler,
   onMouseUp?: (e: React.SyntheticEvent<any>) => void,
   captureData?: Cx.Config,
   cursor?: string
): void;

export function captureMouseOrTouch2(
   e: React.SyntheticEvent<any>,
   options: {
      onMouseMove?: MouseEventHandler,
      onMouseUp?: (e: React.SyntheticEvent<any>) => void,
      onDblClick?: (e: React.SyntheticEvent<any>) => void,
      captureData?: Cx.Config,
      cursor?: string
   }
): void;