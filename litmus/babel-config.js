module.exports = function (production) {
   let config = {
      cacheDirectory: true,
      cacheIdentifier: "v15",
      plugins: [],
      presets: [
         "@babel/preset-typescript",
         [
            "cx-env",
            {
               targets: {
                  chrome: 90,
                  // ie: 11,
                  // firefox: 30,
                  // edge: 12,
                  // safari: 9,
               },
               modules: false,
               loose: true,
               useBuiltIns: false,
               cx: {
                  imports: {
                     useSrc: true,
                  },
               },
            },
         ],
      ],
      plugins: [],
   };

   return config;
};
