"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _circleCoreTypes = require("@circle/core-types");

var _circleCoreTypes2 = _interopRequireDefault(_circleCoreTypes);

var _NodeProcess = require("./NodeProcess");

var _NodeProcess2 = _interopRequireDefault(_NodeProcess);

/**
 * @typedef ProcessManager
 */
exports["default"] = _circleCoreTypes2["default"].struct({
  instance: _NodeProcess2["default"]
}, "ProcessManager");
module.exports = exports["default"];

//# sourceMappingURL=Process.type.js.map