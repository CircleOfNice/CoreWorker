"use strict";

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _Process = require("../Process");

var _Process2 = _interopRequireDefault(_Process);

var _NodeProcess = require("../NodeProcess");

var _NodeProcess2 = _interopRequireDefault(_NodeProcess);

var _lodash = require("lodash");

var _TimeoutError = require("../TimeoutError");

var _TimeoutError2 = _interopRequireDefault(_TimeoutError);

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

var test = function () {
    var parameters = {
        promises: [],
        resolve: null,
        spies: {
            kill: _sinon2.default.spy(),
            stdin: _sinon2.default.spy(),
            stdout: _sinon2.default.spy()
        }
    };

    return {
        all: function all() {
            return parameters;
        },
        spies: function spies() {
            return parameters.spies;
        },
        set: function set(params) {
            return (0, _lodash.assign)(parameters, params);
        }
    };
}();

var write = function write(chunk) {
    return test.spies().stdin(chunk);
};

var run = function run() {
    (0, _lodash.assign)(this.instance, {
        isRunning: true
    });
    var promises = test.all().promises;

    setTimeout(function () {
        var resolvedValue = test.all().resolve;

        promises.forEach(function (resolve) {
            return resolve(resolvedValue);
        });
        (0, _lodash.assign)(this.instance, {
            isRunning: false,
            fulfilled: true,
            lastMatch: resolvedValue
        });

        test.set({ promises: [] });
    }.bind(this), 3);
};

var runTimingout = function runTimingout() {
    (0, _lodash.assign)(this.instance, {
        isRunning: true
    });
    setTimeout(function () {
        this.emitter.emit("timeout");
    }.bind(this), 2);
};

var runWithConsoleOutput = function runWithConsoleOutput() {
    var _this = this;

    (0, _lodash.assign)(this.instance, {
        isRunning: true
    });
    this.emitter.on("data", function (data) {
        return _this.store(data.toString());
    });
    this.emitter.on("data", function (data) {
        return _this.validate(data.toString());
    });
    this.emitter.emit("data", "Foo");
    this.emitter.emit("data", "Bar");
    setTimeout(function () {
        this.emitter.emit("timeout");
    }.bind(this), 2);
};

var onReady = function onReady(resolve) {
    test.set({
        promises: test.all().promises.concat(resolve)
    });
};

var onDeath = function onDeath(deferred) {
    test.set({
        promises: test.all().promises.concat(deferred.resolve)
    });
};

var kill = function kill(reason) {
    test.spies().kill(reason);
};

var restoreAndSet = function restoreAndSet(toRestore, toSet, functionName, stubFunction) {
    toRestore.restore();
    _sinon2.default.stub(toSet, functionName, stubFunction);
};

