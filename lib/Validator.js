"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcomb = require("tcomb");

var _tcomb2 = _interopRequireDefault(_tcomb);

var _Validator = require("./Validator.type");

var _Validator2 = _interopRequireDefault(_Validator);

var _RegExp = require("./RegExp.type");

var _RegExp2 = _interopRequireDefault(_RegExp);

var _Condition = require("./Condition.type");

var _Condition2 = _interopRequireDefault(_Condition);

var _lodash = require("lodash");

var _Result = require("./Result");

var _Result2 = _interopRequireDefault(_Result);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns matched String
 *
 * @param  {String} data containing matched String
 * @return {Result}
 */
/*
 * This file is part of CoreWorker.
 *
 * CoreWorker is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * CoreWorker is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with CoreWorker.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Copyright 2015 TeeAge-Beatz UG (haftungsbeschränkt)
 */

_Validator2.default.prototype.getResult = _tcomb2.default.func([_tcomb2.default.String], _Result2.default, "validator.getResult").of(function (match) {
  return _Result2.default.create(_RegExp2.default.is(this.filter) ? (0, _lodash.first)(this.filter.exec(match)) : null);
});

/**
 * Creates a new Validator with given condition
 *
 * @param  {*}         condition for validation
 * @return {Validator}
 */
_Validator2.default.create = _tcomb2.default.func([_Condition2.default], _Validator2.default, "Validator.create").of(function (condition) {
  var validator = { filter: condition };

  if (_RegExp2.default.is(condition)) return (0, _lodash.assign)(validator, { validate: function validate(value) {
      return condition.test(value);
    } });
  if (_tcomb2.default.String.is(condition)) return (0, _lodash.assign)(validator, { validate: function validate(value) {
      return value.indexOf(condition) !== -1;
    } });

  return (0, _lodash.assign)(validator, { validate: condition });
});

exports.default = _Validator2.default;

//# sourceMappingURL=Validator.js.map