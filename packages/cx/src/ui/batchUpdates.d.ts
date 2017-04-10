import * as Cx from '../core';

export function batchUpdates(callback: () => void, didUpdateCallback?: () => void) : void;

export function isBatchingUpdates() : boolean;

export function notifyBatchedUpdateStarting() : void;

export function notifyBatchedUpdateCompleted() : void;