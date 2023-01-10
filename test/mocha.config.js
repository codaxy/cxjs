module.exports = {
   spec: [
      "packages/babel-plugin-transform-cx-jsx/test",
      "packages/babel-plugin-transform-cx-imports/test",
      "packages/cx/src/**/*.spec.*",
   ],
   require: "./test/babel",
   extension: ["js", "ts", "tsx"],
};
