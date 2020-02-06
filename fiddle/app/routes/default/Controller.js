import { Controller, Url, History } from 'cx/ui';
import { MsgBox } from 'cx/widgets';
import {transpile} from 'app/core/transpiler';
import {addMissingImports} from 'app/core/addImports';
import {reformatCode} from 'app/core/reformatCode';
import {createFiddle, updateFiddle, deleteFiddle} from 'app/api/fiddles';
import {openOpenDialog} from 'app/components/OpenDialog';

import Route from 'route-parser';
import {getToken} from 'app/api/token';
import {getFiddle} from 'app/api/fiddles';
import {getFiddleStar} from 'app/api/stars';
import 'whatwg-fetch';
import { parse } from "query-string";

export default class extends Controller {
   init() {
      super.init();

      var auth = localStorage.getItem('auth');
      if (auth) {
         auth = JSON.parse(auth);
         if (auth.expiry_time > new Date().getTime())
            this.store.set('user.email', auth.email);
      }

      this.store.set('loading', false);
      this.store.init('autoImport', true);

      if (!this.store.get('fiddle') && !this.store.get('qs.f')) {
         var lastFiddle = localStorage.getItem('lastFiddle');
         if (lastFiddle) {
            try {
               var fiddle = JSON.parse(lastFiddle);
               this.store.set('fiddle', fiddle);
               if (fiddle.accessCode)
                  History.replaceState({}, null, Url.resolve("~/?f=" + fiddle.accessCode));
            }
            catch (e) {
            }
         }
      }

      this.addTrigger('loadFiddle', ['qs.f'], f=> {
         if (f) {
            //fix for additional query params
            if (f.indexOf('&') != -1)
               f = f.substring(0, f.indexOf('&'));

            if (f != this.store.get('fiddle.accessCode')) {
               this.store.set('loading', 'loading');
               getFiddle(f)
                  .then(x => {
                     this.store.set('fiddle', x);
                     this.store.set('loading', false);
                     localStorage.setItem('lastFiddle', JSON.stringify(x));
                     if (!x.owned || true) {
                        getFiddleStar(x.fiddleId).then(s => {
                           this.store.set('star', s);
                        });
                     }
                  })
                  .catch(e => {
                     this.store.set('loading', false);
                     MsgBox.alert('Error occurred while loading fiddle.');
                     console.log(e);
                  })
            }
         }
      }, true);

      if (!this.store.get('loading'))
         this.store.init('fiddle.js', '\nexport const App = <cx>\n\t<div>\n\t\tHello World\n\t</div>\n</cx>');

      this.store.set('code.tab', 'js');
      this.store.set('preview.tab', 'result');

      this.addTrigger('autoImport', ['fiddle.js', 'autoImport'], (js, autoImport) => {
         if (autoImport)
            this.store.update('fiddle.js', addMissingImports);
         this.store.update('fiddle.js', reformatCode);
      }, true);

      this.addTrigger('compile', ['fiddle.js'], (js) => {
         transpile(js)
            .then(result => {
               this.store.set('fiddle.compiledJS', result);
            })
            .catch(e => {
               console.warn('TRANSPILE ERROR:', e);
            });
      }, true);

      this.addTrigger('markDirty', ['fiddle'], (f) => {
         this.store.set('dirty', true);
      });

      this.addTrigger('save', ['fiddle'], (fiddle) => {
         localStorage.setItem('lastFiddle', JSON.stringify(fiddle));
      });
   }

   newFiddle(e) {
      e.preventDefault();
      this.store.set('fiddle', {
         js: '\nexport const App = <cx>\n\t<div>\n\t\tHello World\n\t</div>\n</cx>'
      });
      this.store.set('qs', {});
      History.pushState({}, null, Url.resolve("~/"));
      document.activeElement.blur(); //hide menu
   }

