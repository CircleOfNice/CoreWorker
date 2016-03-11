"use strict";

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _lodash = require("lodash");

var _events = require("events");

var _tcomb = require("tcomb");

var _tcomb2 = _interopRequireDefault(_tcomb);

var _NodeProcess = require("../NodeProcess");

var _NodeProcess2 = _interopRequireDefault(_NodeProcess);

var _Result = require("../Result");

var _Result2 = _interopRequireDefault(_Result);

var _child_process = require("child_process");

var _child_process2 = _interopRequireDefault(_child_process);

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
 * Copyright 2015 TeeAge-Beatz UG (haftungsbeschränkt)
 */

/* eslint max-statements: [2, 12] */


var commandSpy = _sinon2.default.spy();
var callbacks = {};
var setCallbacks = function setCallbacks(name, cb) {
    return (0, _lodash.set)(callbacks, name, cb);
};

var spawn = function spawn(command, commandArgs) {
    commandSpy(command, commandArgs);

    return {
        stdout: {
            on: function on(name, cb) {
                return setCallbacks("stdout", cb);
            }
        },
        stderr: {
            on: function on(name, cb) {
                return setCallbacks("stderr", cb);
            }
        },
        on: setCallbacks,
        kill: function kill() {
            return callbacks.close(0);
        }
    };
};

describe("NodeProcess", function () {
    before(function () {
        _sinon2.default.stub(_child_process2.default, "spawn", spawn);
    });

    after(function () {
        _child_process2.default.spawn.restore();
    });

    it("creates a new nodeProcess", function () {
        var nodeProcess = _NodeProcess2.default.create("node Test.js", "Started Successfully.");

        _assert2.default.deepStrictEqual((0, _lodash.keys)(nodeProcess.instance), ["isRunning", "isStreaming", "output", "lastMatch", "fulfilled"], "No Instance of child_process should be set");
        (0, _assert2.default)(!nodeProcess.instance.isRunning, "Process shouldn't run after create");
        _assert2.default.equal(nodeProcess.command, "node", "Command should be stored in Process");
        _assert2.default.equal(nodeProcess.commandArgs, "Test.js", "CommandArgs should be stored in Process");
        (0, _assert2.default)(nodeProcess.filter.validate("Started Successfully."), "Filter should be set on given String");
        (0, _assert2.default)(nodeProcess.emitter instanceof _events.EventEmitter, "emitter should be an instance of EventEmitter");
    });

    it("starts a nodeProcess and waits until it is ready(stdout)", function () {
        var nodeProcess = _NodeProcess2.default.create("node Test.js", "Started Successfully.");
        var matchSpy = _sinon2.default.spy();

        nodeProcess.onReady(function (match) {
            return matchSpy(match);
        });
        nodeProcess.run();

        (0, _assert2.default)(commandSpy.calledWith("node", ["Test.js"]), "commandSpy was called with wrong args: \n " + commandSpy.lastCall.args);
        _assert2.default.deepStrictEqual((0, _lodash.keys)(callbacks), ["stdout", "stderr", "close"], "Callbacks should be set after process.run");

        callbacks.stdout("Started Successfully.");
        (0, _assert2.default)(matchSpy.calledOnce, "matchSpy wasn't called once");
    });

    it("starts a nodeProcess and waits until it is ready(stderr)", function () {
        callbacks.stderr = null;
        var nodeProcess = _NodeProcess2.default.create("node Test.js", "Huge Mistake");
        var matchSpy = _sinon2.default.spy();

        nodeProcess.onReady(function (match) {
            return matchSpy(match);
        });
        nodeProcess.run();

        (0, _assert2.default)(_tcomb2.default.Function.is(callbacks.stderr), "Stderr should be set again");

        callbacks.stderr("Huge Mistake");

        (0, _assert2.default)(matchSpy.calledOnce, "matchSpy wasn't called once");
    });

    it("starts a nodeProcess and waits until it is closed", function () {
        callbacks.close = null;
        var nodeProcess = _NodeProcess2.default.create("node Test.js", "Not necessary");
        var mockPromise = {
            resolve: _sinon2.default.spy(),
            reject: _sinon2.default.spy()
        };

        nodeProcess.onDeath(mockPromise);
        nodeProcess.run();

        (0, _assert2.default)(_tcomb2.default.Function.is(callbacks.close), "Close shoud be set again");
        callbacks.stdout("Yes");

        callbacks.close(0);
        (0, _assert2.default)(mockPromise.resolve.calledWith((0, _Result2.default)({ data: "Yes" })), "closeSpy was called with wrong args: \n " + mockPromise.resolve.args);

        callbacks.close(1);
        (0, _assert2.default)(mockPromise.reject.calledWith(new Error("Bla")), "closeSpy was called with wrong args: \n " + mockPromise.reject.args);
    });
});

//# sourceMappingURL=NodeProcessTest.js.map