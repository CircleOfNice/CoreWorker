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

var _ResultType = require("./Result.type");

var _ResultType2 = _interopRequireDefault(_ResultType);

/**
 * Creates a new Result
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