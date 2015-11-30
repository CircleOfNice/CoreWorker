"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _circleCoreTypes = require("@circle/core-types");

var _circleCoreTypes2 = _interopRequireDefault(_circleCoreTypes);

/**
 * @typedef RegExp
 *
 * @param  {*}       x to be evaluated
 * @return {Boolean}
 */
exports["default"] = _circleCoreTypes2["default"].subtype(_circleCoreTypes2["default"].Object, function (x) {
  return x instanceof RegExp;
}, "RegExp");
module.exports = exports["default"];

//# sourceMappingURL=RegExp.type.js.map