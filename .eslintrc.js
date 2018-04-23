module.exports = {
  "env": {
    "commonjs": true,
    "es6": true,
    "node": true,
    "mocha": true
  },
  "extends": "eslint:recommended",
  "parser": "babel-eslint",
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-console": [
      "error",
      {
        "allow":["warn","error","info"]
      }
    ]
  }
};
