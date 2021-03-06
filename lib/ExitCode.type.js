"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcomb = require("tcomb");

var _tcomb2 = _interopRequireDefault(_tcomb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef ExitCode
 */
exports.default = _tcomb2.default.refinement(_tcomb2.default.Number, function (x) {
  return x >= 0 && x < 256;
}, "ExitCode"); /*
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

//# sourceMappingURL=ExitCode.type.js.map