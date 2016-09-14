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
      return url.indexOf(absBase) == 0 || url.indexOf(this.base) == 0;
   }

   static setBase(base) {
      if (!base || base[base.length - 1] != '/')
         base += '/';
      this.base = base;
      if (typeof window != 'undefined')
         this.absoluteBase = window.location.protocol + '//' + window.location.host + this.base
   }

   static getOrigin() {
      return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
   }

   static setBaseFromScript(scriptPath) {
      var path = scriptPath.replace('~/', '');
      var scripts = document.getElementsByTagName('script');

      for (var i = 0; i < scripts.length; i++) {
         var src = scripts[i].src;
         var questionMark = src.indexOf('?');
         if (questionMark != -1)
            src = src.substring(0, questionMark);
         var ending = src.substr(-path.length, path.length);
         if (ending == path) {
            var origin = this.getOrigin();
            var base = src.substring(src.indexOf(origin) == 0 ? origin.length : 0, src.length - path.length);
            this.setBase(base);
            return;
         }
      }

      throw new Error(`Could not resolve url base from script matching '${scriptPath}'.`);
   }
}

Url.setBase('/');
