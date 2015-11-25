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
 * Creats a new Result
 *
 * @param  {String?} match stored in result
 * @return {Result}
 */
_ResultType2["default"].create = _circleCoreTypes2["default"].func([_circleCoreTypes2["default"].maybe(_circleCoreTypes2["default"].String)], _ResultType2["default"], "Result.create").of(function (match) {
    return {
        data: match
    };
});

exports["default"] = _ResultType2["default"];
module.exports = exports["default"];

//# sourceMappingURL=Result.js.map