"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _index = require("../index");

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _Result = require("../Result.type");

var _Result2 = _interopRequireDefault(_Result);

var _stream = require("stream");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var counterScript = _path2.default.join(__dirname, "/Scripts/CounterScript.js"); /*
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

var stdinLogger = _path2.default.join(__dirname, "/Scripts/StdinLogger.js");
var failScript = _path2.default.join(__dirname, "/Scripts/FailScript.js");

describe("CoreWorker", function () {
    it("executes an application and waits until it is ready", function () {
        var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(done) {
            var counter, result;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            this.timeout(5000);
                            counter = (0, _index.process)("node " + counterScript, "Log No. 10");
                            _context.prev = 2;
                            _context.next = 5;
                            return counter.ready(2000);

                        case 5:
                            result = _context.sent;


                            _assert2.default.deepStrictEqual(result, (0, _Result2.default)({ data: null }), "Result should contain null");
                            counter.kill();
                            done();
                            _context.next = 14;
                            break;

                        case 11:
                            _context.prev = 11;
                            _context.t0 = _context["catch"](2);

                            done(_context.t0);

                        case 14:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this, [[2, 11]]);
        }));
        return function (_x) {
            return ref.apply(this, arguments);
        };
    }());

    it("executes an application and waits until it is ready", function () {
        var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(done) {
            var counter, result;
            return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            counter = (0, _index.process)("node " + counterScript, /Log\ No\.\ 5/);
                            _context2.prev = 1;
                            _context2.next = 4;
                            return counter.ready(2000);

                        case 4:
                            result = _context2.sent;


                            _assert2.default.deepStrictEqual(result, (0, _Result2.default)({ data: "Log No. 5" }), "Result should contain 'Log No. 5'");

                            counter.kill();
                            done();
                            _context2.next = 13;
                            break;

                        case 10:
                            _context2.prev = 10;
                            _context2.t0 = _context2["catch"](1);

                            done(_context2.t0);

                        case 13:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this, [[1, 10]]);
        }));
        return function (_x2) {
            return ref.apply(this, arguments);
        };
    }());

    it("executes an application, waits until it is ready, but exceeds given timeout", function () {
        var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(done) {
            var counter, result;
            return _regenerator2.default.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            counter = (0, _index.process)("node " + counterScript, "Log No. 10");
                            _context3.prev = 1;
                            _context3.next = 4;
                            return counter.ready(10);

                        case 4:
                            result = _context3.sent;


                            _assert2.default.deepStrictEqual(result, (0, _Result2.default)({ data: null }), "Result should contain null");
                            done(new Error("This shouldn't finish."));
                            _context3.next = 14;
                            break;

                        case 9:
                            _context3.prev = 9;
                            _context3.t0 = _context3["catch"](1);

                            _assert2.default.equal(_context3.t0.message, "Timeout exceeded.", "Timeout Error should be thrown");

                            counter.kill();
                            done();

                        case 14:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this, [[1, 9]]);
        }));
        return function (_x3) {
            return ref.apply(this, arguments);
        };
    }());

    it("executes an application and waits its death", function () {
        var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(done) {
            var counter, result;
            return _regenerator2.default.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            counter = (0, _index.process)("node " + counterScript, /Log\ No\.\ 10/);
                            _context4.prev = 1;
                            _context4.next = 4;
                            return counter.death(1000);

                        case 4:
                            result = _context4.sent;


                            result.data.slice(0, -1).split("\n").forEach(function (row, iterator) {
                                (0, _assert2.default)(row === "Log No. " + (iterator + 1), "Wrong output: " + row + ", expected:\n Log No. " + (iterator + 1));
                            });
                            done();
                            _context4.next = 12;
                            break;

                        case 9:
                            _context4.prev = 9;
                            _context4.t0 = _context4["catch"](1);

                            done(_context4.t0);

                        case 12:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, this, [[1, 9]]);
        }));
        return function (_x4) {
            return ref.apply(this, arguments);
        };
    }());

    it("executes an application and waits its death with a spedified timeout", function () {
        var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(done) {
            var counter, result;
            return _regenerator2.default.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            counter = (0, _index.process)("node " + counterScript, /Log\ No\.\ 10/);
                            _context5.prev = 1;
                            _context5.next = 4;
                            return counter.death(500);

                        case 4:
                            result = _context5.sent;


                            result.data.slice(0, -1).split("\n").forEach(function (row, iterator) {
                                (0, _assert2.default)(row === "Log No. " + (iterator + 1), "Wrong output: " + row + ", expected:\n Log No. " + (iterator + 1));
                            });
                            done();
                            _context5.next = 12;
                            break;

                        case 9:
                            _context5.prev = 9;
                            _context5.t0 = _context5["catch"](1);

                            done(_context5.t0);

                        case 12:
                        case "end":
                            return _context5.stop();
                    }
                }
            }, _callee5, this, [[1, 9]]);
        }));
        return function (_x5) {
            return ref.apply(this, arguments);
        };
    }());

    it("executes an application, waits its death, but exceeds given timeout", function () {
        var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(done) {
            var counter;
            return _regenerator2.default.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            counter = (0, _index.process)("node " + counterScript, /Log\ No\.\ 10/);
                            _context6.prev = 1;
                            _context6.next = 4;
                            return counter.death(10);

                        case 4:
                            done(new Error("Shouldn't resolve here"));
                            _context6.next = 12;
                            break;

                        case 7:
                            _context6.prev = 7;
                            _context6.t0 = _context6["catch"](1);

                            _assert2.default.equal(_context6.t0.message, "Timeout exceeded.", "Timeout Error should be thrown");

                            counter.kill();
                            done();

                        case 12:
                        case "end":
                            return _context6.stop();
                    }
                }
            }, _callee6, this, [[1, 7]]);
        }));
        return function (_x6) {
            return ref.apply(this, arguments);
        };
    }());

    it("executes an application and handles it as a stream", function (done) {
        var inputLogger = (0, _index.process)("node " + stdinLogger, "");
        var writable = (0, _stream.Writable)();
        var stream = inputLogger.stream();

        writable.write = function (chunk) {
            _assert2.default.equal(chunk, "Hello\n");
            inputLogger.kill();
            done();
        };

        stream.pipe(writable);
        stream.write("Hello");
    });

    it("executes an application, but terminates unexpectedly", function () {
        var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(done) {
            var failProcess;
            return _regenerator2.default.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            failProcess = (0, _index.process)("node " + failScript);
                            _context7.prev = 1;
                            _context7.next = 4;
                            return failProcess.death(1000);

                        case 4:
                            done(new Error("Shouldn't resolve here"));
                            _context7.next = 11;
                            break;

                        case 7:
                            _context7.prev = 7;
                            _context7.t0 = _context7["catch"](1);

                            _assert2.default.equal(_context7.t0.message, "Process was closed unexpectedly. Code: 1", "Message should be closing code with 1");
                            done();

                        case 11:
                        case "end":
                            return _context7.stop();
                    }
                }
            }, _callee7, this, [[1, 7]]);
        }));
        return function (_x7) {
            return ref.apply(this, arguments);
        };
    }());
});

//# sourceMappingURL=CoreWorkerTest.js.map