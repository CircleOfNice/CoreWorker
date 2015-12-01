import sinon from "sinon";
import assert from "assert";
import Process from "../Process";
import NodeProcess from "../NodeProcess";
import { assign } from "lodash";

const test = (function() {
    const parameters = {
        promises: [],
        resolve:  null,
        spies:    {
            kill:  sinon.spy(),
            stdin: sinon.spy()
        }
    };

    return {
        all:   () => parameters,
        spies: () => parameters.spies,
        set:   params => assign(parameters, params)
    };
}());

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

const onStatusChange = function(resolve) {
    test.set({
        promises: test.all().promises.concat(resolve)
    });
};

const kill = function(reason) {
    test.spies().kill(reason);
};

const write = chunk => test.spies().stdin(chunk);

describe("Process", function() {
    before(function() {
        sinon.stub(NodeProcess.prototype, "run", run);
        sinon.stub(NodeProcess.prototype, "write", write);
        sinon.stub(NodeProcess.prototype, "onReady", onStatusChange);
        sinon.stub(NodeProcess.prototype, "onDeath", onStatusChange);
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
        test.set({ resolve: "TestString" });

        const instance = Process.create("node Test.js", "TestString");

        instance.ready(2).then(function() {
            done(new Error("Promise shouldn't get resolved"));
        }).catch(function(err) {
            assert.equal(err.message, "Timeout exceeded.");
            done();
        });

        this.clock.tick(2);
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
        test.set({ resolve: "<error> TestString" });

        const instance = Process.create("node Test.js", "TestString");

        instance.death(1).then(function() {
            done(new Error("Promise shouldn't get resolved."));
        }).catch(function(err) {
            assert.equal(err.message, "Timeout exceeded.");
            done();
        });

        this.clock.tick(1);
    });

    it("runs a new Instance and returns a stream", function() {
        test.set({ resolve: "TestString" });

        const process = Process.create("node Test.js", "TestString");
        const stream  = process.stream();
        const pipeSpy = sinon.spy();

        stream.pipe({ write: pipeSpy });
        stream.write("Test");

        assert(test.spies().stdin.calledWith(new Buffer("Test")), `stdinSpy was called with wrong args: \n ${test.spies().stdin.lastCall.args}`);

        process.instance.emitter.emit("data", "Test2");
        assert(pipeSpy.calledWith("Test2"), `pipeSpy was called with wrong args: \n ${pipeSpy.lastCall.args}`);

        assert.throws(process.stream, "It should only run one instance");
    });
});
