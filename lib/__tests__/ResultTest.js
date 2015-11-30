"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

var _Result = require("../Result");

var _Result2 = _interopRequireDefault(_Result);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

describe("Result", function () {
    it("creates a new Result", function () {
        var result1 = _Result2["default"].create(null);
        var result2 = _Result2["default"].create("test");

        _assert2["default"].deepStrictEqual(result1, (0, _Result2["default"])({ data: null }), "Result should handle null-input");
        _assert2["default"].deepStrictEqual(result2, (0, _Result2["default"])({ data: "test" }), "Result should handle string-input");
        _assert2["default"].throws(_Result2["default"].create.bind(null, ["test"]), TypeError, "Result should only handle string || null");
    });
});

//# sourceMappingURL=ResultTest.js.map