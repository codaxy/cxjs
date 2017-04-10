import * as Cx from '../../core';
import * as React from 'react';

export interface CursorPosition {
   clientX: number;
   clientY: number;
}

type MouseEventHandler = (e: React.SyntheticEvent<any>, captureData: Cx.Config) => void; 


export function getCursorPos(e: React.SyntheticEvent<any>) : CursorPos;

export function captureMouse(e: React.SyntheticEvent<any>, onMouseMove?: MouseEventHandler, onMouseUp?: (e: React.SyntheticEvent<any>) => void, captureData?: Cx.Config, cursor?: string) : void;

export function captureMouseOrTouch(e: React.SyntheticEvent<any>, onMouseMove?: MouseEventHandler, onMouseUp?: (e: React.SyntheticEvent<any>) => void, captureData?: Cx.Config, cursor: string) : void;