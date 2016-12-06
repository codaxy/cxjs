module.exports = {
   //"cacheDirectory": true,
   cacheIdentifier: "v12",
   presets: [
      ["cx-env", {
         targets: {
            chrome: 45,
            ie: 11,
            ff: 30,
            edge: 12,
            safari: 9
         },
         modules: false,
         loose: true,
         cx: {
            imports: {
               useSrc: true,
               sass: false
            }
         }
      }]
   ],
   "plugins": []
};

