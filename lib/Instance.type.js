"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcomb = require("tcomb");

var _tcomb2 = _interopRequireDefault(_tcomb);

var _Result = require("./Result.type");

var _Result2 = _interopRequireDefault(_Result);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef Instance
 *
 * @param  {*}       x to be evaluated
 * @return {Boolean}
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

exports.default = _tcomb2.default.refinement(_tcomb2.default.Object, function (x) {
  return _tcomb2.default.Boolean.is(x.isRunning) && _tcomb2.default.Boolean.is(x.fulfilled) && _tcomb2.default.Boolean.is(x.isStreaming) && _tcomb2.default.Array.is(x.output) && (_Result2.default.is(x.lastMatch) || _tcomb2.default.Nil.is(x.lastMatch));
}, "Instance");

//# sourceMappingURL=Instance.type.js.map