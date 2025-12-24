import { expandFatArrows } from '../util/expandFatArrows';
import { plugFatArrowExpansion } from './Expression';

export function enableFatArrowExpansion(): void {
   plugFatArrowExpansion(expandFatArrows);
}
