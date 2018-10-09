import * as Cx from '../../core';
import {RenderingContext} from '../RenderingContext';
import {View} from '../../data/View';
import {Instance} from '../Instance';

export function exploreChildren(
   context: RenderingContext,
   instance: Instance,
   children: Instance[],
   previousResult: Instance[],
   key?: string,
   store?: View,
   beforeCallback?: () => void,
   afterCallback?: () => void
) : Instance[];