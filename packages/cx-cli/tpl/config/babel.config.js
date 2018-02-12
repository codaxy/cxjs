module.exports = {
    cacheDirectory: true,
    cacheIdentifier: "v1",
    presets: [
        [
            "cx-env",
            {
                targets: {
                    chrome: 50,
                    ie: 11,
                    ff: 30,
                    edge: 12,
                    safari: 9
                },
                modules: false,
                loose: true,
                useBuiltIns: true,
                cx: {
                    imports: {
                        useSrc: true
                    }
                }
            }
        ]
    ],
    plugins: []
};
