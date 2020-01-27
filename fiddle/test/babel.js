require("@babel/register")({
  retainLines: true,
  presets: [["@babel/preset-env", { loose: true }]]
});
