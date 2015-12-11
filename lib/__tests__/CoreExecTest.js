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

"use strict";

var _regeneratorRuntime = require("babel-runtime/regenerator")["default"];

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

var _index = require("../index");

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _ResultType = require("../Result.type");

var _ResultType2 = _interopRequireDefault(_ResultType);

var _stream = require("stream");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var counterScript = _path2["default"].join(__dirname, "/Scripts/CounterScript.js");
var stdinLogger = _path2["default"].join(__dirname, "/Scripts/StdinLogger.js");
var failScript = _path2["default"].join(__dirname, "/Scripts/FailScript.js");

describe("CoreExec", function () {
    it("executes an application and waits until it is ready", function callee$1$0(done) {
        var counter, result;
        return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    counter = (0, _index.process)("node " + counterScript, "Log No. 10");
                    context$2$0.prev = 1;
                    context$2$0.next = 4;
                    return _regeneratorRuntime.awrap(counter.ready(500));

                case 4:
                    result = context$2$0.sent;

                    _assert2["default"].deepStrictEqual(result, (0, _ResultType2["default"])({ data: null }), "Result should contain null");
                    counter.kill();
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

    it("executes an application and waits until it is ready", function callee$1$0(done) {
        var counter, result;
        return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    counter = (0, _index.process)("node " + counterScript, /Log\ No\.\ 5/);
                    context$2$0.prev = 1;
                    context$2$0.next = 4;
                    return _regeneratorRuntime.awrap(counter.ready(500));

                case 4:
                    result = context$2$0.sent;

                    _assert2["default"].deepStrictEqual(result, (0, _ResultType2["default"])({ data: "Log No. 5" }), "Result should contain 'Log No. 5'");

                    counter.kill();
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

    it("executes an application, waits until it is ready, but exceeds given timeout", function callee$1$0(done) {
        var counter, result;
        return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    counter = (0, _index.process)("node " + counterScript, "Log No. 10");
                    context$2$0.prev = 1;
                    context$2$0.next = 4;
                    return _regeneratorRuntime.awrap(counter.ready(10));

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

                    counter.kill();
                    done();

                case 14:
                case "end":
                    return context$2$0.stop();
            }
        }, null, this, [[1, 9]]);
    });

    it("executes an application and waits its death", function callee$1$0(done) {
        var counter, result;
        return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    counter = (0, _index.process)("node " + counterScript, /Log\ No\.\ 10/);
                    context$2$0.prev = 1;
                    context$2$0.next = 4;
                    return _regeneratorRuntime.awrap(counter.death());

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

    it("executes an application and waits its death with a spedified timeout", function callee$1$0(done) {
        var counter, result;
        return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    counter = (0, _index.process)("node " + counterScript, /Log\ No\.\ 10/);
                    context$2$0.prev = 1;
                    context$2$0.next = 4;
                    return _regeneratorRuntime.awrap(counter.death(500));

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

    it("executes an application, waits its death, but exceeds given timeout", function callee$1$0(done) {
        var counter;
        return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    counter = (0, _index.process)("node " + counterScript, /Log\ No\.\ 10/);
                    context$2$0.prev = 1;
                    context$2$0.next = 4;
                    return _regeneratorRuntime.awrap(counter.death(10));

                case 4:
                    done(new Error("Shouldn't resolve here"));
                    context$2$0.next = 12;
                    break;

                case 7:
                    context$2$0.prev = 7;
                    context$2$0.t0 = context$2$0["catch"](1);

                    _assert2["default"].equal(context$2$0.t0.message, "Timeout exceeded.", "Timeout Error should be thrown");

                    counter.kill();
                    done();

                case 12:
                case "end":
                    return context$2$0.stop();
            }
        }, null, this, [[1, 7]]);
    });

    it("executes an application and handles it as a stream", function (done) {
        var inputLogger = (0, _index.process)("node " + stdinLogger, "");
        var writable = (0, _stream.Writable)();
        var stream = inputLogger.stream();

        writable.write = function (chunk) {
            _assert2["default"].equal(chunk, "Hello\n");
            inputLogger.kill();
            done();
        };

        stream.pipe(writable);
        stream.write("Hello");
    });

    it("executes an application, but terminates unexpectedly", function callee$1$0(done) {
        var failProcess;
        return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    failProcess = (0, _index.process)("node " + failScript);
                    context$2$0.prev = 1;
                    context$2$0.next = 4;
                    return _regeneratorRuntime.awrap(failProcess.death(100));

                case 4:
                    done(new Error("Shouldn't resolve here"));
                    context$2$0.next = 11;
                    break;

                case 7:
                    context$2$0.prev = 7;
                    context$2$0.t0 = context$2$0["catch"](1);

                    _assert2["default"].equal(context$2$0.t0.message, "Process was closed unexpectedly. Code: 1", "Message should be closing code with 1");
                    done();

                case 11:
                case "end":
                    return context$2$0.stop();
            }
        }, null, this, [[1, 7]]);
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

/*eslint-disable*/

/*eslint-enable*/

//# sourceMappingURL=CoreExecTest.js.map