let transformImports = require("../packages/babel-plugin-transform-cx-imports");

module.exports = function (options) {
   var isProduction = options.production;

   return {
      cacheDirectory: true,
      cacheIdentifier: "v16",
      presets: [
         "@babel/typescript",
         [
            "@babel/preset-env",
            {
               loose: true,
               modules: false,
               useBuiltIns: "usage",
               corejs: 3,
               targets: {
                  chrome: 55,
                  ie: 11,
                  firefox: 30,
                  edge: 12,
                  safari: 9,
               },
            },
         ],
      ],
      plugins: [
         [
            "transform-cx-jsx",
            {
               trimWhitespace: true,
               trimWhitespaceExceptions: ["Md", "CodeSnippet", "CodeSplit"],
            },
         ],
         ["@babel/transform-react-jsx", { runtime: "automatic" }],
         "@babel/proposal-function-bind",
         [transformImports, { useSrc: true }],
         //isProduction && false && ["transform-cx-imports", { useSrc: true }],
      ].filter(Boolean),
   };
};
