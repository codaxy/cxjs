let activeStore;
let timer;

function getHash() {
   return window.location.hash || '#';
}

export function setupHashBasedRouting(store) {
   activeStore = store;
   store.set('hash', getHash());
   clearInterval(timer);
   timer = setInterval(() => {
      activeStore.set('hash', getHash());
   }, 100);
}
