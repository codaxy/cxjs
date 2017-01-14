import { Store } from 'cx/data';
//import {createAppReducer} from 'cx/app/';
//import {createStore} from 'redux';
import { isTouchDevice } from 'cx/util';


export const store = new Store();

store.init('layout.navOpen', window.innerWidth > 1000);
store.init('layout.touch', isTouchDevice() && window.innerWidth <= 1000);

// function updateHashPath() {
//    let hashPath = window.location.hash.substring(1) || '/';
//    store.set('url', hashPath);
// }
//
// updateHashPath();
// setInterval(updateHashPath, 120);
