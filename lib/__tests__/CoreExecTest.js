"use strict";

var _regeneratorRuntime = require("babel-runtime/regenerator")["default"];

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

var _Process = require("../Process");

var _Process2 = _interopRequireDefault(_Process);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _ResultType = require("../Result.type");

var _ResultType2 = _interopRequireDefault(_ResultType);

var _stream = require("stream");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var counterScript = _path2["default"].join(__dirname, "/Scripts/CounterScript.js");
var stdinLogger = _path2["default"].join(__dirname, "/Scripts/StdinLogger.js");

describe("CoreExec", function () {
    it("executes an application and wait until it is ready", function callee$1$0(done) {
        var process, result;
        return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    process = _Process2["default"].create("node " + counterScript, "Log No. 10");
                    context$2$0.prev = 1;
                    context$2$0.next = 4;
                    return _regeneratorRuntime.awrap(process.ready(500));

                case 4:
                    result = context$2$0.sent;

                    _assert2["default"].deepStrictEqual(result, (0, _ResultType2["default"])({ data: null }), "Result should contain null");
                    process.kill();
                    done();
                    context$2$0.next = 13;
                    break;

                case 10:
                    context$2$0.prev = 10;
                    context$2$0.t0 = context$2$0["catch"](1);

                    done(context$2$0.t0);

                case 13:
                case "end":
                    return context$2$0.stop();
            }
        }, null, this, [[1, 10]]);
    });

    it("executes an application and wait until it is ready", function callee$1$0(done) {
        var process, result;
        return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    process = _Process2["default"].create("node " + counterScript, /Log\ No\.\ 5/);
                    context$2$0.prev = 1;
                    context$2$0.next = 4;
                    return _regeneratorRuntime.awrap(process.ready(500));

                case 4:
                    result = context$2$0.sent;

                    _assert2["default"].deepStrictEqual(result, (0, _ResultType2["default"])({ data: "Log No. 5" }), "Result should contain 'Log No. 5'");

                    // process.kill();
                    done();
                    context$2$0.next = 12;
                    break;

                case 9:
                    context$2$0.prev = 9;
                    context$2$0.t0 = context$2$0["catch"](1);

                    done(context$2$0.t0);

                case 12:
                case "end":
                    return context$2$0.stop();
            }
        }, null, this, [[1, 9]]);
    });

    it("executes an application and wait until it is ready exceeding timeout", function callee$1$0(done) {
        var process, result;
        return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    process = _Process2["default"].create("node " + counterScript, "Log No. 10");
                    context$2$0.prev = 1;
                    context$2$0.next = 4;
                    return _regeneratorRuntime.awrap(process.ready(10));

                case 4:
                    result = context$2$0.sent;

                    _assert2["default"].deepStrictEqual(result, (0, _ResultType2["default"])({ data: null }), "Result should contain null");
                    done(new Error("This shouldn't finish."));
                    context$2$0.next = 14;
                    break;

                case 9:
                    context$2$0.prev = 9;
                    context$2$0.t0 = context$2$0["catch"](1);

                    _assert2["default"].equal(context$2$0.t0.message, "Timeout exceeded.", "Timeout Error should be thrown");

                    process.kill();
                    done();

                case 14:
                case "end":
                    return context$2$0.stop();
            }
        }, null, this, [[1, 9]]);
    });

    it("executes an application and wait until death", function callee$1$0(done) {
        var process, result;
        return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    process = _Process2["default"].create("node " + counterScript, /Log\ No\.\ 10/);
                    context$2$0.prev = 1;
                    context$2$0.next = 4;
                    return _regeneratorRuntime.awrap(process.death());

                case 4:
                    result = context$2$0.sent;

                    result.data.slice(0, -1).split("\n").forEach(function (row, iterator) {
                        (0, _assert2["default"])(row === "Log No. " + (iterator + 1), "Wrong output: " + row + ", expected:\n Log No. " + (iterator + 1));
                    });
                    done();
                    context$2$0.next = 12;
                    break;

                case 9:
                    context$2$0.prev = 9;
                    context$2$0.t0 = context$2$0["catch"](1);

                    done(context$2$0.t0);

                case 12:
                case "end":
                    return context$2$0.stop();
            }
        }, null, this, [[1, 9]]);
    });

    it("executes an application and wait until death with timeout", function callee$1$0(done) {
        var process, result;
        return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    process = _Process2["default"].create("node " + counterScript, /Log\ No\.\ 10/);
                    context$2$0.prev = 1;
                    context$2$0.next = 4;
                    return _regeneratorRuntime.awrap(process.death(500));

                case 4:
                    result = context$2$0.sent;

                    result.data.slice(0, -1).split("\n").forEach(function (row, iterator) {
                        (0, _assert2["default"])(row === "Log No. " + (iterator + 1), "Wrong output: " + row + ", expected:\n Log No. " + (iterator + 1));
                    });
                    done();
                    context$2$0.next = 12;
                    break;

                case 9:
                    context$2$0.prev = 9;
                    context$2$0.t0 = context$2$0["catch"](1);

                    done(context$2$0.t0);

                case 12:
                case "end":
                    return context$2$0.stop();
            }
        }, null, this, [[1, 9]]);
    });

    it("executes an application and wait until death exceeding timeout", function callee$1$0(done) {
        var process;
        return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    process = _Process2["default"].create("node " + counterScript, /Log\ No\.\ 10/);
                    context$2$0.prev = 1;
                    context$2$0.next = 4;
                    return _regeneratorRuntime.awrap(process.death(10));

                case 4:
                    done(new Error("Shouldn't resolve here"));
                    context$2$0.next = 12;
                    break;

                case 7:
                    context$2$0.prev = 7;
                    context$2$0.t0 = context$2$0["catch"](1);

                    _assert2["default"].equal(context$2$0.t0.message, "Timeout exceeded.", "Timeout Error should be thrown");

                    process.kill();
                    done();

                case 12:
                case "end":
                    return context$2$0.stop();
            }
        }, null, this, [[1, 7]]);
    });

    it("executes an application and handles it as a stream", function (done) {
        var process = _Process2["default"].create("node " + stdinLogger, "");
        var writable = (0, _stream.Writable)();
        var stream = process.stream();

        writable.write = function (chunk) {
            _assert2["default"].equal(chunk, "Hello\n");
            process.kill();
            done();
        };

        stream.pipe(writable);
        stream.write("Hello");
    });
});

/*eslint-disable*/

/*eslint-enable*/

/*eslint-disable*/

/*eslint-enable*/

/*eslint-disable*/

/*eslint-enable*/

/*eslint-disable*/

/*eslint-enable*/

/*eslint-disable*/

/*eslint-enable*/

/*eslint-disable*/

/*eslint-enable*/

//# sourceMappingURL=CoreExecTest.js.map