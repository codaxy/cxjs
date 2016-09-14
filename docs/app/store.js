//import {createAppReducer} from 'cx/app/';
//import {createStore} from 'redux';

import {Store} from 'cx/data/Store';

export const store = new Store();

// function updateHashPath() {
//    let hashPath = window.location.hash.substring(1) || '/';
//    store.set('url', hashPath);
// }
//
// updateHashPath();
// setInterval(updateHashPath, 120);
