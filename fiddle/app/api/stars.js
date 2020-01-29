import {get, put, post, deleteObject, checkOk} from './base';

export function getFiddleStar(id) {
   return get(`fiddles/${id}/star`).then(checkOk).then(x=>x.json());
}

export function addFiddleStar(id) {
   return put(`fiddles/${id}/star`).then(checkOk).then(x=>x.json());
}

export function removeFiddleStar(id) {
   return deleteObject(`fiddles/${id}/star`).then(checkOk).then(x=>x.json());
}
