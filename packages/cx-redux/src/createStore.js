import {createStore as createReduxStore} from 'redux';
import {createAppReducer} from './createAppReducer';

export function createStore(reducer, defaultState = {}, enhancer) {
   var appReducer = createAppReducer(reducer);
   return createReduxStore(appReducer, defaultState, enhancer);
}
