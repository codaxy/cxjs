//shamelessly taken from https://davidwalsh.name/vendor-prefix

interface Prefixes {
   dom: string;
   lowercase: string;
   css: string;
   js: string;
}

var getPrefixes = function (): Prefixes {
   var styles = window.getComputedStyle(document.documentElement, '') as any;
   var match = Array.prototype.slice
      .call(styles)
      .join('')
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']);
   var pre = (match as string[])[1];
   var dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))![1];
   return {
      dom: dom,
      lowercase: pre,
      css: '-' + pre + '-',
      js: pre[0].toUpperCase() + pre.substr(1)
   };
}

var prefixes: Prefixes | undefined;

export function getVendorPrefix(type: 'dom' | 'lowercase' | 'css' | 'js'): string {
   if (!prefixes)
      prefixes = getPrefixes();

   return prefixes[type];
}
