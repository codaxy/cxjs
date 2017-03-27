//shamelessly taken from https://davidwalsh.name/vendor-prefix

var getPrefixes = function () {
   var styles = window.getComputedStyle(document.documentElement, ''),
      pre = (Array.prototype.slice
            .call(styles)
            .join('')
            .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
      )[1],
      dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
   return {
      dom: dom,
      lowercase: pre,
      css: '-' + pre + '-',
      js: pre[0].toUpperCase() + pre.substr(1)
   };
}

var prefixes;

export function getVendorPrefix(type) {
   if (!prefixes)
      prefixes = getPrefixes();

   return prefixes[type];
}
