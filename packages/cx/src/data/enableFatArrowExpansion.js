import {expandFatArrows} from '../util/expandFatArrows';
import {plugFatArrowExpansion} from './Expression';

export function enableFatArrowExpansion() {
   plugFatArrowExpansion(expandFatArrows);
}
