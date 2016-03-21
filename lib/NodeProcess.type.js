"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcomb = require("tcomb");

var _tcomb2 = _interopRequireDefault(_tcomb);

var _Validator = require("./Validator.type");

var _Validator2 = _interopRequireDefault(_Validator);

var _Instance = require("./Instance.type");

var _Instance2 = _interopRequireDefault(_Instance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef NodeProcess
 */
exports.default = _tcomb2.default.struct({
  emitter: _tcomb2.default.Object,
  instance: _Instance2.default,
  filter: _Validator2.default,
  command: _tcomb2.default.String,
  commandArgs: _tcomb2.default.list(_tcomb2.default.String)
}, "NodeProcess"); /*
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

//# sourceMappingURL=NodeProcess.type.js.map