   duplicate(e) {
      e.preventDefault();
      this.store.set('qs', {});
      History.pushState({}, null, Url.resolve("~/"));
      this.store.update('fiddle', fiddle => ({
         js: fiddle.js,
         css: fiddle.css,
         data: fiddle.data
      }));
      document.activeElement.blur(); //hide menu
   }

   deleteFiddle(e) {
      var fiddle = this.store.get('fiddle');
      e.preventDefault();
      document.activeElement.blur(); //hide menu
      if (fiddle.fiddleId)
         deleteFiddle(fiddle.fiddleId).then(()=> {
            this.store.set('fiddle', {});
            this.store.set('qs', {});
            History.pushState({}, null, Url.resolve("~/"));
         })
   }

   open(e) {
      e.preventDefault();
      openOpenDialog(this.store);
   }

   save(e) {
      e.preventDefault();

      var fiddle = this.store.get('fiddle');
      if (!fiddle.fiddleName) {
         MsgBox.alert('Please name the fiddle.');
         return;
      }

      var promise;

      this.store.set('saving', true);

      if (!fiddle.owned) {
         promise = createFiddle({
            ...fiddle
         }).then(fiddle => {
            this.store.set('fiddle', fiddle);
            History.pushState({}, null, Url.resolve("~/?f=" + fiddle.accessCode));
         });
      } else {
         promise = updateFiddle(fiddle.fiddleId, {
            ...fiddle
         });
      }

      promise.then(x=> {
         this.store.set('dirty', false);
         this.store.set('saving', false);
      }).catch(e=> {
         this.store.set('saving', false);
         MsgBox.alert('Error occurred during save.' + e);
      })
   }

   publish(e) {
      var fiddle = this.store.get('fiddle');
      if (!fiddle.owned)
         throw new Error('Internal error: Cannot publish fiddles you do not own.');
      this.store.set('fiddle.isPublic', true);
      this.save(e);
   }

   unpublish(e) {
      var fiddle = this.store.get('fiddle');
      if (!fiddle.owned)
         throw new Error('Internal error: Cannot unpublish fiddles you do not own.');
      this.store.set('fiddle.isPublic', false);
      this.save(e);
   }

   signOut(e) {
      e.preventDefault();
      this.store.delete('user');
      localStorage.removeItem('auth');
      this.store.set('fiddle', {});
   }

   signInDialog() {

      var close = () => {
         try {
            if (loginWindow && !loginWindow.closed) {
               loginWindow.close();
               loginWindow = null;
            }
         }
         catch (e) {}
      };

      var w = 1100;
      var h = 700;
      var left = window.screenX + window.innerWidth/2 - w/2;
      var top = window.screenY + window.innerHeight/2 - h/2;

      var loginWindow = window.open(Url.absolute("~/?login=1"), "_blank", `height=${h},width=${w},left=${left},top=${top}`);

      var interval = setInterval(()=> {
         try {
            if (loginWindow.document.domain === document.domain && loginWindow.document.readyState == 'complete') {
               var route = new Route('~/?auth(*splat)');
               var result = route.match(Url.unresolve(loginWindow.document.URL));
               if (result) {
                  var params = parse(loginWindow.document.location.search);
                  clearInterval(interval);
                  var redirect_uri = Url.absolute('~/?auth=1&provider=' + params.provider);
                  getToken(params.provider, params.state, params.code, redirect_uri).then(x=> {
                     close();
                     this.store.set('user.email', x.email);
                     let authStorage = {
                        ...x,
                        expiry_time: new Date().getTime() + x.expires_in * 1000
                     };
                     localStorage.setItem('auth', JSON.stringify(authStorage));
                  }).catch(()=> {
                     close();
                     MsgBox.alert('Error occurred while signing in.');
                  });
               }
            }
         }
         catch (e) {}
      }, 500);

      setTimeout(() => {
         close();
         if (interval) {
            clearInterval(interval);
         }
      }, 60000);
   }
}
