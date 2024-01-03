module.exports = function (production) {
   let config = {
      cacheDirectory: true,
      cacheIdentifier: "v14",
      plugins: [],
      presets: [
         [
            "cx-env",
            {
               targets: {
                  chrome: 50,
                  ie: 11,
                  firefox: 30,
                  edge: 12,
                  safari: 9,
               },
               modules: false,
               loose: true,
               corejs: 3,
               useBuiltIns: "usage",
               cx: {
                  imports: {
                     useSrc: true,
                  },
               },
            },
         ],
      ],
   };

   // if (production)
   //    config.presets.push(['babili', {
   //       mangle: false
   //    }]);

   return config;
};
