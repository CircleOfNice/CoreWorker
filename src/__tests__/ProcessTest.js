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

import sinon from "sinon";
import assert from "assert";
import Process from "../Process";
import NodeProcess from "../NodeProcess";
import { assign } from "lodash";
import TimeoutError from "../TimeoutError";

const test = (function() {
    const parameters = {
        promises: [],
        resolve:  null,
        spies:    {
            kill:   sinon.spy(),
            stdin:  sinon.spy(),
            stdout: sinon.spy()
        }
    };

    return {
        all:   () => parameters,
        spies: () => parameters.spies,
        set:   params => assign(parameters, params)
    };
}());

const write = chunk => test.spies().stdin(chunk);

const run = function() {
    assign(this.instance, {
        isRunning: true
    });
    const promises = test.all().promises;

    setTimeout(function() {
        const resolvedValue = test.all().resolve;

        promises.forEach(resolve => resolve(resolvedValue));
        assign(this.instance, {
            isRunning: false,
            fulfilled: true,
            lastMatch: resolvedValue
        });

        test.set({ promises: [] });
    }.bind(this), 3);
};

const runTimingout = function() {
    assign(this.instance, {
        isRunning: true
    });
    setTimeout(function() {
        this.emitter.emit("timeout");
    }.bind(this), 2);
};

const runWithConsoleOutput = function() {
    assign(this.instance, {
        isRunning: true
    });
    this.emitter.on("data", data => this.store(data.toString()));
    this.emitter.on("data", data => this.validate(data.toString()));
    this.emitter.emit("data", "Foo");
    this.emitter.emit("data", "Bar");
    setTimeout(function() {
        this.emitter.emit("timeout");
    }.bind(this), 2);
};

const onReady = function(resolve) {
    test.set({
        promises: test.all().promises.concat(resolve)
    });
};

const onDeath = function(deferred) {
    test.set({
        promises: test.all().promises.concat(deferred.resolve)
    });
};

const kill = function(reason) {
    test.spies().kill(reason);
};

const restoreAndSet = function(toRestore, toSet, functionName, stubFunction) {
    toRestore.restore();
    sinon.stub(toSet, functionName, stubFunction);
};

describe("Process", function() {
    before(function() {
        sinon.stub(NodeProcess.prototype, "run", run);
        sinon.stub(NodeProcess.prototype, "write", write);
        sinon.stub(NodeProcess.prototype, "onReady", onReady);
        sinon.stub(NodeProcess.prototype, "onDeath", onDeath);
        sinon.stub(NodeProcess.prototype, "kill", kill);
        this.clock = sinon.useFakeTimers();
    });

    after(function() {
        NodeProcess.prototype.run.restore();
        NodeProcess.prototype.onReady.restore();
        NodeProcess.prototype.onDeath.restore();
        NodeProcess.prototype.kill.restore();
        NodeProcess.prototype.write.restore();
        this.clock.restore();
    });

    it("creates a new Instance", function() {
        const process = Process.create("node Test.js", "TestString");

        assert(process.instance instanceof NodeProcess, "Instance should be instanceof NodeProcess");
        assert(!process.instance.isRunning(), "Instance shouldn't run after create");
        assert(!process.instance.isReady(), "Instanc shouldn't be ready after create");
    });

    it("runs a new Instance and waits until it is ready", function(done) {
        test.set({ resolve: "TestString" });

        const instance = Process.create("node Test.js", "TestString");

        instance.ready(10).then(function(match) {
            assert.equal(match, "TestString", "TestString should be resolved");
            done();
        }).catch(done);

        this.clock.tick(3);
    });

    it("runs a new Instance and waits until it is ready exceeding given timeout", function(done) {
        restoreAndSet(NodeProcess.prototype.run, NodeProcess.prototype, "run", runTimingout);

        const instance = Process.create("node Test.js", "TestString");

        instance.ready(3).then(function() {
            done(new Error("Promise shouldn't get resolved"));
        }).catch(function(err) {
            assert(TimeoutError.is(err), "Error is not an instance of TimeoutError");
            assert.equal(err.message, "Timeout exceeded.");
            done();
        });

        this.clock.tick(2);

        restoreAndSet(NodeProcess.prototype.run, NodeProcess.prototype, "run", run);
    });

    it("runs a new Instance, waits until it is ready exceeding given timeout and checks last process output in error", function(done) {
        restoreAndSet(NodeProcess.prototype.run, NodeProcess.prototype, "run", runWithConsoleOutput);

        const instance = Process.create("node Test.js", "TestString");

        instance.ready(3).then(function() {
            done(new Error("Promise shouldn't get resolved"));
        }).catch(function(err) {
            assert(TimeoutError.is(err), "Error is not an instance of TimeoutError");
            assert.equal(err.message, "Timeout exceeded. Last process output is: Bar");
            done();
        });

        this.clock.tick(2);

        restoreAndSet(NodeProcess.prototype.run, NodeProcess.prototype, "run", run);
    });

    it("runs a new Instance and waits until death", function(done) {
        test.set({
            resolve: {
                data: "TestString"
            }
        });

        const instance = Process.create("node Test.js", "TestString");

        instance.death().then(function(data) {
            assert.deepStrictEqual(data, { data: "TestString" }, `TestString should be resolved: \n ${JSON.stringify(data)}`);
            done();
        }).catch(done);

        this.clock.tick(3);
    });

    it("runs a new Instance and waits until death exceeding given timeout", function(done) {
        restoreAndSet(NodeProcess.prototype.run, NodeProcess.prototype, "run", runTimingout);

        const instance = Process.create("node Test.js", "TestString");

        instance.death(1).then(function() {
            done(new Error("Promise shouldn't get resolved."));
        }).catch(function(err) {
            assert(TimeoutError.is(err), "Error is not an instance of TimeoutError");
            assert.equal(err.message, "Timeout exceeded.");
            done();
        });

        this.clock.tick(2);

        restoreAndSet(NodeProcess.prototype.run, NodeProcess.prototype, "run", run);
    });

    it("runs a new Instance, waits until death exceeding given timeout and checks last process output in error", function(done) {
        restoreAndSet(NodeProcess.prototype.run, NodeProcess.prototype, "run", runWithConsoleOutput);

        const instance = Process.create("node Test.js", "TestString");

        instance.death(1).then(function() {
            done(new Error("Promise shouldn't get resolved."));
        }).catch(function(err) {
            assert(TimeoutError.is(err), "Error is not an instance of TimeoutError");
            assert.equal(err.message, "Timeout exceeded. Last process output is: Bar");
            done();
        });

        this.clock.tick(2);

        restoreAndSet(NodeProcess.prototype.run, NodeProcess.prototype, "run", run);
    });

    it("runs a new Instance and returns a stream", function() {
        test.set({ resolve: "TestString" });

        const process = Process.create("node Test.js", "TestString");
        const stream  = process.stream();
        const pipeSpy = sinon.spy();

        stream.pipe({
            write: pipeSpy,
            on:    () => {},
            once:  () => {},
            emit:  () => {}
        });
        stream.write("Test");

        assert(test.spies().stdin.calledWith(new Buffer("Test")), `stdinSpy was called with wrong args: \n ${test.spies().stdin.lastCall.args}`);

        process.instance.emitter.emit("data", "Test2");
        assert(pipeSpy.calledWith(new Buffer("Test2")), `pipeSpy was called with wrong args: \n ${pipeSpy.lastCall.args}`);

        assert.throws(process.stream, "It should only run one instance");
    });
});
