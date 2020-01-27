function appendQuery(url, x) {
   var query = ''
   for (var key in x) {
      if (x[key] != null) {
         query += query.length == 0 ? '?' : '&';
         query += `${key}=${encodeURIComponent(x[key])}`;
      }
   }
   return url + query;
}

import config from 'config';

var {api} = config;

export function getAccessToken() {
   return localStorage['auth'] && JSON.parse(localStorage['auth']).access_token;
}

export function checkOk(response) {
   if (!response.ok)
      throw Error(response.statusText);

   return response;
}

export function getAuthHeaders() {
   var token = getAccessToken();
   if (!token)
      return {};

   return {
      'Authorization': `Bearer ${token}`
   };
}

export function post(res, options) {
   return fetch(api.url + res, {
      method: 'POST',
      credentials: api.cookies,
      headers: {
         ...options.headers,
         ...getAuthHeaders(),
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(options.data)
   });
}

export function put(res, options = {}) {
   return fetch(api.url + res, {
      method: 'PUT',
      credentials: api.cookies,
      headers: {
         ...options.headers,
         ...getAuthHeaders(),
         'Content-Type': 'application/json'
      },
      body: options.data && JSON.stringify(options.data)
   });
}

export function deleteObject(res, options = {}) {
   return fetch(api.url + res, {
      method: 'DELETE',
      credentials: api.cookies,
      headers: {
         ...options.headers,
         ...getAuthHeaders(),
         'Content-Type': 'application/json'
      }
   });
}

export function get(res, options = {}) {
   return fetch(appendQuery(api.url + res, options.query), {
      method: 'GET',
      credentials: api.cookies,
      headers: {
         ...options.headers,
         ...getAuthHeaders(),
         'Content-Type': 'application/json'
      }
   });
}