describe("Process", function () {
    before(function () {
        _sinon2.default.stub(_NodeProcess2.default.prototype, "run", run);
        _sinon2.default.stub(_NodeProcess2.default.prototype, "write", write);
        _sinon2.default.stub(_NodeProcess2.default.prototype, "onReady", onReady);
        _sinon2.default.stub(_NodeProcess2.default.prototype, "onDeath", onDeath);
        _sinon2.default.stub(_NodeProcess2.default.prototype, "kill", kill);
        this.clock = _sinon2.default.useFakeTimers();
    });

    after(function () {
        _NodeProcess2.default.prototype.run.restore();
        _NodeProcess2.default.prototype.onReady.restore();
        _NodeProcess2.default.prototype.onDeath.restore();
        _NodeProcess2.default.prototype.kill.restore();
        _NodeProcess2.default.prototype.write.restore();
        this.clock.restore();
    });

    it("creates a new Instance", function () {
        var process = _Process2.default.create("node Test.js", "TestString");

        (0, _assert2.default)(process.instance instanceof _NodeProcess2.default, "Instance should be instanceof NodeProcess");
        (0, _assert2.default)(!process.instance.isRunning(), "Instance shouldn't run after create");
        (0, _assert2.default)(!process.instance.isReady(), "Instanc shouldn't be ready after create");
    });

    it("runs a new Instance and waits until it is ready", function (done) {
        test.set({ resolve: "TestString" });

        var instance = _Process2.default.create("node Test.js", "TestString");

        instance.ready(10).then(function (match) {
            _assert2.default.equal(match, "TestString", "TestString should be resolved");
            done();
        }).catch(done);

        this.clock.tick(3);
    });

    it("runs a new Instance and waits until it is ready exceeding given timeout", function (done) {
        restoreAndSet(_NodeProcess2.default.prototype.run, _NodeProcess2.default.prototype, "run", runTimingout);

        var instance = _Process2.default.create("node Test.js", "TestString");

        instance.ready(3).then(function () {
            done(new Error("Promise shouldn't get resolved"));
        }).catch(function (err) {
            (0, _assert2.default)(_TimeoutError2.default.is(err), "Error is not an instance of TimeoutError");
            _assert2.default.equal(err.message, "Timeout exceeded.");
            done();
        });

        this.clock.tick(2);

        restoreAndSet(_NodeProcess2.default.prototype.run, _NodeProcess2.default.prototype, "run", run);
    });

    it("runs a new Instance, waits until it is ready exceeding given timeout and checks last process output in error", function (done) {
        restoreAndSet(_NodeProcess2.default.prototype.run, _NodeProcess2.default.prototype, "run", runWithConsoleOutput);

        var instance = _Process2.default.create("node Test.js", "TestString");

        instance.ready(3).then(function () {
            done(new Error("Promise shouldn't get resolved"));
        }).catch(function (err) {
            (0, _assert2.default)(_TimeoutError2.default.is(err), "Error is not an instance of TimeoutError");
            _assert2.default.equal(err.message, "Timeout exceeded. Last process output is: Bar");
            done();
        });

        this.clock.tick(2);

        restoreAndSet(_NodeProcess2.default.prototype.run, _NodeProcess2.default.prototype, "run", run);
    });

    it("runs a new Instance and waits until death", function (done) {
        test.set({
            resolve: {
                data: "TestString"
            }
        });

        var instance = _Process2.default.create("node Test.js", "TestString");

        instance.death().then(function (data) {
            _assert2.default.deepStrictEqual(data, { data: "TestString" }, "TestString should be resolved: \n " + (0, _stringify2.default)(data));
            done();
        }).catch(done);

        this.clock.tick(3);
    });

    it("runs a new Instance and waits until death exceeding given timeout", function (done) {
        restoreAndSet(_NodeProcess2.default.prototype.run, _NodeProcess2.default.prototype, "run", runTimingout);

        var instance = _Process2.default.create("node Test.js", "TestString");

        instance.death(1).then(function () {
            done(new Error("Promise shouldn't get resolved."));
        }).catch(function (err) {
            (0, _assert2.default)(_TimeoutError2.default.is(err), "Error is not an instance of TimeoutError");
            _assert2.default.equal(err.message, "Timeout exceeded.");
            done();
        });

        this.clock.tick(2);

        restoreAndSet(_NodeProcess2.default.prototype.run, _NodeProcess2.default.prototype, "run", run);
    });

    it("runs a new Instance, waits until death exceeding given timeout and checks last process output in error", function (done) {
        restoreAndSet(_NodeProcess2.default.prototype.run, _NodeProcess2.default.prototype, "run", runWithConsoleOutput);

        var instance = _Process2.default.create("node Test.js", "TestString");

        instance.death(1).then(function () {
            done(new Error("Promise shouldn't get resolved."));
        }).catch(function (err) {
            (0, _assert2.default)(_TimeoutError2.default.is(err), "Error is not an instance of TimeoutError");
            _assert2.default.equal(err.message, "Timeout exceeded. Last process output is: Bar");
            done();
        });

        this.clock.tick(2);

        restoreAndSet(_NodeProcess2.default.prototype.run, _NodeProcess2.default.prototype, "run", run);
    });

    it("runs a new Instance and returns a stream", function () {
        test.set({ resolve: "TestString" });

        var process = _Process2.default.create("node Test.js", "TestString");
        var stream = process.stream();
        var pipeSpy = _sinon2.default.spy();

        stream.pipe({
            write: pipeSpy,
            on: function on() {},
            once: function once() {},
            emit: function emit() {}
        });
        stream.write("Test");

        (0, _assert2.default)(test.spies().stdin.calledWith(new Buffer("Test")), "stdinSpy was called with wrong args: \n " + test.spies().stdin.lastCall.args);

        process.instance.emitter.emit("data", "Test2");
        (0, _assert2.default)(pipeSpy.calledWith(new Buffer("Test2")), "pipeSpy was called with wrong args: \n " + pipeSpy.lastCall.args);

        _assert2.default.throws(process.stream, "It should only run one instance");
    });
});

//# sourceMappingURL=ProcessTest.js.map