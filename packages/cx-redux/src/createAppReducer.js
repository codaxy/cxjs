import {replaceState} from './actions';

export function createAppReducer(reducer) {
   return (state, action) => {
      if (action.type == replaceState)
         return action.state;

      return reducer(state, action);
   }
}
