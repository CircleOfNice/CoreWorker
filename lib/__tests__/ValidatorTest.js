"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

var _Validator = require("../Validator");

var _Validator2 = _interopRequireDefault(_Validator);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _ResultType = require("../Result.type");

var _ResultType2 = _interopRequireDefault(_ResultType);

describe("Validator", function () {
    it("creates a new Validator out of a String", function () {
        var filter = _Validator2["default"].create("match me");
        var data = "Check If This match me";

        (0, _assert2["default"])(filter.validate("Check If This match me"), "Should match String");
        _assert2["default"].deepStrictEqual(filter.getResult(data), (0, _ResultType2["default"])({ data: null }), "Should be equal to input");
        (0, _assert2["default"])(!filter.validate("This shouldnt match."), "Shouldn't match String");
    });

    it("creates a new Validator out of a RegExp", function () {
        var filter = _Validator2["default"].create(/(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/);

        (0, _assert2["default"])(filter.validate("New URL: http://www.google.de"), "Should return true");
        _assert2["default"].deepStrictEqual(filter.getResult("New URL: http://www.google.de"), (0, _ResultType2["default"])({ data: "http://www.google.de" }), "Should match Url");
        (0, _assert2["default"])(!filter.validate("Numbers like 1,2,3 are not allowed."), "Shouldn't match String");
    });

    it("creates a new Validator out of a Function", function () {
        var search = function search(value) {
            return value === "search";
        };
        var filter = _Validator2["default"].create(search);

        (0, _assert2["default"])(filter.validate("search"), "Should match given String");
        _assert2["default"].deepStrictEqual(filter.getResult("search me or not"), (0, _ResultType2["default"])({ data: null }), "Should return input");
        (0, _assert2["default"])(!filter.validate("Numbers like 1,2,3 are not allowed."), "Shouldn't match String");
    });

    it("throws an Error, if wrong condition is given", function () {
        _assert2["default"].throws(_Validator2["default"].create.bind(null, {}), TypeError);
        _assert2["default"].throws(_Validator2["default"].create.bind(null, []), TypeError);
    });
});

//# sourceMappingURL=ValidatorTest.js.map