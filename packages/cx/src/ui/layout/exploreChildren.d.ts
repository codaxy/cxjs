import { View } from "../../data/View";
import { Instance } from "../Instance";
import { RenderingContext } from "../RenderingContext";

export function exploreChildren(
   context: RenderingContext,
   instance: Instance,
   children: Instance[],
   previousResult: Instance[],
   key?: string,
   store?: View,
): Instance[];
