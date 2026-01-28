var cx = require("babel-plugin-transform-cx-jsx");

module.exports = {
   presets: [
      [
         "@babel/preset-env",
         {
            modules: false,
            targets: {
               chrome: "79"
            }
         },
      ],
      "@babel/preset-typescript",
   ],
   plugins: [
      //"@babel/external-helpers",
      "@babel/proposal-function-bind",
      cx,
      ["@babel/transform-react-jsx", { runtime: "automatic" }],
   ],
};
