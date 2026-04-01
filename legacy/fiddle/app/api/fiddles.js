import {get, put, post, deleteObject, checkOk} from './base';

export function updateFiddle(id, data) {
   return post(`fiddles/${id}`, {
      data: data
   }).then(x=>x.json());;
}

export function createFiddle(data) {
   return put(`fiddles`, {data: data})
      .then(checkOk)
      .then(x=>x.json());
}

export function deleteFiddle(id) {
   return deleteObject(`fiddles/${id}`);
}

export function queryFiddles(query) {
   return get(`fiddles`, {query: query})
      .then(checkOk)
      .then(x=>x.json());
}

export function getFiddle(accessCode) {
   return get('fiddles', {
      query: {
         accessCode: accessCode
      }
   }).then(checkOk).then(x=>x.json());
}
