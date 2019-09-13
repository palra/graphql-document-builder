module.exports = {
    "env": {
    },
    "extends": [
        "standard"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
    },
    "overrides": [
        {
            "files": ["__tests__/**/*.test.js"],
            "env": {
                "jest": true
            },
        }
    ]
};