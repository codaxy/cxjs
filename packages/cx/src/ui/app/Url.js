export class Url {
   static resolve(path) {
      return path.replace('~/', this.base);
   }

   static absolute(path) {
      return path.replace('~/', this.absoluteBase);
   }

   static unresolve(path) {
      if (path.indexOf('~/') == 0)
         return path;

      var absBase = this.absoluteBase || '';

      if (path.indexOf(absBase) == 0)
         return '~/' + path.substring(absBase.length);

      return '~/' + path.substring(this.base.length);
   }

   static getAbsoluteBase() {
      return this.absoluteBase;
   }

   static isLocal(url) {
      var absBase = this.getAbsoluteBase();
      return url.indexOf('~/') == 0 || url.indexOf(absBase) == 0 || url.indexOf(this.base) == 0;
   }

   static setBase(base) {
      if (!base || base[base.length - 1] != '/')
         base += '/';
      this.base = base;
      if (typeof window != 'undefined')
         this.absoluteBase = window.location.protocol + '//' + window.location.host + this.base
   }

   static getOrigin() {
      if (typeof window == 'undefined')
         return '';
      return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
   }

   static getBaseFromScriptSrc(src, scriptPath) {
      if (!(scriptPath instanceof RegExp))
         scriptPath = getBasePathRegex(scriptPath);

      let index = src.search(scriptPath);
      if (index == -1)
         return false;

      let origin = this.getOrigin();
      return src.substring(src.indexOf(origin) == 0 ? origin.length : 0, index);
   }

   static setBaseFromScript(scriptPath) {
      var scripts = document.getElementsByTagName('script'),
         base;

      if (!(scriptPath instanceof RegExp))
         scriptPath = getBasePathRegex(scriptPath);

      for (let i = 0; i < scripts.length; i++) {
         base = this.getBaseFromScriptSrc(scripts[i].src, scriptPath);
         if (base) {
            this.setBase(base);
            return;
         }
      }

      throw new Error(`Could not resolve url base from script matching '${scriptPath}'.`);
   }
}

Url.setBase('/');

function getBasePathRegex(str) {
   let regex = '';
   let start = 0;
   if (str.indexOf('~/') == 0)
      start = 2;

   for (let i = start; i < str.length; i++) {
      switch (str[i]) {
         case '.':
            regex += '\\.';
            break;

         case '*':
            regex += '.*';
            break;

         default:
            regex += str[i];
      }
   }
   return new RegExp(regex + '(\\?.*)?$', 'i');
}