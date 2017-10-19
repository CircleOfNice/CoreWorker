"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcomb = require("tcomb");

var _tcomb2 = _interopRequireDefault(_tcomb);

var _ExitCode = require("./ExitCode.type");

var _ExitCode2 = _interopRequireDefault(_ExitCode);

var _ExitCodes = require("./ExitCodes.type");

var _ExitCodes2 = _interopRequireDefault(_ExitCodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef MaybeExitCodes
 */
exports.default = _tcomb2.default.maybe(_tcomb2.default.union([_ExitCode2.default, _ExitCodes2.default]), "MaybeExitCodes"); /*
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

//# sourceMappingURL=MaybeExitCodes.type.js.map