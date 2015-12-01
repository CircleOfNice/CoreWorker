"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _circleCoreTypes = require("@circle/core-types");

var _circleCoreTypes2 = _interopRequireDefault(_circleCoreTypes);

var _ResultType = require("./Result.type");

var _ResultType2 = _interopRequireDefault(_ResultType);

/**
 * @typedef Instance
 *
 * @param  {*}       x to be evaluated
 * @return {Boolean}
 */
exports["default"] = _circleCoreTypes2["default"].subtype(_circleCoreTypes2["default"].Object, function (x) {
    return _circleCoreTypes2["default"].Boolean.is(x.isRunning) && _circleCoreTypes2["default"].Boolean.is(x.fulfilled) && _circleCoreTypes2["default"].Array.is(x.output) && (_ResultType2["default"].is(x.lastMatch) || _circleCoreTypes2["default"].Nil.is(x.lastMatch));
}, "Instance");
module.exports = exports["default"];

//# sourceMappingURL=Instance.type.js.map