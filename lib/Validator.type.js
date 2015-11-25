"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _circleCoreTypes = require("@circle/core-types");

var _circleCoreTypes2 = _interopRequireDefault(_circleCoreTypes);

var _ConditionType = require("./Condition.type");

var _ConditionType2 = _interopRequireDefault(_ConditionType);

/**
 * @typedef Validator
 */
exports["default"] = _circleCoreTypes2["default"].struct({
  filter: _ConditionType2["default"],
  validate: _circleCoreTypes2["default"].func([_circleCoreTypes2["default"].String], _circleCoreTypes2["default"].Boolean, "validate")
}, "Validator");
module.exports = exports["default"];

//# sourceMappingURL=Validator.type.js.map