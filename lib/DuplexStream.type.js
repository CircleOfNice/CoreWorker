"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _circleCoreTypes = require("@circle/core-types");

var _circleCoreTypes2 = _interopRequireDefault(_circleCoreTypes);

var _NodeProcessType = require("./NodeProcess.type");

var _NodeProcessType2 = _interopRequireDefault(_NodeProcessType);

/**
 * @typedef DuplexStream
 */
exports["default"] = _circleCoreTypes2["default"].subtype(_circleCoreTypes2["default"].Object, function (x) {
  return _NodeProcessType2["default"].is(x.instance);
}, "DuplexStream");
module.exports = exports["default"];

//# sourceMappingURL=DuplexStream.type.js.map