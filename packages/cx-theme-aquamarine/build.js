const buildTheme = require("cx-build-tools/buildTheme");

async function build()
{
   try {
      console.log("Building theme...");
      await buildTheme(__dirname);
   }
   catch (err) {
      console.error(err);
   }
}

build();