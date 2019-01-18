module.exports = function (production) {
   let config = {
      cacheDirectory: true,
      cacheIdentifier: "v15",
      "plugins": [
         // ["transform-runtime", {
         //    helpers: true,
         //    polyfill: false,
         //    regenerator: false
         // }]
      ],
      presets: [
         '@babel/preset-typescript',
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
            useBuiltIns: false,
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


