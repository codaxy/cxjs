import start from './index';

if (typeof window["fetch"] === "undefined" || typeof window["Intl"] === "undefined") {
   import("./polyfill")
      .then(start);
} else {
   start();
}