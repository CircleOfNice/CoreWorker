"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _index = require("../index");

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _tcomb = require("tcomb");

var _tcomb2 = _interopRequireDefault(_tcomb);

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
                                                                                  * Copyright 2016 TeeAge-Beatz UG (haftungsbeschränkt)
                                                                                  */

var stdinLogger = _path2.default.join(__dirname, "/Scripts/StdinLogger.js");
var failScript = _path2.default.join(__dirname, "/Scripts/FailScript.js");
var exitCodeScript = _path2.default.join(__dirname, "/Scripts/ExitCodeScript.js");
var killScript = _path2.default.join(__dirname, "/Scripts/KillScript.js");

describe("CoreWorker", function () {
    //eslint-disable-line
    it("executes an application and waits until it is ready", (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var counter, result;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        this.timeout(5000);
                        counter = (0, _index.process)("node " + counterScript, "Log No. 10");
                        _context.next = 4;
                        return counter.ready(2000);

                    case 4:
                        result = _context.sent;


                        _assert2.default.deepStrictEqual(result.output.join(""), "Log No. 1\n" + "Log No. 2\n" + "Log No. 3\n" + "Log No. 4\n" + "Log No. 5\n" + "Log No. 6\n" + "Log No. 7\n" + "Log No. 8\n" + "Log No. 9\n" + "Log No. 10\n");

                        _assert2.default.equal(result.isRunning, true, "Expected process to be running");
                        (0, _assert2.default)(_tcomb2.default.Number.is(result.pid) && result.pid > 0, "Should have a pid");

                        _context.t0 = _assert2.default;
                        _context.next = 11;
                        return counter.kill();

                    case 11:
                        _context.t1 = "Log No. 1\n" + "Log No. 2\n" + "Log No. 3\n" + "Log No. 4\n" + "Log No. 5\n" + "Log No. 6\n" + "Log No. 7\n" + "Log No. 8\n" + "Log No. 9\n" + "Log No. 10\n" + "Log No. 11\n";
                        _context.t2 = _context.sent.data.indexOf(_context.t1);

                        _context.t0.equal.call(_context.t0, _context.t2, 0);

                    case 14:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    })));

    it("executes an application and waits until it is ready", (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var counter, result;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        counter = (0, _index.process)("node " + counterScript, /Log\ No\.\ 5/);
                        _context2.next = 3;
                        return counter.ready(2000);

                    case 3:
                        result = _context2.sent;
                        // eslint-disable-line

                        _assert2.default.deepStrictEqual(result.output, ["Log No. 1\n", "Log No. 2\n", "Log No. 3\n", "Log No. 4\n", "Log No. 5\n"]);

                        _assert2.default.equal(result.isRunning, true, "Expected process to be running");
                        (0, _assert2.default)(_tcomb2.default.Number.is(result.pid) && result.pid > 0, "Should have a pid");

                        _context2.next = 9;
                        return counter.kill();

                    case 9:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    })));

    it("executes an application, waits until it is ready, but exceeds given timeout", function (done) {
        var counter = (0, _index.process)("node " + counterScript, "Log No. 10");

        counter.ready(10).then(function () {
            return done(new Error("should timeout"));
        }).catch(function (err) {
            try {
                _assert2.default.equal(err.message, "Timeout exceeded.", "Timeout Error should be thrown");

                counter.kill().then(function () {
                    return done();
                }) // eslint-disable-line
                .catch(done);
            } catch (e) {
                done(e);
            }
        });
    });

    it("executes an application and waits its death", (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
        var counter, result;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        counter = (0, _index.process)("node " + counterScript, /Log\ No\.\ 10/);
                        _context3.next = 3;
                        return counter.death();

                    case 3:
                        result = _context3.sent;


                        result.data.slice(0, -1).split("\n").forEach(function (row, iterator) {
                            (0, _assert2.default)(row === "Log No. " + (iterator + 1), "Wrong output: " + row + ", expected:\n Log No. " + (iterator + 1));
                        });

                    case 5:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    })));

    it("executes an application and waits its death with a spedified timeout", (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
        var counter, result;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        counter = (0, _index.process)("node " + counterScript, /Log\ No\.\ 10/);
                        _context4.next = 3;
                        return counter.death(500);

                    case 3:
                        result = _context4.sent;


                        result.data.slice(0, -1).split("\n").forEach(function (row, iterator) {
                            (0, _assert2.default)(row === "Log No. " + (iterator + 1), "Wrong output: " + row + ", expected:\n Log No. " + (iterator + 1));
                        });

                    case 5:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    })));

    it("executes an application, waits its death, but exceeds given timeout", function (done) {
        var counter = (0, _index.process)("node " + counterScript, /Log\ No\.\ 10/);

        counter.death(10).then(function () {
            return done(new Error("Shouldn't resolve here"));
        }).catch(function (err) {
            try {
                _assert2.default.equal(err.message, "Timeout exceeded.", "Timeout Error should be thrown");

                counter.kill().then(function () {
                    return done();
                }); // eslint-disable-line
            } catch (e) {
                done(e);
            }
        });
    });

    it("executes an application and handles it as a stream", function (done) {
        var inputLogger = (0, _index.process)("node " + stdinLogger, "");
        var writable = (0, _stream.Writable)();
        var stream = inputLogger.stream();

        writable.write = function (chunk) {
            _assert2.default.equal(chunk, "Hello\n");
            inputLogger.kill().then(function () {
                return done();
            }).catch(done);
        };

        stream.pipe(writable);
        stream.write("Hello");
    });

    it("executes an application, but terminates unexpectedly", function (done) {
        var failProcess = (0, _index.process)("node " + failScript);

        failProcess.death(1000).then(function () {
            return done(new Error("Shouldn't resolve here"));
        }).catch(function (err) {
            try {
                _assert2.default.equal(err.message, "Process was closed unexpectedly. Code: 1", "Message should be closing code with 1");
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it("executes an application, awaits its death and terminates with valid exit code", (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
        var validExitCodeProcess, result;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        validExitCodeProcess = (0, _index.process)("node " + exitCodeScript);
                        _context5.next = 3;
                        return validExitCodeProcess.death(1000, 128);

                    case 3:
                        result = _context5.sent;


                        _assert2.default.equal(result.data, "Process exited with code 100");

                    case 5:
                    case "end":
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    })));

    it("executes an application and kills it", function (done) {
        var liveProcess = (0, _index.process)("node " + killScript, /Kill me/);

        liveProcess.ready(1000).then(function () {
            return liveProcess.death();
        }).then(function () {
            return done(new Error("shouldn trigger"));
        }).catch(function (err) {
            try {
                _assert2.default.equal(err.message, "Process was closed unexpectedly. Code: 137");
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it("executes an application, kills it and terminates with valid exit code", (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
        var liveProcess, result;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        liveProcess = (0, _index.process)("node " + killScript, /Kill me/);
                        _context6.next = 3;
                        return liveProcess.ready(1000);

                    case 3:
                        _context6.next = 5;
                        return liveProcess.kill([137]);

                    case 5:
                        result = _context6.sent;


                        _assert2.default.equal(result.data, "Kill me");

                    case 7:
                    case "end":
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    })));
});

//# sourceMappingURL=CoreWorkerTest.js.map