"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _circleCoreTypes = require("@circle/core-types");

var _circleCoreTypes2 = _interopRequireDefault(_circleCoreTypes);

var _RegExType = require("./RegEx.type");

var _RegExType2 = _interopRequireDefault(_RegExType);

/**
 * @typedef Condition
 */
var Condition = _circleCoreTypes2["default"].union([_RegExType2["default"], _circleCoreTypes2["default"].String, _circleCoreTypes2["default"].Function], "Condition");

Condition.dispatch = function (x) {
    if (_RegExType2["default"].is(x)) return _RegExType2["default"];
    if (_circleCoreTypes2["default"].String.is(x)) return _circleCoreTypes2["default"].String;
    if (_circleCoreTypes2["default"].Function.is(x)) return _circleCoreTypes2["default"].Function;

    throw new TypeError("Cannot dispatch Condition: " + x);
};

exports["default"] = Condition;
module.exports = exports["default"];

//# sourceMappingURL=Condition.type.js.map