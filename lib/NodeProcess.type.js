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

var _ValidatorType = require("./Validator.type");

var _ValidatorType2 = _interopRequireDefault(_ValidatorType);

var _InstanceType = require("./Instance.type");

var _InstanceType2 = _interopRequireDefault(_InstanceType);

/**
 * @typedef NodeProcess
 */
exports["default"] = _circleCoreTypes2["default"].struct({
  emitter: _circleCoreTypes2["default"].Object,
  instance: _InstanceType2["default"],
  filter: _ValidatorType2["default"],
  command: _circleCoreTypes2["default"].String,
  commandArgs: _circleCoreTypes2["default"].list(_circleCoreTypes2["default"].String)
}, "NodeProcess");
module.exports = exports["default"];

//# sourceMappingURL=NodeProcess.type.js.map