module.exports = {
   //"cacheDirectory": true,
   "cacheIdentifier": "v11",
   "presets": [
      ["cx-env", {
         "targets": {
            "chrome": 52
         },
         "modules": false,
         "loose": true,
         "cx": {
            useSrc: true,
            sass: true
         }
      }]
   ],
   "plugins": []
};

