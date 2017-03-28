import * as Cx from '../core';

export class Controller {
    onInit?(): void;

    onExplore?(): void;

    onPrepare?(): void;

    onCleanup?(): void;

    init?(): void;
}
