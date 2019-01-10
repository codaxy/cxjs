import { View } from '../../data/View';
import { Instance } from '../Instance';

/**
   Starts the app loop with hot module reloading. Whenever the given module is updated, the app state is preserved.
 */
export function startHotAppLoop(appModule: any, parentDOMElement: Element, storeOrInstance: View | Instance, widget?: any, options?: any);