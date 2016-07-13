"use strict";

var _ExitCodes = require("../ExitCodes");

var _ExitCodes2 = _interopRequireDefault(_ExitCodes);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

describe("ExitCodes", function () {
    it("gets undefined and creates Exit Codes", function () {
        var exitCodes = _ExitCodes2.default.create(undefined); //eslint-disable-line

        _assert2.default.deepEqual(exitCodes, [0]);
    });

    it("gets null and creates Exit Codes", function () {
        var exitCodes = _ExitCodes2.default.create(null); //eslint-disable-line

        _assert2.default.deepEqual(exitCodes, [0]);
    });

    it("gets single value and creates Exit Codes", function () {
        var exitCodes = _ExitCodes2.default.create(100);

        _assert2.default.deepEqual(exitCodes, [100]);
    });

    it("gets list and creates Exit Codes", function () {
        var exitCodes = _ExitCodes2.default.create([100, 101]);

        _assert2.default.deepEqual(exitCodes, [100, 101]);
    });
});

//# sourceMappingURL=ExitCodesTest.js.map