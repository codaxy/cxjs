module.exports = {
   //"cacheDirectory": true,
   "cacheIdentifier": "v11",
   "presets": [
      ["cx-env", {
         targets: {
            chrome: 52
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

