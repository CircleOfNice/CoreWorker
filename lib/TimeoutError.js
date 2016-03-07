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

"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcomb = require("tcomb");

var _tcomb2 = _interopRequireDefault(_tcomb);

var _TimeoutErrorType = require("./TimeoutError.type");

var _TimeoutErrorType2 = _interopRequireDefault(_TimeoutErrorType);

/**
 * Creates a new TimeoutError
 *
 * @param  {String}         output   output line to be displayed in error message
 * @return {TimeoutError}
 */
_TimeoutErrorType2["default"].create = _tcomb2["default"].func([_tcomb2["default"].maybe(_tcomb2["default"].String)], _TimeoutErrorType2["default"], "TimeoutError.create").of(function (output) {
  return new Error(_tcomb2["default"].Nil.is(output) || !output ? "Timeout exceeded." : "Timeout exceeded. Last process output is: " + output);
});

exports["default"] = _TimeoutErrorType2["default"];
module.exports = exports["default"];

//# sourceMappingURL=TimeoutError.js.map