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
                    firefox: 30,
                    edge: 12,
                    safari: 9
                },
                corejs: 3,
                modules: false,
                loose: true,
                useBuiltIns: 'usage',
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
