import { Record, StructuredSelector, Selector } from '../core';

export function createStructuredSelector(selector: StructuredSelector, constants?: Record): Selector<Record>;