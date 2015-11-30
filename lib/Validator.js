"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _circleCoreTypes = require("@circle/core-types");

var _circleCoreTypes2 = _interopRequireDefault(_circleCoreTypes);

var _ValidatorType = require("./Validator.type");

var _ValidatorType2 = _interopRequireDefault(_ValidatorType);

var _RegExpType = require("./RegExp.type");

var _RegExpType2 = _interopRequireDefault(_RegExpType);

var _ConditionType = require("./Condition.type");

var _ConditionType2 = _interopRequireDefault(_ConditionType);

var _lodash = require("lodash");

var _Result = require("./Result");

var _Result2 = _interopRequireDefault(_Result);

/**
 * Returns matched String
 *
 * @param  {String} data containing matched String
 * @return {Result}
 */
_ValidatorType2["default"].prototype.getResult = _circleCoreTypes2["default"].func([_circleCoreTypes2["default"].String], _Result2["default"], "validator.getResult").of(function (match) {
  return _Result2["default"].create(_RegExpType2["default"].is(this.filter) ? (0, _lodash.first)(this.filter.exec(match)) : null);
});

/**
 * Creates a new Validator with given condition
 *
 * @param  {*}         condition for validation
 * @return {Validator}
 */
_ValidatorType2["default"].create = _circleCoreTypes2["default"].func([_ConditionType2["default"]], _ValidatorType2["default"], "Validator.create").of(function (condition) {
  var validator = { filter: condition };

  if (_RegExpType2["default"].is(condition)) return (0, _lodash.assign)(validator, { validate: function validate(value) {
      return condition.test(value);
    } });
  if (_circleCoreTypes2["default"].String.is(condition)) return (0, _lodash.assign)(validator, { validate: function validate(value) {
      return value.indexOf(condition) !== -1;
    } });

  return (0, _lodash.assign)(validator, { validate: condition });
});

exports["default"] = _ValidatorType2["default"];
module.exports = exports["default"];

//# sourceMappingURL=Validator.js.map