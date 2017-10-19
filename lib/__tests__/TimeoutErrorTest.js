"use strict";

var _TimeoutError = require("../TimeoutError");

var _TimeoutError2 = _interopRequireDefault(_TimeoutError);

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

describe("TimeoutError", function () {
    it("creates a new TimeoutError without a null argument", function (done) {
        /* eslint-disable */
        try {
            /* eslint-ensable */
            throw _TimeoutError2.default.create(null);
        } catch (err) {
            _assert2.default.equal("Timeout exceeded.", err.message);
            done();
        }
    });

    it("creates a new TimeoutError with a non null argument", function (done) {
        /* eslint-disable */
        try {
            /* eslint-enable */
            throw _TimeoutError2.default.create("Foobar");
        } catch (err) {
            _assert2.default.equal("Timeout exceeded. Last process output is: Foobar", err.message);
            done();
        }
    });

    it("creates a new TimeoutError with a non null but empty argument", function (done) {
        /* eslint-disable */
        try {
            /* eslint-enable */
            throw _TimeoutError2.default.create("");
        } catch (err) {
            _assert2.default.equal("Timeout exceeded.", err.message);
            done();
        }
    });
});

//# sourceMappingURL=TimeoutErrorTest.js.map