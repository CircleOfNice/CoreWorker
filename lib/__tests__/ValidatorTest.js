"use strict";

var _Validator = require("../Validator");

var _Validator2 = _interopRequireDefault(_Validator);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _Result = require("../Result.type");

var _Result2 = _interopRequireDefault(_Result);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("Validator", function () {
    it("creates a new Validator out of a String", function () {
        var filter = _Validator2.default.create("match me");
        var data = "Check If This match me";

        (0, _assert2.default)(filter.validate("Check If This match me"), "Should match String");
        _assert2.default.deepStrictEqual(filter.getResult(data), (0, _Result2.default)({ data: null }), "Should be equal to input");
        (0, _assert2.default)(!filter.validate("This shouldnt match."), "Shouldn't match String");
    });

    it("creates a new Validator out of a RegExp", function () {
        var filter = _Validator2.default.create(/(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/);

        (0, _assert2.default)(filter.validate("New URL: http://www.google.de"), "Should return true");
        _assert2.default.deepStrictEqual(filter.getResult("New URL: http://www.google.de"), (0, _Result2.default)({ data: "http://www.google.de" }), "Should match Url");
        (0, _assert2.default)(!filter.validate("Numbers like 1,2,3 are not allowed."), "Shouldn't match String");
    });

    it("creates a new Validator out of a Function", function () {
        var search = function search(value) {
            return value === "search";
        };
        var filter = _Validator2.default.create(search);

        (0, _assert2.default)(filter.validate("search"), "Should match given String");
        _assert2.default.deepStrictEqual(filter.getResult("search me or not"), (0, _Result2.default)({ data: null }), "Should return input");
        (0, _assert2.default)(!filter.validate("Numbers like 1,2,3 are not allowed."), "Shouldn't match String");
    });

    it("throws an Error, if wrong condition is given", function () {
        _assert2.default.throws(_Validator2.default.create.bind(null, {}), TypeError);
        _assert2.default.throws(_Validator2.default.create.bind(null, []), TypeError);
    });
}); /*
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

//# sourceMappingURL=ValidatorTest.js.map