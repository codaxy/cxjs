import * as Cx from '../core';

export function batchUpdates(callback: () => void) : void;

export function isBatchingUpdates() : boolean;

export function notifyBatchedUpdateStarting() : void;

export function notifyBatchedUpdateCompleted() : void;

export function batchUpdatesAndNotify(callback: () => void, notifyCallback: () => void, timeout?: number) : void;