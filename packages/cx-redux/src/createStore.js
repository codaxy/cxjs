import {createStore as createReduxStore} from 'redux';
import {createAppReducer} from './createAppReducer';

export function createStore(reducer, defaultState = {}, enhancer) {
   var appReducer = createAppReducer(reducer);
   if (typeof defaultState == 'function') {
      enhancer = defaultState;
      defaultState = {};
   }
   return createReduxStore(appReducer, defaultState, enhancer);
}
