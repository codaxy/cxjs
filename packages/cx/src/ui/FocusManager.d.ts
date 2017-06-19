import * as Cx from '../core';

declare type FocusOutCallback = (Element) => void;

export class FocusManager {
    static subscribe(callback: FocusOutCallback): void;

    static onFocusOut(el : Element, callback: FocusOutCallback): () => void;

    static oneFocusOut(el: Element, callback: FocusOutCallback): () => void;

    static nudge(): () => void;

    static focus(el: Element): () => void;

    static focusFirst(el: Element): () => void;

    static setInterval(interval: number) : void;
}

export function oneFocusOut(component: any, el: Element, callback: FocusOutCallback);

export function offFocusOut(component: any) : void;

export function preventFocus(e: Event) : void;

export function preventFocusOnTouch(e: Event, force?: boolean): void;
