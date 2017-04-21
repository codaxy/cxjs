import * as Cx from '../core';

export class ResizeManager {
    static subscribe(callback: () => void): void;

    static notify(): void;
}
