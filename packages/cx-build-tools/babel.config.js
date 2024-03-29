var cx = require("babel-plugin-transform-cx-jsx");

module.exports = {
   presets: [
      [
         "@babel/preset-env",
         {
            loose: true,
            modules: false,
         },
      ],
   ],
   plugins: [
      //"@babel/external-helpers",
      "@babel/proposal-function-bind",
      cx,
      ["@babel/transform-react-jsx", { runtime: "automatic" }],
   ],
};
