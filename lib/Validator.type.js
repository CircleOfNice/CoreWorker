/* Copyright 2015 TeeAge-Beatz UG (haftungsbeschränkt)
 *
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
 */

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