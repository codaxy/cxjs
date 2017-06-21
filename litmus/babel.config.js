module.exports = function (production) {
   let config = {
      cacheDirectory: true,
      cacheIdentifier: "v14",
      "plugins": [
         // ["transform-runtime", {
         //    helpers: true,
         //    polyfill: false,
         //    regenerator: false
         // }]
      ],
      presets: [
         ["cx-env", {
            targets: {
               chrome: 50,
               ie: 11,
               ff: 30,
               edge: 12,
               safari: 9
            },
            modules: false,
            loose: true,
            useBuiltIns: true,
            cx: {
               imports: {
                  useSrc: true
               }
            }
         }]
      ]
   };

   // if (production)
   //    config.presets.push(['babili', {
   //       mangle: false
   //    }]);

   return config;
};


