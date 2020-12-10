
let {core} = require("./3rd_party/script/core.js");
let {ThirdParty} = require("./3rd_party/script/config.js");

module.exports = {
  name: "utils",
  version: '0.996.0',
  scripts: [
  ],
  files: ["src", "index.ts"],
  dependencies: [
    ThirdParty.tsmd5
  ],
  devDependencies: [
  ],
  "miniprogram": "."
};
