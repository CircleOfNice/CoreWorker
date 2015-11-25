"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _circleCoreTypes = require("@circle/core-types");

var _circleCoreTypes2 = _interopRequireDefault(_circleCoreTypes);

/**
 * @typedef Result
 */
exports["default"] = _circleCoreTypes2["default"].struct({
  data: _circleCoreTypes2["default"].maybe(_circleCoreTypes2["default"].String)
}, "Result");
module.exports = exports["default"];

//# sourceMappingURL=Result.type.js.map