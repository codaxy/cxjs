require("@babel/register")({
   retainLines: true,
   presets: ["@babel/typescript", ["@babel/preset-env", { loose: true }]],
   plugins: [
      ["@babel/transform-react-jsx", { runtime: "automatic" }],
      [
         "transform-cx-jsx",
         {
            autoImportHtmlElement: false, //adds cx/ based imports which cause double imports (dist + src)
            transformFunctionalComponents: false, //adds cx/ based imports which cause double imports (dist + src)
         },
      ],
      "@babel/proposal-function-bind",
   ],
   extensions: [".js", ".jsx", ".ts", ".tsx"],
});
