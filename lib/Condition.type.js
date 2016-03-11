"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcomb = require("tcomb");

var _tcomb2 = _interopRequireDefault(_tcomb);

var _RegExp = require("./RegExp.type");

var _RegExp2 = _interopRequireDefault(_RegExp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef Condition
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

var Condition = _tcomb2.default.union([_RegExp2.default, _tcomb2.default.String, _tcomb2.default.Function], "Condition");

Condition.dispatch = function (x) {
  if (_RegExp2.default.is(x)) return _RegExp2.default;
  if (_tcomb2.default.String.is(x)) return _tcomb2.default.String;
  if (_tcomb2.default.Function.is(x)) return _tcomb2.default.Function;

  throw new TypeError("Cannot dispatch Condition: " + x);
};

exports.default = Condition;

//# sourceMappingURL=Condition.type.js.map