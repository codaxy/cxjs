import {post} from './base';

export function getToken(provider, state, code, redirect_uri) {
   return post('token', {
      data: {
         provider: provider,
         state: state,
         code: code,
         redirectUri: redirect_uri
      }
   }).then(x=>x.json());
}
