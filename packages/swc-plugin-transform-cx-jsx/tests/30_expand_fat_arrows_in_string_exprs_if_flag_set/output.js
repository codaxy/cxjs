({
    "$type": Repeater,
    records: {
        expr: "{data}.filter(a=>a.enabled)"
    },
    "jsxAttributes": [
        "records"
    ]
});
