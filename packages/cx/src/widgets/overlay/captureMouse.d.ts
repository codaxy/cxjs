import * as Cx from '../../core';
import * as React from 'react';

type MouseEventHandler = (e: React.SyntheticEvent<any>, captureData: Cx.Config) => void; 

/**
 * Returns the object representing cursor position
 * @param {React.SyntheticEvent<any>} e - Event
 * @returns {{ clientX: number, clientY: number }}
 */
export function getCursorPos(e: React.SyntheticEvent<any>) : { clientX: number, clientY: number };

export function captureMouse(
        e: React.SyntheticEvent<any>, 
        onMouseMove?: MouseEventHandler, 
        onMouseUp?: (e: React.SyntheticEvent<any>) => void, 
        captureData?: Cx.Config, 
        cursor?: string
    ) : void;

export function captureMouseOrTouch(
        e: React.SyntheticEvent<any>, 
        onMouseMove?: MouseEventHandler, 
        onMouseUp?: (e: React.SyntheticEvent<any>) => void, 
        captureData?: Cx.Config, 
        cursor: string
    ) : void;