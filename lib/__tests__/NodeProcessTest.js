"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _lodash = require("lodash");

var _events = require("events");

var _circleCoreTypes = require("@circle/core-types");

var _circleCoreTypes2 = _interopRequireDefault(_circleCoreTypes);

var _NodeProcess = require("../NodeProcess");

var _NodeProcess2 = _interopRequireDefault(_NodeProcess);

var commandSpy = _sinon2["default"].spy();
var callbacks = {};
var setCallbacks = function setCallbacks(name, cb) {
    return (0, _lodash.set)(callbacks, name, cb);
};

var exec = function exec(command) {
    commandSpy(command);

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

var run = _circleCoreTypes2["default"].func([], _circleCoreTypes2["default"].Nil, "NodeProcess.run").of(function () {
    var _this = this;

    if (this.isRunning()) return;

    var process = exec(this.command);

    this.emitter.on("data", function (data) {
        return _this.store(data);
    });
    this.emitter.on("data", function (data) {
        return _this.validate(data);
    });
    process.stdout.on("data", function (data) {
        return _this.emitter.emit("data", data);
    });
    process.stderr.on("data", function (data) {
        return _this.emitter.emit("data", "<error> " + data);
    });
    process.on("close", function () {
        return _this.emitter.emit("death", _this.instance.output) && (0, _lodash.assign)(_this.instance, { isRunning: false });
    });

    (0, _lodash.assign)(this.instance, process, {
        isRunning: true,
        kill: process.kill
    });
});

describe("NodeProcess", function () {
    before(function () {
        _sinon2["default"].stub(_NodeProcess2["default"].prototype, "run", run);
    });

    after(function () {
        _NodeProcess2["default"].prototype.run.restore();
    });

    it("creates a new NodeProcess", function () {
        var nodeProcess = _NodeProcess2["default"].create("node Test.js", "Started Successfully.");

        _assert2["default"].deepStrictEqual((0, _lodash.keys)(nodeProcess.instance), ["isRunning", "output", "lastMatch", "fulfilled"], "No Instance of child_process should be set");
        (0, _assert2["default"])(!nodeProcess.instance.isRunning, "Process shouldn't run after create");
        _assert2["default"].equal(nodeProcess.command, "node Test.js", "Command should be stored in Process");
        (0, _assert2["default"])(nodeProcess.filter.validate("Started Successfully."), "Filter should be set on given String");
        (0, _assert2["default"])(nodeProcess.emitter instanceof _events.EventEmitter, "emitter should be an instance of EventEmitter");
    });

    it("starts a nodeProcess and waits until it is ready(stdout)", function () {
        var nodeProcess = _NodeProcess2["default"].create("node Test.js", "Started Successfully.");
        var matchSpy = _sinon2["default"].spy();

        nodeProcess.onReady(function (match) {
            return matchSpy(match);
        });
        nodeProcess.run();

        (0, _assert2["default"])(commandSpy.calledWith("node Test.js"), "commandSpy was called with wrong args: \n " + commandSpy.lastCall.args);
        _assert2["default"].deepStrictEqual((0, _lodash.keys)(callbacks), ["stdout", "stderr", "close"], "Callbacks should be set after process.run");

        callbacks.stdout("Started Successfully.");
        (0, _assert2["default"])(matchSpy.calledOnce, "matchSpy wasn't called once");
    });

    it("starts a nodeProcess and waits until it is ready(stderr)", function () {
        callbacks.stderr = null;
        var nodeProcess = _NodeProcess2["default"].create("node Test.js", "Huge Mistake");
        var matchSpy = _sinon2["default"].spy();

        nodeProcess.onReady(function (match) {
            return matchSpy(match);
        });
        nodeProcess.run();

        (0, _assert2["default"])(_circleCoreTypes2["default"].Function.is(callbacks.stderr), "Stderr should be set again");

        callbacks.stderr("Huge Mistake");

        (0, _assert2["default"])(matchSpy.calledOnce, "matchSpy wasn't called once");
    });

    it("starts a process and waits until it is closed", function () {
        callbacks.close = null;
        var nodeProcess = _NodeProcess2["default"].create("node Test.js", "Not necessary");
        var closeSpy = _sinon2["default"].spy();

        nodeProcess.onDeath(function (output) {
            return closeSpy(output);
        });
        nodeProcess.run();

        (0, _assert2["default"])(_circleCoreTypes2["default"].Function.is(callbacks.close), "Close shoud be set again");
        callbacks.stdout("Yes");

        nodeProcess.kill("SIGTERM");
        (0, _assert2["default"])(closeSpy.calledWith(["Yes"]), "closeSpy was called with wrong args: \n " + closeSpy.lastCall.args);
    });
});

//# sourceMappingURL=NodeProcessTest.js.map