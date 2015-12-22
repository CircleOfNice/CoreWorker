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

var _NodeProcessType = require("./NodeProcess.type");

var _NodeProcessType2 = _interopRequireDefault(_NodeProcessType);

/**
 * @typedef DuplexStream
 */
exports["default"] = _tcomb2["default"].refinement(_tcomb2["default"].Object, function (x) {
  return _NodeProcessType2["default"].is(x.instance);
}, "DuplexStream");
module.exports = exports["default"];

//# sourceMappingURL=DuplexStream.type.js.map