"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcomb = require("tcomb");

var _tcomb2 = _interopRequireDefault(_tcomb);

var _NodeProcess = require("./NodeProcess.type");

var _NodeProcess2 = _interopRequireDefault(_NodeProcess);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef DuplexStream
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
 * Copyright 2016 TeeAge-Beatz UG (haftungsbeschränkt)
 */

exports.default = _tcomb2.default.refinement(_tcomb2.default.Object, function (x) {
  return _NodeProcess2.default.is(x.instance);
}, "DuplexStream");

//# sourceMappingURL=DuplexStream.type.js.map